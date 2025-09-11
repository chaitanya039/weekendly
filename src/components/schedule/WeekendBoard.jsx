// src/components/board/WeekendBoard.jsx
import React, { useState, useEffect, useMemo } from "react";
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

const weekendDays = ["Saturday", "Sunday"];

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

export default function WeekendBoard() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scheduledActivities = useSelector((state) => state.scheduled.items);
  const activities = useSelector((state) => state.activities.items);

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const groupedByDay = useMemo(() => {
    return weekendDays.reduce((acc, day) => {
      acc[day] = scheduledActivities
        .filter((activity) => activity.day === day)
        .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
      return acc;
    }, {});
  }, [scheduledActivities]);

  useEffect(() => {
    dispatch(fetchScheduledActivities());
    dispatch(fetchActivities());
  }, [dispatch]);

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

  // ✅ Recalculate times and dispatch updates
  function recalcDayTimes(dayActivities, day, dispatch, dayStart = "09:00") {
    if (!dayActivities.length) return;

    let cursor = dayStart; // Start of the day

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
    const targetDay = getTargetDayFromOver(over); // Detect drop column
    if (!targetDay) return;

    // Clone activities in target day
    let targetActivities = [...groupedByDay[targetDay]];

    if (sourceDay === targetDay) {
      // 🔹 Reorder within the same day
      const oldIndex = targetActivities.findIndex((a) => a.id === activeId);
      const newIndex = targetActivities.findIndex((a) => a.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        targetActivities = arrayMove(targetActivities, oldIndex, newIndex);
      }
    } else {
      // 🔹 Move across days
      const sourceActivities = groupedByDay[sourceDay].filter(
        (a) => a.id !== activeId
      );

      const insertIndex = targetActivities.findIndex((a) => a.id === overId);
      targetActivities.splice(
        insertIndex >= 0 ? insertIndex : targetActivities.length,
        0,
        { ...dragged, day: targetDay }
      );

      // Recalculate times for source day
      recalcDayTimes(sourceActivities, sourceDay, dispatch);
    }

    // Recalculate times for target day
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
      className="p-8 rounded-3xl transition-all shadow-sm"
      style={{
        background: `radial-gradient(circle at center, ${theme.circleColor}55, ${theme.glowFrom}22, ${theme.glowTo}11)`,
        backdropFilter: "blur(16px)",
        boxShadow:
          "inset 0 2px 6px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: theme.headline }}
      >
        🌿 Your Weekend Plan
      </h2>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
}
