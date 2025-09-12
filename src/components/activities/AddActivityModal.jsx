import { useState } from "react";
import { useDispatch } from "react-redux";
import { addActivity } from "../../store/slices/activitySlice";
import { useTheme } from "../../theme/useTheme";

const AddActivityModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [vibe, setVibe] = useState("");
  const [color, setColor] = useState("#4FC3F7");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newActivity = { name, icon, vibe, color };
    await dispatch(addActivity(newActivity));
    onClose();
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
          Add New Activity
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Activity Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            type="text"
            placeholder="Emoji Icon (e.g. 🎮)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            type="text"
            placeholder="vibe"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <div className="flex items-center gap-4">
            <label
              htmlFor="color"
              className="text-sm font-medium"
              style={{ color: theme.body }}
            >
              Pick a Color:
            </label>

            <div className="relative">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-full shadow-md"
                style={{ backgroundColor: color }}
              ></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                {color.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 text-sm rounded-md font-semibold hover:opacity-90 transition-all"
              style={{
                backgroundImage: `linear-gradient(90deg, ${theme.gradFrom}, ${theme.gradTo})`,
                color: theme.btnText,
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddActivityModal;