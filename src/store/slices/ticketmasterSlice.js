import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk: Fetch events from Ticketmaster API (no location filter)
export const fetchTicketmasterEvents = createAsyncThunk(
  "ticketmaster/fetch",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
          import.meta.env.VITE_TICKET_MASTER_API_KEY
        }&startDateTime=${startDate}&endDateTime=${endDate}&size=9&sort=date,desc`
      );
      const data = await res.json();
      return data._embedded?.events || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketmasterSlice = createSlice({
  name: "ticketmaster",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketmasterEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTicketmasterEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTicketmasterEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default ticketmasterSlice.reducer;
