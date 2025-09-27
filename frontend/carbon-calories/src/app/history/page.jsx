import { useEffect, useState } from 'react';

export default function Page() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id") || "");
    }
  }, []);

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
    if (userId) fetchMeals();
  }, [userId]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-900 drop-shadow">Meal History</h1>
      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b text-left">Meal Name</th>
              <th className="py-3 px-6 border-b text-left">Date Logged</th>
              <th className="py-3 px-6 border-b text-left">Emissions</th>
              <th className="py-3 px-6 border-b text-left">Rating</th>
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
export default function Page() {
  return <h1>Hello, Welcome to Carbon Calories!</h1>
}