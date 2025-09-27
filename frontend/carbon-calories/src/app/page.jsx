"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300">
      {/* Sun above the text */}
  <div className="z-10 flex flex-col items-center mt-2 w-full">
        <div className="w-full flex flex-row items-center justify-start relative">
          {/* Clouds spread across the sky */}
          {/* Left clouds */}
          <svg width="160" height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-10 opacity-80">
            <ellipse cx="60" cy="30" rx="40" ry="18" fill="#fff" />
            <ellipse cx="110" cy="25" rx="25" ry="10" fill="#fff" />
          </svg>
          {/* Center clouds */}
          <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 -translate-x-1/2 top-6 opacity-90">
            <ellipse cx="100" cy="40" rx="60" ry="22" fill="#fff" />
            <ellipse cx="150" cy="30" rx="30" ry="12" fill="#fff" opacity="0.8" />
          </svg>
          {/* Right clouds */}
          <svg width="180" height="70" viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-8 top-14 opacity-70">
            <ellipse cx="80" cy="35" rx="45" ry="16" fill="#fff" />
            <ellipse cx="130" cy="30" rx="28" ry="10" fill="#fff" opacity="0.7" />
          </svg>
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 ml-4 relative z-10">
            {/* Sun rays - deterministic rendering */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const x1 = 55 + Math.cos(angle) * 55;
              const y1 = 55 + Math.sin(angle) * 55;
              const x2 = 55 + Math.cos(angle) * 70;
              const y2 = 55 + Math.sin(angle) * 70;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ffd700"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="55" cy="55" r="45" fill="#ffe066" stroke="#ffd700" strokeWidth="6" />
          </svg>
        </div>
  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900 drop-shadow-lg z-10 text-center">
          Welcome to Carbon Calories
        </h1>
      </div>
      {/* Button */}
      <button
        className="z-10 px-8 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg transition mb-4"
        onClick={() => router.push("/logMeal")}
      >
        Let's save the planet!
      </button>
      {/* Nature SVG background at the bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-2/5 z-0"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Lighter grass */}
        <path
          fill="#8ee596"
          fillOpacity="1"
          d="M0,224L60,202.7C120,181,240,139,360,154.7C480,171,600,245,720,245.3C840,245,960,171,1080,133.3C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        {/* Trees on the hills */}
        {/* Tree 1 */}
        <rect x="220" y="170" width="10" height="40" fill="#7c4700" rx="3" />
        <ellipse cx="225" cy="170" rx="20" ry="18" fill="#3fa34d" />
        {/* Tree 2 */}
        <rect x="400" y="150" width="12" height="48" fill="#7c4700" rx="3" />
        <ellipse cx="406" cy="150" rx="24" ry="20" fill="#3fa34d" />
        {/* Tree 3 */}
        <rect x="900" y="120" width="14" height="56" fill="#7c4700" rx="3" />
        <ellipse cx="907" cy="120" rx="28" ry="22" fill="#3fa34d" />
        {/* Tree 4 */}
        <rect x="1200" y="180" width="10" height="38" fill="#7c4700" rx="3" />
        <ellipse cx="1205" cy="180" rx="18" ry="15" fill="#3fa34d" />
      </svg>
    </main>
  );
}
