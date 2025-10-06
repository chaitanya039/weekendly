import {
  getTargetDayFromOver,
  recalcDayTimes,
  reorderActivities,
} from "../utils/timeUtils";

export function handleDragEnd({
  active,
  over,
  scheduledActivities,
  groupedByDay,
  weekendDays,
  dispatch,
  dragAndDropUpdateActivity,
}) {
  if (!active || !over || active.id === over.id) return;

  const activeId = parseInt(active.id.replace("activity-", ""), 10);
  const overId = parseInt(over.id.replace("activity-", ""), 10);

  const dragged = scheduledActivities.find((a) => a.id === activeId);
  if (!dragged) return;

  const sourceDay = dragged.day;
  const targetDay = getTargetDayFromOver(over, weekendDays, scheduledActivities);
  if (!targetDay) return;

  let targetActivities = [...groupedByDay[targetDay]];

  if (sourceDay === targetDay) {
    targetActivities = reorderActivities(targetActivities, activeId, overId);
  } else {
    const sourceActivities = groupedByDay[sourceDay].filter(
      (a) => a.id !== activeId
    );

    const overIndex = targetActivities.findIndex((a) => a.id === overId);
    const insertIndex =
      overIndex >= 0 ? overIndex + 1 : targetActivities.length;

    targetActivities.splice(insertIndex, 0, { ...dragged, day: targetDay });

    recalcDayTimes(sourceActivities, sourceDay, dispatch, dragAndDropUpdateActivity);
  }

  recalcDayTimes(targetActivities, targetDay, dispatch, dragAndDropUpdateActivity);
}