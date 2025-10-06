import { arrayMove } from "@dnd-kit/sortable";

// ---- Time utility ----
export function addMinutes(timeStr, minutesToAdd) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toTimeString().slice(0, 5);
}

// ---- Drag helper ----
export function getTargetDayFromOver(over, weekendDays, scheduledActivities) {
  if (!over) return null;
  if (weekendDays.includes(over.id)) return over.id;

  if (typeof over.id === "string" && over.id.startsWith("activity-")) {
    const idNum = parseInt(over.id.replace("activity-", ""), 10);
    const overActivity = scheduledActivities.find((a) => a.id === idNum);
    if (overActivity) return overActivity.day;
  }

  return over?.data?.current?.day ?? null;
}

// ---- Recalculate times for a day's activities ----
export function recalcDayTimes(dayActivities, day, dispatch, dragAndDropUpdateActivity, dayStart = "09:00") {
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

// ---- Helper for moving activities ----
export function reorderActivities(targetActivities, activeId, overId) {
  const oldIndex = targetActivities.findIndex((a) => a.id === activeId);
  const newIndex = targetActivities.findIndex((a) => a.id === overId);

  if (oldIndex !== -1 && newIndex !== -1) {
    return arrayMove(targetActivities, oldIndex, newIndex);
  }
  return targetActivities;
}