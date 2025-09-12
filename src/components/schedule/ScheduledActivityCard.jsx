  // src/components/board/ScheduledActivityCard.jsx
  import { useSortable } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
  import { Edit, MapPin, Trash2 } from "lucide-react";
  import React from "react";

  export default function ScheduledActivityCard({ id, activityData, onEdit, onDelete }) {
    const { activity, startTime, endTime, location } = activityData || {};

    const draggableId = `activity-${id}`;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: draggableId,
      data: { activityData },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: `${activity?.color ?? "#ccc"}1A`,
      borderColor: activity?.color ?? "#ccc",
    };

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="rounded-xl shadow p-3 flex items-start gap-3 border-2 backdrop-blur-sm transition hover:scale-[1.01] hover:cursor-grab"
        style={style}
      >
        <div className="text-3xl">{activity?.icon}</div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-gray-800">{activity?.name}</h4>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: activity?.color ?? "#999", color: "#FFF" }}
            >
              {startTime} - {endTime}
            </span>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>

          <div className="mt-2 flex justify-end gap-3 text-gray-600">
            <button onClick={() => onEdit(activityData)}>
              <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
            </button>
            <button onClick={() => onDelete(activityData.id)}>
              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
            </button>
          </div>
        </div>
      </div>
    );
  }