"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const api_url = process.env.NEXT_PUBLIC_API_URL;

const savedMealsMock = [
  { id: 1, name: "Spaghetti Bolognese" },
  { id: 2, name: "Chicken Salad" },
  { id: 3, name: "Vegetable Stir Fry" },
];

export default function LogMealPage() {
  const [mealName, setMealName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [savedMeals, setSavedMeals] = useState(savedMealsMock);
  const [recentMeals, setRecentMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mealDate, setMealDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const router = useRouter();
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  useEffect(() => {
    async function fetchMeals() {
        console.log("Fetching meals for user:", username);
        if (!username) return;
        try {
          const res = await fetch(`${api_url.replace(/\/$/, "")}/users/${username}/history`);
          let data = await res.json();
          const firstThree = data.slice(0, 3);
          console.log(firstThree); 
          setSavedMeals(firstThree || []);
        } catch (err) {
          setSavedMeals([]);
        }
    }
    fetchMeals(); 
  }, [username]); 

  const handleMealNameChange = (e) => {
    setMealName(e.target.value);
    localStorage.setItem("mealName", e.target.value);
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden py-10 bg-[#d5dcd2]"
      style={{
        backgroundImage: "url('/field.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-white bg-opacity-60 -z-10" />
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
      <div className="bg-[#f5f5f0] bg-opacity-90 rounded-xl shadow-lg drop-shadow-[0_8px_32px_rgba(123,86,36,0.35)] p-8 w-full max-w-md flex flex-col gap-8 z-10">
        <h1 className="text-3xl font-bold text-[#4B2E09] text-center mb-2">Log a Meal</h1>
        <form className="flex flex-col gap-4">
          <label className="text-[#4B2E09] font-semibold">New Meal Name</label>
          <input
            className="rounded-lg border border-[#d5dcd2] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7da63a] text-[#4B2E09] bg-[#e9ede5]"
            type="text"
            placeholder="e.g. Avocado Toast"
            value={mealName}
            onChange={handleMealNameChange}
          />
          <button
            type="button"
            className="mt-2 bg-[#7da63a] hover:bg-[#5c7c2b] text-white font-semibold py-2 rounded-lg transition"
            onClick={() => {
              router.push("/addIngredients");
            }}
            disabled={!mealName.trim()}
          >
            Log New Meal
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[#4B2E09] font-semibold mb-1">Or re-use a saved meal:</span>
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