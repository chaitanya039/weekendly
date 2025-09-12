import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../theme/useTheme";
import {
  fetchScheduledActivities,
  dragAndDropUpdateActivity,
  deleteScheduledActivity,
  updateScheduledActivity,
} from "../../store/slices/scheduledActivitiesSlice";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import ScheduledActivityCard from "./ScheduledActivityCard";
import ScheduleModal from "./ScheduleModal";
import { fetchActivities } from "../../store/slices/activitySlice";
import { fetchHolidays } from "../../store/slices/weekendSlice";
import ExportPlanner from "../ExportPlanner";

// Column for each day
function DayColumn({
  day,
  theme,
  entriesForDay,
  activities,
  onEdit,
  onDelete,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: { day },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl p-5 transition-all duration-300 bg-white/70 shadow-md backdrop-blur-md ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <h3
        className="text-xl font-semibold mb-4 tracking-wide"
        style={{ color: theme.headline }}
      >
        {day}
      </h3>

      <SortableContext
        id={day}
        items={entriesForDay.map((e) => `activity-${e.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {entriesForDay?.length > 0 ? (
          <div className="space-y-4">
            {entriesForDay.map((entry, idx) => {
              const activity = activities.find(
                (act) => act.id === entry.activityId
              );
              if (!activity) return null;

              const key =
                entry.id ??
                `${day}-${entry.activityId}-${entry.startTime}-${idx}`;

              return (
                <ScheduledActivityCard
                  key={key}
                  id={entry.id}
                  activityData={{ ...entry, activity }}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400 text-sm italic">
            {`No activities scheduled for ${day}`}
          </div>
        )}
      </SortableContext>
    </div>
  );
}

const WeekendBoard = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scheduledActivities = useSelector((state) => state.scheduled.items);
  const activities = useSelector((state) => state.activities.items);

  // Get weekend + holiday data from Redux
  const { weekendDays, holidays, status } = useSelector(
    (state) => state.weekend
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // It is used for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Group scheduled activities by day, cache it to avoid recalculation
  const groupedByDay = useMemo(() => {
    return weekendDays.reduce((acc, day) => {
      acc[day] = scheduledActivities
        .filter((activity) => activity.day === day)
        .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
      return acc;
    }, {});
  }, [scheduledActivities, weekendDays]);

  // Initial data load
  useEffect(() => {
    dispatch(fetchScheduledActivities());
    dispatch(fetchActivities());
    dispatch(fetchHolidays({ countryCode: "IN", year: 2025 }));
  }, [dispatch]);

  // Detect which holidays fall in this weekend
  const matchingHolidays = useMemo(() => {
    if (!holidays?.length) return [];
    return holidays.filter((h) => {
      const holidayDay = new Date(h.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      return weekendDays.includes(holidayDay);
    });
  }, [holidays, weekendDays]);

  // Helpers for drag-and-drop
  const getTargetDayFromOver = (over) => {
    if (!over) return null;
    if (weekendDays.includes(over.id)) return over.id;

    if (typeof over.id === "string" && over.id.startsWith("activity-")) {
      const idNum = parseInt(over.id.replace("activity-", ""), 10);
      const overActivity = scheduledActivities.find((a) => a.id === idNum);
      if (overActivity) return overActivity.day;
    }

    return over?.data?.current?.day ?? null;
  };

  function addMinutes(timeStr, minutesToAdd) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    return date.toTimeString().slice(0, 5);
  }

  function recalcDayTimes(dayActivities, day, dispatch, dayStart = "09:00") {
    if (!dayActivities.length) return;

    let cursor = dayStart;

    dayActivities.forEach((act) => {
      const duration =
        new Date(`2000-01-01T${act.endTime}`) -
        new Date(`2000-01-01T${act.startTime}`);
      const minutes = duration / 60000;

      const newStart = cursor;
      const newEnd = addMinutes(cursor, minutes);
      cursor = newEnd;

      dispatch(
        dragAndDropUpdateActivity({
          id: act.id,
          newDay: day,
          newStartTime: newStart,
          newEndTime: newEnd,
        })
      );
    });
  }

  const handleDragEnd = ({ active, over }) => {
    if (!active || !over || active.id === over.id) return;

    const activeId = parseInt(active.id.replace("activity-", ""), 10);
    const overId = parseInt(over.id.replace("activity-", ""), 10);

    const dragged = scheduledActivities.find((a) => a.id === activeId);
    if (!dragged) return;

    const sourceDay = dragged.day;
    const targetDay = getTargetDayFromOver(over);
    if (!targetDay) return;

    let targetActivities = [...groupedByDay[targetDay]];

    if (sourceDay === targetDay) {
      const oldIndex = targetActivities.findIndex((a) => a.id === activeId);
      const newIndex = targetActivities.findIndex((a) => a.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        targetActivities = arrayMove(targetActivities, oldIndex, newIndex);
      }
    } else {
      const sourceActivities = groupedByDay[sourceDay].filter(
        (a) => a.id !== activeId
      );

      const insertIndex = targetActivities.findIndex((a) => a.id === overId);
      targetActivities.splice(
        insertIndex >= 0 ? insertIndex : targetActivities.length,
        0,
        { ...dragged, day: targetDay }
      );

      recalcDayTimes(sourceActivities, sourceDay, dispatch);
    }

    recalcDayTimes(targetActivities, targetDay, dispatch);
  };

  const handleDeleteActivity = (id) => {
    dispatch(deleteScheduledActivity(id));
  };

  const handleEditActivity = (activityData) => {
    setSelectedActivity(activityData);
    setShowModal(true);
  };

  const handleSaveActivity = (updatedActivity) => {
    dispatch(updateScheduledActivity(updatedActivity));
    setShowModal(false);
  };

  return (
    <div
      className="p-8 rounded-3xl transition-all"
      id="planner-export"
      style={{
        background: `radial-gradient(circle at center, ${theme.circleColor}55, ${theme.glowFrom}22, ${theme.glowTo}11)`,
        backdropFilter: "blur(16px)",
        boxShadow:
          "inset 0 2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: theme.headline }}
      >
        🌿 Your Weekend Plan
      </h2>

      {/* Holiday Awareness Banner */}
      {status === "succeeded" && weekendDays.length > 2 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-400 to-yellow-300 shadow-md text-center text-white font-semibold">
          🎉 Long Weekend Alert: {weekendDays.join(" – ")}{" "}
          {matchingHolidays.length > 0 &&
            `(${matchingHolidays.map((h) => h.name).join(", ")})`}
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          className={`
    grid gap-6
    grid-cols-1              
    sm:grid-cols-1          
    md:grid-cols-2           
    lg:grid-cols-${weekendDays.length}  
  `}
        >
          {weekendDays.map((day) => (
            <DayColumn
              key={day}
              day={day}
              theme={theme}
              entriesForDay={groupedByDay[day] || []}
              activities={activities}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          ))}
        </div>
      </DndContext>

      <ExportPlanner targetId="planner-export" />

      {showModal && selectedActivity && (
        <ScheduleModal
          activity={selectedActivity}
          day={selectedActivity.day}
          onClose={() => setShowModal(false)}
          onSave={handleSaveActivity}
        />
      )}
    </div>
  );
};

export default WeekendBoard;
