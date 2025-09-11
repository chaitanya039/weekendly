import React from "react";
import { useSelector } from "react-redux";

export default function ExportPlanner() {
  const scheduledActivities = useSelector((state) => state.scheduledActivities.items);

  const handleExport = () => {
    const dataStr = JSON.stringify(scheduledActivities, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-weekend-plan.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export Weekend Plan
      </button>
    </div>
  );
}
