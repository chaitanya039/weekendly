import { describe, expect, it } from "vitest";
import reducer, {
  fetchScheduledActivities,
  addScheduledActivity,
  deleteScheduledActivity,
  updateScheduledActivity,
  sortScheduledActivities,
  dragAndDropUpdateActivity,
} from "../store/slices/scheduledActivitiesSlice";

describe("scheduledActivitiesSlice", () => {
  const initialState = {
    items: [],
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  // ----------------------
  // fetchScheduledActivities
  // ----------------------
  it("should set status to loading when fetchScheduledActivities.pending", () => {
    const nextState = reducer(initialState, { type: fetchScheduledActivities.pending.type });
    expect(nextState.status).toBe("loading");
  });

  it("should set items and status when fetchScheduledActivities.fulfilled", () => {
    const payload = [{ id: 1, name: "Brunch", day: "Saturday" }];
    const nextState = reducer(initialState, {
      type: fetchScheduledActivities.fulfilled.type,
      payload,
    });
    expect(nextState.items).toEqual(payload);
    expect(nextState.status).toBe("succeeded");
  });

  it("should set error when fetchScheduledActivities.rejected", () => {
    const nextState = reducer(initialState, {
      type: fetchScheduledActivities.rejected.type,
      payload: "DB error",
    });
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("DB error");
  });

  // ----------------------
  // addScheduledActivity
  // ----------------------
  it("should add an activity when addScheduledActivity.fulfilled", () => {
    const newActivity = { id: 1, name: "Hiking", day: "Saturday" };
    const nextState = reducer(initialState, {
      type: addScheduledActivity.fulfilled.type,
      payload: newActivity,
    });
    expect(nextState.items).toContainEqual(newActivity);
  });

  it("should set error when addScheduledActivity.rejected", () => {
    const nextState = reducer(initialState, {
      type: addScheduledActivity.rejected.type,
      payload: "Time conflict",
    });
    expect(nextState.error).toBe("Time conflict");
  });

  // ----------------------
  // deleteScheduledActivity
  // ----------------------
  it("should delete an activity when deleteScheduledActivity.fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: "Cycling", day: "Sunday" }],
    };

    const nextState = reducer(stateWithItems, {
      type: deleteScheduledActivity.fulfilled.type,
      payload: 1,
    });

    expect(nextState.items).toEqual([]);
  });

  // ----------------------
  // updateScheduledActivity
  // ----------------------
  it("should update an activity when updateScheduledActivity.fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: "Old Name", day: "Saturday" }],
    };

    const updated = { id: 1, name: "New Name", day: "Saturday" };

    const nextState = reducer(stateWithItems, {
      type: updateScheduledActivity.fulfilled.type,
      payload: updated,
    });

    expect(nextState.items[0].name).toBe("New Name");
  });

  // ----------------------
  // sortScheduledActivities
  // ----------------------
  it("should replace items when sortScheduledActivities.fulfilled", () => {
    const payload = [
      { id: 2, name: "Sunday Activity", day: "Sunday" },
      { id: 1, name: "Saturday Activity", day: "Saturday" },
    ];
    const nextState = reducer(initialState, {
      type: sortScheduledActivities.fulfilled.type,
      payload,
    });
    expect(nextState.items).toEqual(payload);
  });

  // ----------------------
  // dragAndDropUpdateActivity
  // ----------------------
  it("should update an activity when dragAndDropUpdateActivity.fulfilled", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ id: 1, name: "Picnic", startTime: "10:00", endTime: "12:00" }],
    };

    const updated = { id: 1, name: "Picnic", startTime: "11:00", endTime: "13:00" };

    const nextState = reducer(stateWithItems, {
      type: dragAndDropUpdateActivity.fulfilled.type,
      payload: updated,
    });

    expect(nextState.items[0].startTime).toBe("11:00");
  });
});
