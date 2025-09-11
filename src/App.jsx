import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import Landing from "./pages/Landing.jsx";
import Planner from "./pages/Planner.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/plan" element={<Planner />} />
      </Routes>
    </ThemeProvider>
  );
}
