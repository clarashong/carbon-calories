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
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-900 drop-shadow">Meal History</h1>
      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b text-blue-700 text-left">Meal Name</th>
              <th className="py-3 px-6 border-b text-blue-700 text-left">Date Logged</th>
              <th className="py-3 px-6 border-b text-left text-blue-700">Emissions</th>
              <th className="py-3 px-6 border-b text-left text-blue-700">Rating</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, idx) => (
              <tr
                key={idx}
                className="cursor-pointer hover:bg-green-100 transition"
                onClick={() => setSelectedMeal(meal)}
              >
                <td className="py-2 px-6 border-b">{meal.Name}</td>
                <td className="py-2 px-6 border-b">{meal.Date}</td>
                <td className="py-2 px-6 border-b">{meal.Emissions}</td>
                <td className="py-2 px-6 border-b">{meal.TrafficLight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedMeal && (
        <MealDetails meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </div>
  );
}