import { createContext, useEffect, useMemo, useState } from "react";
import { THEMES } from "./themes";

const ThemeCtx = createContext(null);

const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem("weekendly.theme") || "family"
  );

  const theme = useMemo(() => THEMES[themeKey], [themeKey]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeKey);
    localStorage.setItem("weekendly.theme", themeKey);
  }, [themeKey]);

  return (
    <ThemeCtx.Provider value={{ themeKey, setThemeKey, theme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export { ThemeCtx, ThemeProvider };