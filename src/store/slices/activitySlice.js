import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../db"; // Adjust path if needed

// Async Thunk: Fetch activities from IndexedDB
export const fetchActivities = createAsyncThunk(
  "activities/fetch",
  async () => {
    const activities = await db.activities.toArray();
    return activities;
  }
);

// Async Thunk: Add new activity
export const addActivity = createAsyncThunk(
  "activities/add",
  async (activity) => {
    const id = await db.activities.add(activity);
    return { ...activity, id }; // IndexedDB returns id if auto-incremented
  }
);

// Async Thunk: Delete activity
export const deleteActivity = createAsyncThunk(
  "activities/delete",
  async (id) => {
    await db.activities.delete(id);
    return id;
  }
);

// Async Thunk: Update activity
export const updateActivity = createAsyncThunk(
  "activities/update",
  async (activity) => {
    await db.activities.put(activity);
    return activity;
  }
);

const activitySlice = createSlice({
  name: "activities",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter((act) => act.id !== action.payload);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.items.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default activitySlice.reducer;
