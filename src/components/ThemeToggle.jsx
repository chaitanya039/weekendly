import { useTheme } from "../theme/useTheme";
import { THEMES } from "../theme/themes";

export default function ThemeToggle() {
  const { themeKey, setThemeKey } = useTheme();
  return (
    <div className="flex items-center gap-2">
      {/* <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Theme</span> */}
      <div className="inline-flex rounded-full bg-white p-1 shadow border border-slate-200">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setThemeKey(key)}
            className={`px-3 md:px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              themeKey === key ? "shadow" : "opacity-60 hover:opacity-100"
            }`}
            style={{
              background: themeKey === key
                ? `linear-gradient(90deg, ${t.gradFrom}, ${t.gradTo})`
                : "transparent",
              color: themeKey === key ? "#ffffff" : "#111827",
            }}
            aria-pressed={themeKey === key}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}