import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { Suspense, lazy } from "react";
import Loader from "./components/common/Loader.jsx";

// Code splitting & lazy loading for improving performance
const Landing = lazy(() => import("./pages/Landing"));
const Planner = lazy(() => import("./pages/Planner"));

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/plan" element={<Planner />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
