import { describe, expect, it } from "vitest";
import reducer, {
  fetchActivities,
  addActivity,
  deleteActivity,
  updateActivity,
} from "../store/slices/activitySlice";

describe("activitySlice", () => {
  const initialState = {
    items: [],
    status: "idle",
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  // ----------------------
  // fetchActivities
  // ----------------------
  it("should set status to loading when fetchActivities.pending", () => {
    const nextState = reducer(initialState, { type: fetchActivities.pending.type });
    expect(nextState.status).toBe("loading");
  });

  it("should set items and status when fetchActivities.fulfilled", () => {
    const mockActivities = [{ id: 1, name: "Hiking" }];
    const nextState = reducer(initialState, {
      type: fetchActivities.fulfilled.type,
      payload: mockActivities,
    });
    expect(nextState.items).toEqual(mockActivities);
    expect(nextState.status).toBe("succeeded");
  });

  // ----------------------
  // addActivity
  // ----------------------
  it("should add a new activity on addActivity.fulfilled", () => {
    const newActivity = { id: 1, name: "Movie Night" };
    const nextState = reducer(initialState, {
      type: addActivity.fulfilled.type,
      payload: newActivity,
    });
    expect(nextState.items).toContainEqual(newActivity);
  });

  // ----------------------
  // deleteActivity
  // ----------------------
  it("should delete an activity on deleteActivity.fulfilled", () => {
    const stateWithActivities = {
      items: [
        { id: 1, name: "Reading" },
        { id: 2, name: "Cycling" },
      ],
      status: "succeeded",
    };

    const nextState = reducer(stateWithActivities, {
      type: deleteActivity.fulfilled.type,
      payload: 1,
    });

    expect(nextState.items).toEqual([{ id: 2, name: "Cycling" }]);
  });

  // ----------------------
  // updateActivity
  // ----------------------
  it("should update an existing activity on updateActivity.fulfilled", () => {
    const stateWithActivities = {
      items: [{ id: 1, name: "Old Activity" }],
      status: "succeeded",
    };

    const updatedActivity = { id: 1, name: "New Activity" };

    const nextState = reducer(stateWithActivities, {
      type: updateActivity.fulfilled.type,
      payload: updatedActivity,
    });

    expect(nextState.items[0].name).toBe("New Activity");
  });

  it("should not update if activity does not exist", () => {
    const stateWithActivities = {
      items: [{ id: 1, name: "Existing Activity" }],
      status: "succeeded",
    };

    const nonExistentUpdate = { id: 99, name: "Ghost Activity" };

    const nextState = reducer(stateWithActivities, {
      type: updateActivity.fulfilled.type,
      payload: nonExistentUpdate,
    });

    expect(nextState.items).toEqual([{ id: 1, name: "Existing Activity" }]);
  });
});