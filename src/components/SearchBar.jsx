import { useState } from "react";

export default function SearchBar({ accent, btnBg }) {
  const [q, setQ] = useState("");
  return (
    <form className="mt-6" onSubmit={(e) => e.preventDefault()} aria-label="Search activities">
      <label htmlFor="search" className="sr-only">Search activities</label>
      <div
        className="flex items-center rounded-2xl bg-white shadow-sm ring-1 focus-within:ring-2"
        style={{ borderColor: accent, boxShadow: `0 1px 0 rgba(0,0,0,0.06)` }}
      >
        <input
          id="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter an activity or location"
          className="w-full bg-transparent px-3 py-3 outline-none"
        />
        <button
          className="m-1 rounded-xl px-5 py-2.5 text-white font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: btnBg }}
        >
          Search
        </button>
      </div>
    </form>
  );
}