import { useTheme } from "../../theme/useTheme";

export default function Footer() {
  const theme = useTheme();

  return (
    <footer
      className="mx-auto max-w-7xl px-4 md:px-8 py-10 text-sm relative"
    >
    
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Branding */}
        <p className="text-slate-700 text-md font-medium">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold" style={{ color: theme.gradFrom }}>
            Weekendly
          </span>
          . Built with ❤️ for the Atlan assignment.
        </p>

        {/* Right: Links */}
        <nav aria-label="Footer">
          <ul className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="transition-colors duration-200 font-semibold"
                  style={{ color: theme.gradFrom }}
                  onMouseEnter={(e) => (e.target.style.color = theme.gradTo)}
                  onMouseLeave={(e) => (e.target.style.color = theme.gradFrom)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
