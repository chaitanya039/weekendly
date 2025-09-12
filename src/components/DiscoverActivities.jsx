import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTicketmasterEvents } from "../store/slices/ticketmasterSlice";
import { useTheme } from "../theme/useTheme";

export default function DiscoverActivities() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const events = useSelector((state) => state.ticketmaster.items);

  useEffect(() => {
    const today = new Date();

    // Upcoming Saturday
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (6 - today.getDay()));
    saturday.setHours(0, 0, 0, 0);

    // End of Sunday
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);

    const startDate = saturday.toISOString().replace(/\.\d{3}Z$/, "Z");
    const endDate = sunday.toISOString().replace(/\.\d{3}Z$/, "Z");

    dispatch(fetchTicketmasterEvents({ startDate, endDate }));
  }, [dispatch]);

  return (
    <div
      className="relative py-8 px-6 rounded-3xl overflow-hidden shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${theme.glowFrom}33, ${theme.glowTo}33)`,
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-10 mix-blend-overlay animate-pulse"></div>

      <h2
        className="text-2xl md:text-3xl font-extrabold mb-8 text-center relative z-10"
        style={{ color: theme.headline }}
      >
        ✨ Discover Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl shadow-md border border-transparent hover:border-[var(--accent-color)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg"
              style={{ "--accent-color": theme.circleColor }}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {event.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(event.dates.start.dateTime).toLocaleDateString()} •{" "}
                {new Date(event.dates.start.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {event._embedded?.venues?.[0]?.name || "Online/Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-sm md:text-base text-center col-span-3">
            No upcoming events found for this weekend.
          </p>
        )}
      </div>
    </div>
  );
}
