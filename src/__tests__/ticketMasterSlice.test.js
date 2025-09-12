import { describe, expect, it } from "vitest";
import reducer, { fetchTicketmasterEvents } from "../store/slices/ticketmasterSlice";

describe("ticketmasterSlice", () => {
  const initialState = {
    items: [],
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  // ----------------------
  // fetchTicketmasterEvents
  // ----------------------
  it("should set status to loading when fetchTicketmasterEvents.pending", () => {
    const nextState = reducer(initialState, { type: fetchTicketmasterEvents.pending.type });
    expect(nextState.status).toBe("loading");
    expect(nextState.error).toBeNull();
  });

  it("should set items and status when fetchTicketmasterEvents.fulfilled", () => {
    const mockEvents = [{ id: "1", name: "Concert" }];
    const nextState = reducer(initialState, {
      type: fetchTicketmasterEvents.fulfilled.type,
      payload: mockEvents,
    });
    expect(nextState.items).toEqual(mockEvents);
    expect(nextState.status).toBe("succeeded");
  });

  it("should set error and status when fetchTicketmasterEvents.rejected", () => {
    const nextState = reducer(initialState, {
      type: fetchTicketmasterEvents.rejected.type,
      payload: "API error",
    });
    expect(nextState.error).toBe("API error");
    expect(nextState.status).toBe("failed");
  });

  it("should set default error message if rejected without payload", () => {
    const nextState = reducer(initialState, {
      type: fetchTicketmasterEvents.rejected.type,
      payload: undefined,
    });
    expect(nextState.error).toBe("Something went wrong");
    expect(nextState.status).toBe("failed");
  });
});