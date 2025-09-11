import React from "react";
import { useTheme } from "../../theme/useTheme";

export default function ActivityCard({ activity, onClick }) {
  const { theme } = useTheme();

  const style = {
    background: `linear-gradient(135deg, ${activity.color}33, ${theme.accent}1A)`,
    color: theme.body,
    cursor: "pointer", // change to pointer to show it's clickable
  };

  return (
    <div
      onClick={() => onClick(activity)} // Trigger the modal with the activity data
      className="rounded-xl p-4 shadow-md backdrop-blur-lg transition-all duration-200 transform hover:scale-[1.02]"
      style={style}
    >
      <div className="text-3xl mb-2">{activity.icon}</div>
      <h3
        className="text-lg font-bold truncate"
        style={{ color: theme.headline }}
      >
        {activity.name}
      </h3>
      <p className="text-sm" style={{ color: theme.body }}>
        {activity.vibe}
      </p>
    </div>
  );
}