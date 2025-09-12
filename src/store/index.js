import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./slices/activitySlice";
import scheduledActivitiesReducer from "./slices/scheduledActivitiesSlice";
import ticketmasterReducer from "./slices/ticketmasterSlice";
import weekendReducer from "./slices/weekendSlice";

export const store = configureStore({
  reducer: {
    activities: activityReducer,
    scheduled: scheduledActivitiesReducer,
    ticketmaster: ticketmasterReducer,
    weekend: weekendReducer
  },
});