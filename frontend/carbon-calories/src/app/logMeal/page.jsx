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
      {/* Main content directly on background */}
      <h1 className="text-4xl font-bold text-[#4B2E09] text-center mb-10 z-10">Log a Meal</h1>
      <div className="w-full flex flex-col md:flex-row gap-12 max-w-5xl z-10">
        {/* Create new meal card (custom blue) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            type="button"
            className="flex flex-col items-center justify-center font-semibold rounded-2xl shadow-md px-14 py-20 transition border-2 w-full"
            style={{
              backgroundColor: '#527b8c',
              color: '#fff',
              borderColor: '#527b8c'
            }}
            onClick={() => router.push("/addIngredients")}
          >
            <span className="text-3xl mb-3" style={{color: '#fff'}}>Create a New Meal</span>
            <span className="text-lg" style={{color: '#e3f2fd'}}>Start from scratch</span>
          </button>
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