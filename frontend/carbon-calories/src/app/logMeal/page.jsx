"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const savedMeals = [
  { id: 1, name: "Veggie Stir Fry" },
  { id: 2, name: "Chicken Salad" },
  { id: 3, name: "Pasta Primavera" },
];

export default function LogMealPage() {
  const [mealName, setMealName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const router = useRouter();

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
            onChange={e => setMealName(e.target.value)}
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
          <div className="flex flex-col gap-2">
            {savedMeals.map(meal => (
              <button
                key={meal.id}
                className={`bg-[#e9ede5] hover:bg-[#d5dcd2] text-[#4B2E09] font-medium rounded-lg px-4 py-2 transition border-2 ${selectedMeal === meal.id ? 'border-[#7da63a]' : 'border-transparent'}`}
                onClick={() => {
                  setSelectedMeal(meal.id);
                  alert(`Meal selected: ${meal.name}`);
                }}
              >
                {meal.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}