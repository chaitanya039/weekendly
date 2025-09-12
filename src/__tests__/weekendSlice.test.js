import { describe, expect, it } from "vitest";
import reducer, { fetchHolidays, detectWeekendDays } from "../store/slices/weekendSlice";

describe("weekendSlice", () => {
  const initialState = {
    holidays: [],
    weekendDays: ["Saturday", "Sunday"],
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  // ----------------------
  // fetchHolidays
  // ----------------------
  it("should set status to loading when fetchHolidays.pending", () => {
    const nextState = reducer(initialState, { type: fetchHolidays.pending.type });
    expect(nextState.status).toBe("loading");
    expect(nextState.error).toBeNull();
  });

  it("should set holidays and weekendDays when fetchHolidays.fulfilled", () => {
    const mockHolidays = [
      { date: "2025-07-05", name: "Mock Saturday Holiday" },
      { date: "2025-07-06", name: "Mock Sunday Holiday" },
    ];

    const nextState = reducer(initialState, {
      type: fetchHolidays.fulfilled.type,
      payload: mockHolidays,
    });

    expect(nextState.status).toBe("succeeded");
    expect(nextState.holidays).toEqual(mockHolidays);
    expect(Array.isArray(nextState.weekendDays)).toBe(true);
    expect(nextState.weekendDays).toContain("Saturday");
    expect(nextState.weekendDays).toContain("Sunday");
  });

  it("should set error and status when fetchHolidays.rejected with payload", () => {
    const nextState = reducer(initialState, {
      type: fetchHolidays.rejected.type,
      payload: "API error",
    });
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("API error");
  });

  it("should use default error when fetchHolidays.rejected without payload", () => {
    const nextState = reducer(initialState, {
      type: fetchHolidays.rejected.type,
      payload: undefined,
    });
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("Something went wrong");
  });
});

describe("detectWeekendDays helper", () => {
  it("should return default Saturday and Sunday when no holidays", () => {
    const result = detectWeekendDays([]);
    expect(result).toEqual(["Saturday", "Sunday"]);
  });

  it("should add Friday if holiday is on the Friday before Saturday", () => {
    const today = new Date();
    const friday = new Date(today.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7))); // next Friday
    const result = detectWeekendDays([{ date: friday.toISOString(), name: "Friday Holiday" }]);
    expect(result).toContain("Friday");
  });

  it("should add Monday if holiday is on the Monday after Sunday", () => {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7))); // next Monday
    const result = detectWeekendDays([{ date: monday.toISOString(), name: "Monday Holiday" }]);
    expect(result).toContain("Monday");
  });
});
