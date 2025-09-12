// Planner.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../theme/useTheme";
import Navbar from "../components/common/Navbar";
import MoodSelector from "../components/MoodSelector";
import ActivityCatalog from "../components/activities/ActivityCatalog";
import WeekendBoard from "../components/schedule/WeekendBoard";
import { addScheduledActivity } from "../store/slices/scheduledActivitiesSlice";
import ScheduleModal from "../components/schedule/ScheduleModal";
import DiscoverActivities from "../components/DiscoverActivities";
import HolidayCalendar from "../components/HolidayCalender";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";

export default function Planner() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [modalData, setModalData] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  // hook into Redux states
  const activitiesStatus = useSelector((s) => s.activities.status);
  const scheduledStatus = useSelector((s) => s.scheduled.status);
  const holidaysStatus = useSelector((s) => s.weekend?.status);

  const isLoading =
    activitiesStatus === "loading" ||
    scheduledStatus === "loading" ||
    holidaysStatus === "loading";

  const handleActivityClick = (activity) => {
    setModalData({ activity, day: "Saturday" });
  };

  const handleSaveSchedule = ({ startTime, endTime, location, day }) => {
    if (!modalData) return;
    const { activity } = modalData;

    dispatch(
      addScheduledActivity({
        activityId: activity.id,
        day,
        startTime,
        endTime,
        location,
      })
    );
    setModalData(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Loader Overlay */}
      {isLoading && (
        <div>
          <Loader text="Fetching your weekend plan..." />
        </div>
      )}

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
          <MoodSelector onMoodChange={setSelectedMood} />
        </section>

        <section>
          <div className="mb-10">
            <ActivityCatalog
              onActivityClick={handleActivityClick}
              mood={selectedMood}
            />
          </div>
          <WeekendBoard />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DiscoverActivities />
          </div>
          <div className="lg:col-span-1">
            <HolidayCalendar />
          </div>
        </div>
      </main>

      {modalData && (
        <ScheduleModal
          activity={modalData.activity}
          day={modalData.day}
          onClose={() => setModalData(null)}
          onSave={handleSaveSchedule}
        />
      )}
      <Footer />
    </div>
  );
}