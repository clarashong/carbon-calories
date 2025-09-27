"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : "";

  useEffect(() => {
    async function fetchMeals() {
      if (!userId) return;
      try {
        const res = await fetch(`/user/${userId}/meals`);
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        setMeals([]);
      }
    }
    fetchMeals();
  }, [userId]);

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center pt-20 pb-8 px-8 overflow-hidden"
      style={{
        backgroundImage: "url('/field.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-[#4B2E09] drop-shadow">Meal History</h1>
      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="min-w-full bg-[#f5f5f0] bg-opacity-90 border rounded shadow-lg drop-shadow-[0_8px_32px_rgba(123,86,36,0.35)]">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b text-[#7da63a] text-left">Meal Name</th>
              <th className="py-3 px-6 border-b text-[#7da63a] text-left">Date Logged</th>
              <th className="py-3 px-6 border-b text-left text-[#7da63a]">Emissions</th>
              <th className="py-3 px-6 border-b text-left text-[#7da63a]">Rating</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, idx) => (
              <tr
                key={idx}
                className="cursor-pointer hover:bg-[#e9ede5] transition"
                onClick={() => setSelectedMeal(meal)}
              >
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.Name}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.Date}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.Emissions}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.TrafficLight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedMeal && (
        <MealDetails meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </main>
  );
}