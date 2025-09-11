import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../store/slices/activitySlice";
import ActivityCard from "./ActivityCard";
import AddActivityModal from "./AddActivityModal";
import { useTheme } from "../../theme/useTheme";

export default function ActivityCatalog({ onActivityClick }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const activities = useSelector((state) => state.activities.items);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  return (
    <div className="relative w-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
       <div>
         <h2 className="text-2xl font-bold" style={{ color: theme.headline }}>
          Activity Catalog
        </h2>
         <p
          className="text-sm mt-1 text-center md:text-left"
          style={{ color: theme.body }}
        >
          Click on particular activity to schedule it!
        </p>
       </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          style={{
            backgroundImage: `linear-gradient(90deg, ${theme.gradFrom}, ${theme.gradTo})`,
            color: theme.btnText,
          }}
        >
          + Add Activity
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
          />
        ))}
      </div>

      {/* Scoped Modal (inside catalog only) */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <AddActivityModal onClose={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
