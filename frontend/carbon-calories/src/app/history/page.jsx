"use client";
import { useState, useEffect } from "react";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  useEffect(() => {
    async function fetchMeals() {
      if (!username) return;
      try {
        const res = await fetch(`${api_url.replace(/\/$/, "")}/users/${username}/history`);
        let data = await res.json();
        console.log(data); 
        for (let meal of data.meals) {
          let emissions_low = 0; 
          let emissions_high = 0;
          console.log(meal); 
          for (let ing of meal.ingredientsEmissions) {
            console.log(ing.emissions.low); 
            emissions_low += parseFloat(ing.emissions.low) || 0;
            emissions_high += parseFloat(ing.emissions.high) || 0;
          }
          meal["emissionsLow"] = emissions_low.toFixed(1);
          meal["emissionsHigh"] = emissions_high.toFixed(1);
        }
        setMeals(data.meals || []);
      } catch (err) {
        setMeals([]);
      }
    }
    fetchMeals();
  }, [username]);

  function calculateRating(meal) {
    const avgEmissions = (parseFloat(meal.emissionsLow) + parseFloat(meal.emissionsHigh)) / 2;
    if (avgEmissions < 1) return "🟢";
    if (avgEmissions < 2) return "🟡";
    return "🔴";
  }
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
              <th className="py-3 px-6 border-b text-left text-[#7da63a]">Emissions (kg CO2)</th>
              <th className="py-3 px-6 border-b text-left text-[#7da63a]">Traffic Light Rating</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, idx) => (
              <tr
                key={idx}
                className="cursor-pointer hover:bg-[#e9ede5] transition"
                onClick={() => setSelectedMeal(meal)}
              >
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.name}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.date}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{meal.emissionsLow + " - " + meal.emissionsHigh}</td>
                <td className="py-2 px-6 border-b text-[#4B2E09]">{calculateRating(meal)}</td>
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