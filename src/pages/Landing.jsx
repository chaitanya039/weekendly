import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useTheme } from "../theme/useTheme";
import Footer from "../components/common/Footer";

// Small inline component for the bordered pill above the H1
function TaglinePill({ text, icon = "✈️" }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background: "rgba(255, 255, 255, 0.7)", // Lighter background
        border: `1.5px solid black`,
        color: "black",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default function Landing() {
  const { theme } = useTheme();

  const features = [
    {
      title: "Lot of Choices",
      desc: "Browse 50+ activities across Food, Outdoors, Chill & more.",
      icon: "🗺️",
    },
    {
      title: "Easy Planning",
      desc: "Drag & drop into Saturday / Sunday with auto-sorting.",
      icon: "🧩",
    },
    {
      title: "Best Vibes",
      desc: "Pick a mood – relaxed, energetic, happy or focused.",
      icon: "🎛️",
    },
  ];

  return (
    <div
      className="min-h-screen text-slate-800 relative"
      style={{
        background: `linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,0.95) 40%, rgba(253,244,215,0.15) 100%)`,
      }}
    >
      {/* Background effect */}
      <div
        className="absolute inset-0 blur-2xl opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${theme.glowFrom}, ${theme.glowTo})`,
          mixBlendMode: "multiply",
          zIndex: -1,
        }}
      >
        <div
          className="w-[200px] h-[200px] rounded-full mx-auto"
          style={{
            backgroundColor: theme.circleColor,
            opacity: 0.6,
            filter: "blur(80px)",
          }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
      
        {/* Glow top-left */}
        <div
          className="absolute top-40 left-60 w-[400px] h-[200px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${theme.glowFrom}, transparent 90%)`,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10 py-8 md:py-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 text-left">
            <div className="mt-4">
              <TaglinePill text="Plan Your Weekend" icon="🗓️" />
            </div>

            <h1
              className="mt-4 text-4xl md:text-5xl font-[900] leading-[1.05] tracking-tight"
              style={{
                color: theme.headline,
                fontFamily: "Poppins, system-ui",
              }}
            >
              DESIGN YOUR <span style={{ color: theme.btnBg }}>WEEKEND</span>
            </h1>

            <p className="mt-3 text-md md:text-lg max-w-prose">
              Weekendly helps you design your ideal weekend. Whether you're
              planning a chill day or an adventurous escape, we've got you
              covered.
            </p>

            {/* Quick Suggestions */}
            <div
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Quick suggestions"
            >
              {["Brunch", "Hiking", "Movie Night", "Yoga", "Board Games"].map(
                (x) => (
                  <button
                    key={x}
                    className="rounded-full px-4 py-2 text-sm font-bold"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: `2px solid ${theme.gradFrom}`,
                      boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
                      transition: "background-color 0.3s ease",
                      color: `${theme.gradFrom}`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = theme.gradFrom;
                      e.target.style.color = "#FFF";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#FFF";
                      e.target.style.color = theme.gradFrom;
                    }}
                  >
                    {x}
                  </button>
                )
              )}
            </div>

            {/* CTA: Start Planning Button */}
            <div className="mt-8">
              <Link
                to={"/plan"}
                className="px-6 py-2.5 text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,
                }}
              >
                Start Planning
              </Link>
            </div>
          </div>

          {/* Right: Hero PNG */}
          <div className="flex-1 flex justify-center md:justify-end relative">
            <img
              src={theme.hero}
              alt={`${theme.label} hero`}
              className="w-full max-w-[600px] h-auto object-contain relative z-10"
              style={{ borderRadius: 0, background: "transparent" }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <main className="mx-auto max-w-7xl px-4 md:px-8">
        <section id="features" className="py-12 md:py-16">
          <h2
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ color: theme.headline }}
          >
            Why You’ll Love Weekendly
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  boxShadow: `
    2px 2px 6px rgba(0,0,0,0.08),
    -2px -2px 6px rgba(255,255,255,0.6)
  `,
                }}
              >
                <div className="text-4xl">{f.icon}</div>
                <h3
                  className="mt-4 text-lg font-semibold"
                  style={{ color: theme.headline }}
                >
                  {f.title}
                </h3>
                <p className="mt-2 text-slate-600 text-sm">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="my-16 overflow-hidden rounded-3xl relative"
          style={{
            background: "rgba(255,255,255,0.75)",
            boxShadow: `
    inset 2px 2px 6px rgba(0,0,0,0.08),
    inset -2px -2px 6px rgba(255,255,255,0.6)
  `,
          }}
        >
          <div className="rounded-[1.35rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3
                className="text-2xl md:text-3xl font-bold"
                style={{ color: theme.headline }}
              >
                Weekend. Planned. Perfectly.
              </h3>
              <p className="text-slate-600 mt-2 max-w-md">
                Start with a theme, add activities, then drag & drop your
                perfect timeline.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="#features"
                className="rounded-xl px-5 py-2.5 font-semibold no-underline"
                style={{
                  border: `2px solid ${theme.accent}`,
                  color: theme.gradFrom,
                  background: "rgba(255,255,255,0.6)",
                  boxShadow: `
              2px 2px 12px rgba(0,0,0,0.1),
              -2px -2px 12px rgba(255,255,255,0.8)
            `,
                }}
              >
                View Demo
              </a>

              {/* Neon button */}
              <Link
                to="/plan"
                className="relative rounded-xl font-semibold no-underline"
              >
                <span
                  className="block rounded-[11px] px-6 py-2.5 shadow-lg transition-transform duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,
                    color: theme.btnText,
                    boxShadow: `
                0 0 12px ${theme.gradFrom}80,
                0 0 24px ${theme.gradTo}80
              `,
                  }}
                >
                  Start Planning
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
