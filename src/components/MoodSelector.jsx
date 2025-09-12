import { useState } from "react";

const moods = [
  { label: "All", emoji: "🌍" },
  { label: "Happy", emoji: "😊" },
  { label: "Relaxed", emoji: "😌" },
  { label: "Energetic", emoji: "⚡" },
  { label: "Creative", emoji: "🎨" },
];

const MoodSelector = ({ onMoodChange }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelect = (mood) => {
    setSelectedMood(mood);
    onMoodChange(mood === "All" ? null : mood); 
  };

  return (
    <div className="w-full">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800 text-center md:text-left">
        How’s your weekend vibe?
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleSelect(mood.label)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm md:text-base font-medium shadow-sm transition-all duration-300
              ${
                selectedMood === mood.label
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-101"
              }`}
          >
            <span className="text-lg md:text-xl">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;