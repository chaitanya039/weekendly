import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "../theme/useTheme";
import Navbar from "../components/Navbar";
import MoodSelector from "../components/MoodSelector";
import ActivityCatalog from "../components/activities/ActivityCatalog";
import WeekendBoard from "../components/schedule/WeekendBoard";
import { addScheduledActivity } from "../store/slices/scheduledActivitiesSlice";
import ScheduleModal from "../components/schedule/ScheduleModal";

export default function Planner() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [modalData, setModalData] = useState(null); // Modal data to hold selected activity and day

  // Trigger modal to ask where to add activity (Saturday or Sunday)
  const handleActivityClick = (activity) => {
    setModalData({ activity, day: "Saturday" }); // Default to Saturday initially
  };

  const handleSaveSchedule = ({ startTime, endTime, location, day }) => {
    if (!modalData) return;
    const { activity } = modalData;

    // Ensure the 'day' is properly passed from the modal
    dispatch(
      addScheduledActivity({
        activityId: activity.id,
        day, // Passing the selected day from the modal
        startTime,
        endTime,
        location,
      })
    );

    setModalData(null); // Close modal after saving
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-10 ">
        <section className="text-center md:text-left">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: theme.headline }}
          >
            🎯 My Weekend Planner
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto md:mx-0"
            style={{ color: theme.body }}
          >
            Plan your perfect weekend by selecting your mood and dragging fun
            activities!
          </p>
        </section>

        <section className="mt-6">
          <MoodSelector />
        </section>

        <section>
          {/* Display activity catalog and board */}
          <div className="mb-10">
            <ActivityCatalog onActivityClick={handleActivityClick} />
          </div>
          <div>
            <WeekendBoard />
          </div>
        </section>
      </main>

      {modalData && (
        <ScheduleModal
          activity={modalData.activity}
          day={modalData.day} // Pass the default day (Saturday) here
          onClose={() => setModalData(null)}
          onSave={handleSaveSchedule} // Pass the handleSaveSchedule method
        />
      )}
    </div>
  );
}
