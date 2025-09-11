import { Link } from "react-router-dom";
import { useTheme } from "../theme/useTheme";
import logo from "../assets/logo.png";
import { Moon, Sun } from "lucide-react"; // Import lucide-react icons
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false); // Toggle for showing the theme menu

  // Detect screen size for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 no-underline">
          <img src={logo} alt="Weekendly Logo" className="h-9 object-contain" />
          <span className="text-lg mt-1.5 uppercase font-[900] text-gray-900">
            Weekendly
          </span>
        </Link>

        {/* Theme toggle button */}
        <div className="relative flex items-center space-x-4">
          {/* Mobile View: Theme toggle button */}
          {isMobile && (
            <button
              className="p-2 rounded-lg"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)} // Toggle theme menu visibility
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`, // Use gradFrom and gradTo for gradient
                color: "#fff", // White icon color
              }}
            >
              {/* Use Sun and Moon icons from lucide-react */}
              {themeMenuOpen ? (
                <Sun size={20} /> // If open, show Sun icon
              ) : (
                <Moon size={20} /> // If closed, show Moon icon
              )}
            </button>
          )}

          {/* Desktop View: Place theme toggler to the right */}
          {!isMobile && (
            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Display theme switcher when the button is clicked */}
        {themeMenuOpen && isMobile && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4">
            <ThemeToggle />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
