import Dexie from 'dexie';

export const db = new Dexie("WeekendPlannerDB");

db.version(1).stores({
  activities: "++id, name, icon, vibe, color",
  scheduledActivities: "++id, activityId, day, startTime, endTime, location"
});