// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./slices/activitySlice";
import scheduledActivitiesReducer from "./slices/scheduledActivitiesSlice";

export const store = configureStore({
  reducer: {
    activities: activityReducer,
    scheduled: scheduledActivitiesReducer
  },
});