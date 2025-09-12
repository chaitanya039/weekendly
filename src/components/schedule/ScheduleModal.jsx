import React, { useState, useEffect } from "react";
import { useTheme } from "../../theme/useTheme";
import { useSelector } from "react-redux";

export default function ScheduleModal({ activity, day, onClose, onSave }) {
  const { theme } = useTheme();

  // Retrieve weekend days from Redux Store
  const weekendDays = useSelector((state) => state.weekend.weekendDays);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState(day || "Saturday");

  useEffect(() => {
    if (activity) {
      setStartTime(activity.startTime || "");
      setEndTime(activity.endTime || "");
      setLocation(activity.location || "");
    }
  }, [activity]);

  const handleSave = () => {
    onSave({
      id: activity.id,
      activityId: activity.activityId,
      startTime,
      endTime,
      location,
      day: selectedDay,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay Background */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] rounded-2xl" />

      {/* Modal Panel */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-6 w-full max-w-md mx-4">
        <h3
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: theme.headline }}
        >
          Edit {activity?.name} on {selectedDay}
        </h3>

        <div className="space-y-4">
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: theme.body }}
            >
              Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {weekendDays.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: theme.body }}
            >
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: theme.body }}
            >
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: theme.body }}
            >
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Park, Cafe"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm rounded-md font-semibold hover:opacity-90 transition-all"
            style={{
              backgroundImage: `linear-gradient(90deg, ${theme.gradFrom}, ${theme.gradTo})`,
              color: theme.btnText,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
