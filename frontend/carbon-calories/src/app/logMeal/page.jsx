"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Remove static savedMeals, will fetch from backend

export default function LogMealPage() {
  const [mealName, setMealName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mealDate, setMealDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const router = useRouter();

  useEffect(() => {
    // Replace URL with your backend endpoint
    fetch("/api/history")
      .then(res => res.json())
      .then(data => {
        // Filter for unique meal names, most recent first, up to 30
        const seen = new Set();
        const uniqueMeals = [];
        for (const meal of data.reverse()) { // assuming most recent last
          if (!seen.has(meal.name)) {
            seen.add(meal.name);
            uniqueMeals.push(meal);
            if (uniqueMeals.length === 30) break;
          }
        }
        setRecentMeals(uniqueMeals);
      })
      .catch(() => setRecentMeals([]));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    // Simple search filter on recentMeals
    const results = recentMeals.filter(meal =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, recentMeals]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden py-10">
      {/* Blue sky background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="skyGradientLog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3f2fd" />
              <stop offset="100%" stopColor="#b3e0ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1440" height="900" fill="url(#skyGradientLog)" />
          {/* Green hills */}
          <path d="M0,700 Q360,600 720,700 T1440,700 V900 H0 Z" fill="#8ee596" />
          <path d="M0,800 Q480,750 960,800 T1440,800 V900 H0 Z" fill="#6fd37e" />
        </svg>
      </div>
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 w-full max-w-4xl flex flex-col gap-8 z-10">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Log a Meal</h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Option 1: Create new meal */}
          <div className="flex flex-col gap-2 border-b md:border-b-0 md:border-r border-blue-200 pb-6 md:pb-0 md:pr-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Create a new meal</h2>
            <p className="text-blue-700 mb-2 text-sm">Enter a new meal name to log a meal you haven't logged before.</p>
            <input
              className="rounded-lg border border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50"
              type="text"
              placeholder="e.g. Avocado Toast"
              value={mealName}
              onChange={e => setMealName(e.target.value)}
            />
          </div>
          {/* Option 2: Select from recent meals */}
          <div className="flex flex-col gap-2 border-b md:border-b-0 md:border-r border-blue-200 pb-6 md:pb-0 md:pr-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Select from recent meals</h2>
            <p className="text-blue-700 mb-2 text-sm">Quickly log one of your 30 most recent unique meals.</p>
            <div className="max-h-32 overflow-y-auto flex flex-col gap-2 border rounded-lg p-2 bg-blue-50 shadow">
              {recentMeals.length === 0 ? (
                <span className="text-blue-400 italic">No recent meals found.</span>
              ) : (
                recentMeals.map(meal => (
                  <button
                    key={meal._id || meal.id || meal.name}
                    className={`bg-blue-200 hover:bg-blue-300 text-blue-900 font-medium rounded-lg px-4 py-2 w-full text-left transition border-2 ${selectedMeal === meal.name ? 'border-blue-600' : 'border-transparent'}`}
                    onClick={() => {
                      setSelectedMeal(meal.name);
                      setMealName(meal.name);
                    }}
                  >
                    {meal.name}
                  </button>
                ))
              )}
            </div>
          </div>
          {/* Option 3: Search meal history */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Search your meal history</h2>
            <p className="text-blue-700 mb-2 text-sm">Find and log any meal you've logged before by searching its name.</p>
            <input
              type="text"
              className="rounded-lg border border-blue-200 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50 mb-2"
              placeholder="Search by meal name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm.trim() && (
              <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-blue-50 shadow">
                {searchResults.length === 0 ? (
                  <span className="text-blue-400 italic">No matches found.</span>
                ) : (
                  searchResults.map(meal => (
                    <button
                      key={meal._id || meal.id || meal.name}
                      className={`bg-blue-200 hover:bg-blue-300 text-blue-900 font-medium rounded-lg px-4 py-2 w-full text-left transition border-2 ${selectedMeal === meal.name ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedMeal(meal.name);
                        setMealName(meal.name);
                      }}
                    >
                      {meal.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* Date selector applies to all methods */}
        <div className="mb-4 w-full">
          <label className="text-blue-800 font-semibold">Date for this meal log</label>
          <input
            type="date"
            className="rounded-lg border border-blue-200 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50"
            value={mealDate}
            onChange={e => setMealDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <button
          type="button"
          className="mt-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition w-full"
          onClick={() => {
            router.push("/addIngredients");
          }}
          disabled={!mealName.trim()}
        >
          Log Meal
        </button>
      </div>
    </main>
  );
}