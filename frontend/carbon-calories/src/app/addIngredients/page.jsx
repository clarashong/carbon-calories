"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddIngredientsPage() {
  // Back button handler
  const router = useRouter();
  // Get meal name from localStorage (set in logMeal)
  let mealName = "";
  if (typeof window !== "undefined") {
    mealName = localStorage.getItem("mealName") || "";
  }

  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1);

  // Cancel button handler
  const handleCancel = () => {
    router.push("/logMeal");
  };
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

  // Inline edit for ingredient quantity
  const handleEdit = idx => {
    setEditIdx(idx);
    setEditQuantity(ingredients[idx].quantity);
  };
  const handleEditSave = idx => {
    const updated = [...ingredients];
    updated[idx].quantity = editQuantity;
    setIngredients(updated);
    setEditIdx(null);
    setEditQuantity("");
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditQuantity("");
  };
  const handleRemove = idx => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  // Scale all ingredient quantities by scaleFactor
  const handleScale = () => {
    if (!scaleFactor || isNaN(scaleFactor)) return;
    const updated = ingredients.map(ing => {
      // Try to extract number from quantity string
      const match = ing.quantity.match(/([\d.]+)/);
      if (match) {
        const num = parseFloat(match[1]);
        const scaled = (num * scaleFactor).toFixed(2);
        // Replace only the first number in the string
        return {
          ...ing,
          quantity: ing.quantity.replace(match[1], scaled)
        };
      }
      return ing;
    });
    setIngredients(updated);
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

      {/* Back button below navbar */}
      <div className="absolute left-0 top-0 mt-20 ml-6 z-20">
        <button
          onClick={() => router.push('/logMeal')}
          className="flex items-center gap-3 px-3 py-2 bg-white text-[#527b8c] rounded-full shadow-lg border border-[#527b8c] hover:bg-[#e3f2fd] transition"
          type="button"
          style={{ boxShadow: "0 4px 16px rgba(82,123,140,0.12)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6l-6 6 6 6" stroke="#527b8c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-medium text-lg">Log a Meal</span>
        </button>
      </div>

      <div className="bg-[#f5f5f0] bg-opacity-90 rounded-xl shadow-lg drop-shadow-[0_8px_32px_rgba(123,86,36,0.35)] px-10 py-8 w-full max-w-2xl flex flex-col gap-10 z-10 relative">
        {/* Heading with meal name */}
        <h1 className="text-3xl font-bold text-[#4B2E09] text-center mb-2">
          {mealName ? `New Meal: ${mealName}` : "New Meal"}
        </h1>

        {/* Add ingredient form */}
        <div className="flex gap-4 mb-4">
          <input
            className="border rounded px-3 py-2 flex-1 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
            placeholder="Ingredient"
            value={ingredient}
            onChange={e => setIngredient(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 w-40 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
            placeholder="Quantity and units (e.g. 2 cups)"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <button
            className="bg-[#7da63a] text-white px-4 py-2 rounded-full font-semibold text-base shadow hover:bg-[#5c7c2b] transition"
            onClick={handleAdd}
            type="button"
          >
            Add
          </button>
        </div>

        {/* Scale quantities section */}
        <div className="flex items-center gap-3 mb-2">
          <label htmlFor="scaleFactor" className="text-[#4B2E09] font-semibold">Scale quantities:</label>
          <input
            id="scaleFactor"
            type="number"
            min="0.01"
            step="0.01"
            className="border rounded px-2 py-1 w-24 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
            value={scaleFactor}
            onChange={e => setScaleFactor(Number(e.target.value))}
          />
          <button
            className="bg-[#527b8c] text-white px-4 py-1 rounded-full hover:bg-[#34505c]"
            type="button"
            onClick={handleScale}
          >
            Scale
          </button>
        </div>

        {/* Ingredient list with inline edit/remove */}
        <h2 className="text-lg font-semibold text-[#4B2E09] mb-2">Current Ingredients</h2>
        <ul className="mb-4">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-center gap-3 py-1 border-b last:border-b-0 text-[#4B2E09] font-medium">
              <span className="flex-1">{ing.name}</span>
              {editIdx === idx ? (
                <>
                  <input
                    className="border rounded px-2 py-1 w-32 text-[#4B2E09] border-[#d5dcd2] bg-[#e9ede5]"
                    value={editQuantity}
                    onChange={e => setEditQuantity(e.target.value)}
                  />
                  <button className="text-[#527b8c] px-2 font-semibold text-base" onClick={() => handleEditSave(idx)}>Save</button>
                  <button className="text-[#b91c1c] px-2 font-semibold text-base" onClick={handleEditCancel}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="w-32">{ing.quantity}</span>
                  <button className="text-[#527b8c] px-2" onClick={() => handleEdit(idx)}>Edit</button>
                  <button className="text-[#b91c1c] px-2" onClick={() => handleRemove(idx)}>✕</button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* See Meal Emissions button */}
        <div className="flex gap-6 mt-6">
          <button
            onClick={() => router.push('/logMeal')}
            className="flex-1 flex items-center justify-center gap-2 px-0 py-3 bg-[#b91c1c] text-white rounded-full font-semibold text-base shadow-lg border border-[#b91c1c] hover:bg-[#991b1b] transition"
            type="button"
            style={{ boxShadow: "0 2px 8px rgba(185,28,28,0.10)" }}
          >
            <span>Cancel Meal Log</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center bg-[#7da63a] text-white px-0 py-3 rounded-full font-semibold text-base shadow-lg border border-[#7da63a] transition ${ingredients.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#5c7c2b]'}`}
            onClick={handleNext}
            disabled={ingredients.length === 0}
          >
            See Emission Estimates
          </button>
        </div>
      </div>
    </main>
  );
}
