import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../store/slices/activitySlice";
import ActivityCard from "./ActivityCard";
import AddActivityModal from "./AddActivityModal";
import { useTheme } from "../../theme/useTheme";

const ActivityCatalog = ({ onActivityClick, mood }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const activities = useSelector((state) => state.activities.items);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  // Filter by mood if provided
  const filteredActivities = mood
    ? activities.filter((a) => a.vibe.toLowerCase() === mood.toLowerCase())
    : activities;

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: theme.headline }}>
            Activity Catalog
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.body }}>
            {mood ? `Activities for mood: ${mood}` : "Click on an activity to schedule it!"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all w-full sm:w-auto"
          style={{
            backgroundImage: `linear-gradient(90deg, ${theme.gradFrom}, ${theme.gradTo})`,
            color: theme.btnText,
          }}
        >
          + Add Activity
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AddActivityModal onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityCatalog;