"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddIngredientsPage() {
  const router = useRouter();
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // Save ingredients to localStorage and go to meal results
  const handleNext = () => {
    if (ingredients.length > 0) {
      localStorage.setItem("mealIngredients", JSON.stringify(ingredients));
      router.push("/mealResults");
    }
  };

  const handleAdd = () => {
    if (ingredient && quantity) {
      setIngredients([...ingredients, { name: ingredient, quantity }]);
      setIngredient("");
      setQuantity("");
    }
  };

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
      {/* Blue sky and green hills background */}
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
            <linearGradient id="skyGradientAddIng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3f2fd" />
              <stop offset="100%" stopColor="#b3e0ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1440" height="900" fill="url(#skyGradientAddIng)" />
          <path d="M0,700 Q360,600 720,700 T1440,700 V900 H0 Z" fill="#8ee596" />
          <path d="M0,800 Q480,750 960,800 T1440,800 V900 H0 Z" fill="#6fd37e" />
        </svg>
      </div>
      <div className="bg-[#f5f5f0] bg-opacity-90 rounded-xl shadow-lg drop-shadow-[0_8px_32px_rgba(123,86,36,0.35)] p-8 w-full max-w-md flex flex-col gap-8 z-10">
        <h1 className="text-2xl font-bold text-[#4B2E09] text-center mb-2">Add Ingredients</h1>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-2 py-1 flex-1 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
            placeholder="Ingredient"
            value={ingredient}
            onChange={e => setIngredient(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 w-24 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
            placeholder="Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <button
            className="bg-[#7da63a] text-white px-3 py-1 rounded hover:bg-[#5c7c2b]"
            onClick={handleAdd}
            type="button"
          >
            Add
          </button>
        </div>
  <h2 className="text-lg font-semibold text-[#4B2E09] mb-2">Current Ingredients</h2>
        <ul className="mb-4">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="flex justify-between items-center py-1 border-b last:border-b-0 text-[#4B2E09] font-medium">
              <span>{ing.name} ({ing.quantity})</span>
            </li>
          ))}
        </ul>
        <button
          className="bg-[#7da63a] text-white px-4 py-2 rounded hover:bg-[#5c7c2b] disabled:opacity-50"
          onClick={handleNext}
          disabled={ingredients.length === 0}
        >
          See Meal Results
        </button>
      </div>
    </main>
  );
}
