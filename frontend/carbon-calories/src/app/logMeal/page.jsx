"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Remove static savedMeals, will fetch from backend

export default function LogMealPage() {
  const [recentMeals, setRecentMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/history")
      .then(res => res.json())
      .then(data => {
        const seen = new Set();
        const uniqueMeals = [];
        for (const meal of data.reverse()) {
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
    const results = recentMeals.filter(meal =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, recentMeals]);

  const mealsToShow = searchTerm.trim() ? searchResults : recentMeals;

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden py-16 bg-[#d5dcd2]"
      style={{
        backgroundImage: "url('/field.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-white bg-opacity-40 -z-10" />
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
      {/* Main content directly on background */}
      <h1 className="text-4xl font-bold text-[#4B2E09] text-center mb-10 z-10">Log a Meal</h1>
      <div className="w-full flex flex-col md:flex-row gap-12 max-w-5xl z-10">
        {/* Create new meal card (custom blue) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center font-semibold rounded-2xl shadow-md px-14 py-10 transition border-2 w-full" style={{ backgroundColor: '#527b8c', color: '#fff', borderColor: '#527b8c' }}>
            <span className="text-3xl mb-3" style={{color: '#fff'}}>Create a New Meal</span>
            <span className="text-lg mb-4" style={{color: '#e3f2fd'}}>Start from scratch</span>
            <input
              type="text"
              className="rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2"
              style={{ borderColor: '#e3f2fd', backgroundColor: '#6fa1bc', color: '#fff', boxShadow: '0 0 0 2px #e3f2fd' }}
              placeholder="Enter meal name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#7da63a] hover:bg-[#5c7c2b] text-white font-semibold py-2 px-8 rounded-lg transition"
              onClick={() => {
                localStorage.setItem("mealName", searchTerm);
                router.push("/addIngredients");
              }}
              disabled={!searchTerm.trim()}
            >
              Start
            </button>
          </div>
        </div>
        {/* Previous meals section (custom blue) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="w-full rounded-2xl shadow-lg border p-8 flex flex-col gap-6"
            style={{
              backgroundColor: '#527b8c',
              borderColor: '#527b8c'
            }}
          >
            <h2 className="text-2xl font-semibold text-center" style={{color: '#fff'}}>Choose a Previous Meal</h2>
            <input
              type="text"
              className="rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 mb-2"
              style={{
                borderColor: '#e3f2fd',
                backgroundColor: '#6fa1bc',
                color: '#fff',
                boxShadow: '0 0 0 2px #e3f2fd'
              }}
              placeholder="Search by meal name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div
              className="max-h-80 overflow-y-auto flex flex-col gap-3 border rounded-lg p-3 shadow"
              style={{
                backgroundColor: '#6fa1bc',
                borderColor: '#e3f2fd'
              }}
            >
              {mealsToShow.length === 0 ? (
                <span className="italic" style={{color: '#e3f2fd'}}>No meals found.</span>
              ) : (
                mealsToShow.map(meal => (
                  <button
                    key={meal._id || meal.id || meal.name}
                    className="font-medium rounded-lg px-4 py-3 w-full text-left transition border-2 border-transparent"
                    style={{
                      backgroundColor: '#e3f2fd',
                      color: '#527b8c'
                    }}
                    onClick={() => {
                      router.push("/addIngredients", {
                        state: { meal }
                      });
                    }}
                  >
                    {meal.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}