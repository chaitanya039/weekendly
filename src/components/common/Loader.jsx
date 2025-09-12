import { useTheme } from "../../theme/useTheme";

export default function Loader({ text = "Loading..." }) {
  const { theme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm py-10"
    >
      {/* Animated Glow Circle */}
      <div
        className="relative w-12 h-12 mb-4"
        style={{ color: theme.glowFrom }}
      >
        <div
          className="absolute inset-0 rounded-full border-4 animate-spin"
          style={{
            borderColor: `${theme.glowFrom} transparent ${theme.glowTo} transparent`,
          }}
        />
        <div
          className="absolute inset-2 rounded-full backdrop-blur-md"
          style={{
            background: `${theme.circleColor}33`,
            boxShadow: `0 0 12px ${theme.glowFrom}88`,
          }}
        />
      </div>

      {/* Loader Text */}
      <span
        className="font-bold tracking-wide"
        style={{ color: theme.headline }}
      >
        {text}
      </span>
    </div>
  );
}
