import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Async Thunk: Fetch holidays from Calendarific
export const fetchHolidays = createAsyncThunk(
  "weekend/fetchHolidays",
  async ({ countryCode = "IN", year = 2025 }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${
          import.meta.env.VITE_CALENDARIFIC_API_KEY
        }&country=${countryCode}&year=${year}`
      );
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data = await res.json();

      // API returns structure: { response: { holidays: [ { date: { iso }, name, ... } ] } }
      const holidays = data?.response?.holidays || [];

      // Normalize format → match what detectWeekendDays expects
      return holidays.map((h) => ({
        date: h.date.iso,
        name: h.name, 
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Helper: Detect long weekends
function detectWeekendDays(holidays) {
  const today = dayjs();
  const nextSaturday = today.day(6); // 6 = Saturday
  const nextSunday = today.day(0).add(1, "week"); // next Sunday

  let weekendDays = ["Saturday", "Sunday"];

  holidays.forEach((holiday) => {
    const holidayDate = dayjs(holiday.date);

    // Friday before Saturday
    if (holidayDate.isSame(nextSaturday.subtract(1, "day"), "day")) {
      if (!weekendDays.includes("Friday")) weekendDays.unshift("Friday");
    }

    // Monday after Sunday
    if (holidayDate.isSame(nextSunday.add(1, "day"), "day")) {
      if (!weekendDays.includes("Monday")) weekendDays.push("Monday");
    }

    // Thursday bridging
    // if (holidayDate.isSame(nextSaturday.subtract(2, "day"), "day")) {
    //   if (!weekendDays.includes("Thursday")) weekendDays.unshift("Thursday");
    // }

    // Tuesday bridging
    // if (holidayDate.isSame(nextSunday.add(2, "day"), "day")) {
    //   if (!weekendDays.includes("Tuesday")) weekendDays.push("Tuesday");
    // }
  });

  return weekendDays;
}

function detectLongWeekend(holidays) {
  const today = dayjs();
  const nextSaturday = today.day(6); // Next Saturday
  const nextSunday = nextSaturday.add(1, "day");

  // Convert holidays into a Set of dayjs dates (for easy checking)
  const holidaySet = new Set(holidays.map(h => dayjs(h.date).format("YYYY-MM-DD")));

  // Start with Saturday → Sunday
  let block = [nextSaturday, nextSunday];

  // Extend backward
  let prev = nextSaturday.subtract(1, "day");
  // We loop till we found, previous day as holiday
  while (holidaySet.has(prev.format("YYYY-MM-DD"))) {
    block.unshift(prev);
    prev = prev.subtract(1, "day");
  }

  // Extend forward
  let next = nextSunday.add(1, "day");
  while (holidaySet.has(next.format("YYYY-MM-DD"))) {
    block.push(next);
    next = next.add(1, "day");
  }

  // Return names in order (Fri, Sat, Sun, Mon, Tue, …)
  return block.map(d => d.format("dddd"));
}


const weekendSlice = createSlice({
  name: "weekend",
  initialState: {
    holidays: [],
    weekendDays: ["Saturday", "Sunday"],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.holidays = action.payload;
        state.weekendDays = detectLongWeekend(action.payload);
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});


export { detectWeekendDays };
export default weekendSlice.reducer;
