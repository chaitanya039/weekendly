import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../theme/useTheme"; 
import dayjs from "dayjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calender.css";

const HolidayCalendar = () => {
  const { holidays, status } = useSelector((state) => state.weekend);
  const { theme } = useTheme(); 
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [visibleMonthHolidays, setVisibleMonthHolidays] = useState([]);

  // Normalize holidays → Date + Name
  const holidayDates = holidays.map((h) => ({
    date: new Date(h.date),
    name: h.name,
  }));

  // Mark holidays on calendar cells
  const tileContent = ({ date }) => {
    const holiday = holidayDates.find((h) => dayjs(h.date).isSame(date, "day"));
    if (holiday) {
      return (
        <span
          title={holiday.name}
          className="block text-xs font-semibold mt-1"
          style={{ color: theme.gradFrom }}
        >
          🎊
        </span>
      );
    }
    return null;
  };

  // Recalculate holidays when month changes
  useEffect(() => {
    if (status !== "succeeded") return;

    const monthHolidays = holidayDates
      .filter((h) => dayjs(h.date).month() === dayjs(activeMonth).month())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setVisibleMonthHolidays(monthHolidays);
  }, [activeMonth, holidays, status]);

  return (
    <div
      className="p-6 rounded-2xl shadow-lg backdrop-blur-md transition-all"
      style={{
        background: `linear-gradient(145deg, ${theme.gradFrom}66, ${theme.gradFrom}ee, ${theme.gradTo}dd)`,
        color: theme.body,
      }}
    >
      <h3
        className="text-xl font-bold mb-4 text-center tracking-wide"
        style={{ color: theme.headline }}
      >
        📅  Holiday Calendar
      </h3>

      {status !== "succeeded" || holidays.length === 0 ? (
        <div className="p-5 rounded-xl bg-white/20 text-center text-gray-200">
          No holiday data available.
        </div>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden shadow-md mb-4">
            <Calendar
              tileContent={tileContent}
              minDetail="month"
              prev2Label={null}
              next2Label={null}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveMonth(activeStartDate)
              }
              className="w-full border-0 calender-custom"
            />
          </div>

          {/* Monthly holiday list */}
          <div className="mt-4 text-sm">
            {visibleMonthHolidays.length > 0 ? (
              visibleMonthHolidays.map((h, idx) => (
                <p
                  key={`${h.date}-${h.name}-${idx}`}
                  className="mb-1 px-3 py-2 rounded-lg flex items-center justify-between shadow-sm bg-red-200"
                  style={{
                    backgroundColor: `${theme.accent}22`,
                    color: theme.btnText,
                  }}
                >
                  <span>{dayjs(h.date).format("DD MMM")}</span>
                  <span className="font-medium">{h.name}</span>
                </p>
              ))
            ) : (
              <p className="italic text-gray-300 text-center">
                No holidays this month
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HolidayCalendar;