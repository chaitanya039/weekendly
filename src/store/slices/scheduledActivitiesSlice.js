import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../db"; // IndexedDB setup

// Async Thunk: Fetch scheduled activities from IndexedDB
export const fetchScheduledActivities = createAsyncThunk(
  "scheduled/fetch",
  async () => {
    const scheduledActivities = await db.scheduledActivities.toArray();
    return scheduledActivities;
  }
);

// Async Thunk: Add a new scheduled activity with validation
export const addScheduledActivity = createAsyncThunk(
  "scheduled/add",
  async (activityData, { getState, rejectWithValue }) => {
    // Access existing activities in Redux
    const { items } = getState().scheduled;

    // Access weekend days available in Redux
    const { weekendDays } = getState().weekend;

    // Ensure the activity is scheduled only Weekends
    const validDays = weekendDays;
    if (!validDays.includes(activityData.day)) {
      return rejectWithValue(
        "Invalid day. Activity must be scheduled on Weekends"
      );
    }

    // Check for time overlap with existing activities
    const overlap = items.some(
      (activity) =>
        activity.day === activityData.day &&
        ((activityData.startTime >= activity.startTime &&
          activityData.startTime < activity.endTime) ||
          (activityData.endTime > activity.startTime &&
            activityData.endTime <= activity.endTime) ||
          (activityData.startTime <= activity.startTime &&
            activityData.endTime >= activity.endTime))
    );

    if (overlap) {
      alert("Time getting overlapped!");
      return rejectWithValue(
        "Time conflict detected. Please choose a different time."
      );
    }

    const id = await db.scheduledActivities.add(activityData);
    return { ...activityData, id };
  }
);

// Async Thunk: Delete a scheduled activity
export const deleteScheduledActivity = createAsyncThunk(
  "scheduled/delete",
  async (id) => {
    await db.scheduledActivities.delete(id);
    return id;
  }
);

// Async Thunk: Update a scheduled activity with validation
export const updateScheduledActivity = createAsyncThunk(
  "scheduled/update",
  async (activityData, { getState, rejectWithValue }) => {
    const { items } = getState().scheduled;

    // Check if time overlaps with other activities
    const overlap = items.some(
      (activity) =>
        activity.id !== activityData.id && // Exclude current activity
        activity.day === activityData.day &&
        ((activityData.startTime >= activity.startTime &&
          activityData.startTime < activity.endTime) ||
          (activityData.endTime > activity.startTime &&
            activityData.endTime <= activity.endTime) ||
          (activityData.startTime <= activity.startTime &&
            activityData.endTime >= activity.endTime))
    );

    if (overlap) {
      return rejectWithValue(
        "Time conflict detected. Please choose a different time."
      );
    }

    await db.scheduledActivities.put(activityData);
    return activityData;
  }
);

// Async Thunk: Sort scheduled activities by day and start time
export const sortScheduledActivities = createAsyncThunk(
  "scheduled/sort",
  async () => {
    const sortedActivities = await db.scheduledActivities
      .toArray()
      .then((activities) => {
        const dayOrder = { Saturday: 1, Sunday: 2 };
        return activities.sort((a, b) => {
          const dayA = dayOrder[a.day] || 99;
          const dayB = dayOrder[b.day] || 99;

          if (dayA !== dayB) return dayA - dayB;
          return a.startTime.localeCompare(b.startTime);
        });
      });
    return sortedActivities;
  }
);

// Async Thunk: Drag and drop update for activities (no time validation)
export const dragAndDropUpdateActivity = createAsyncThunk(
  "scheduled/dragAndDropUpdate",
  async ({ id, newStartTime, newEndTime, newDay }, { getState }) => {
    const { items } = getState().scheduled;

    const activity = items.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");

    const updatedActivity = {
      ...activity,
      startTime: newStartTime ?? activity.startTime,
      endTime: newEndTime ?? activity.endTime,
      day: newDay ?? activity.day,
    };

    await db.scheduledActivities.put(updatedActivity);
    return updatedActivity;
  }
);

const scheduledActivitiesSlice = createSlice({
  name: "scheduled",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch scheduled activities
      .addCase(fetchScheduledActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScheduledActivities.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchScheduledActivities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add a new scheduled activity
      .addCase(addScheduledActivity.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addScheduledActivity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete a scheduled activity
      .addCase(deleteScheduledActivity.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (activity) => activity.id !== action.payload
        );
      })

      // Update a scheduled activity
      .addCase(updateScheduledActivity.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Sort activities
      .addCase(sortScheduledActivities.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      // Drag and drop update
      .addCase(dragAndDropUpdateActivity.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(dragAndDropUpdateActivity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default scheduledActivitiesSlice.reducer;
