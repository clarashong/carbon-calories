"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Add comparisons array at the top level
const comparisons = [
	{ name: "McDonald's Burger", carbon: 2.5 },
	{ name: "Homemade Tuna Sandwich", carbon: 1.2 },
	{ name: "Store-bought Caesar Salad", carbon: 1.8 },
	{ name: "Vegan Burrito", carbon: 0.9 },
];

export default function MealResultsPage() {
	const router = useRouter();
	const [mealIngredients, setMealIngredients] = useState([]);
	const [mealName, setMealName] = useState("");

	useEffect(() => {
		const stored = localStorage.getItem("mealIngredients");
		if (stored) {
			setMealIngredients(JSON.parse(stored));
		}
		const storedName = localStorage.getItem("mealName");
		if (storedName) {
			setMealName(storedName);
		}
	}, []);

	const totalCarbon = mealIngredients.reduce(
		(sum, ing) => sum + (ing.carbon || 0),
		0
	);

	function MealTrafficLight({ value }) {
		// Define thresholds: green < 1.0, yellow < 2.0, red >= 2.0
		let color = "green";
		if (value >= 2.0) {
			color = "red";
		} else if (value >= 1.0) {
			color = "yellow";
		}

		const colorMap = {
			green: "bg-green-400 border-green-700",
			yellow: "bg-yellow-300 border-yellow-600",
			red: "bg-red-400 border-red-700",
		};

		return (
			<div className="flex flex-col items-center mt-2">
				<span className="text-sm text-blue-800 mb-1">Meal Traffic Light</span>
				<div className="flex gap-2">
					<div
						className={`w-6 h-6 rounded-full border-4 ${colorMap.red} ${
							color === "red" ? "opacity-100" : "opacity-30"
						}`}
					></div>
					<div
						className={`w-6 h-6 rounded-full border-4 ${colorMap.yellow} ${
							color === "yellow" ? "opacity-100" : "opacity-30"
						}`}
					></div>
					<div
						className={`w-6 h-6 rounded-full border-4 ${colorMap.green} ${
							color === "green" ? "opacity-100" : "opacity-30"
						}`}
					></div>
				</div>
				<span className="text-xs mt-1 text-gray-600">
					{color === "green"
						? "Low"
						: color === "yellow"
						? "Medium"
						: "High"}{" "}
					emissions
				</span>
			</div>
		);
	}

	return (
		<main className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden py-10">
			{/* Back arrow button */}
			<button
				className="absolute top-6 left-6 flex items-center text-blue-700 hover:text-blue-900 bg-white bg-opacity-80 rounded-full p-2 shadow"
				onClick={() => router.push("/addIngredients")}
				aria-label="Back to Ingredients Log"
			>
				<svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-1"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
				<span className="ml-1 font-medium">Back to ingredients log</span>
			</button>
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
						<linearGradient
							id="skyGradientResults"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="0%" stopColor="#e3f2fd" />
							<stop offset="100%" stopColor="#b3e0ff" />
						</linearGradient>
					</defs>
					<rect
						x="0"
						y="0"
						width="1440"
						height="900"
						fill="url(#skyGradientResults)"
					/>
					<path
						d="M0,700 Q360,600 720,700 T1440,700 V900 H0 Z"
						fill="#8ee596"
					/>
					<path
						d="M0,800 Q480,750 960,800 T1440,800 V900 H0 Z"
						fill="#6fd37e"
					/>
				</svg>
			</div>
			<div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-8 z-10">
				<h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
					{mealName ? mealName : "Meal Carbon Emissions"}
				</h1>
				{/* Per-ingredient section */}
				<section>
					<h2 className="text-xl font-semibold text-blue-800 mb-2">
						Per-Ingredient Breakdown
					</h2>
					<table className="w-full text-blue-900 mb-4">
						<thead>
							<tr className="border-b">
								<th className="text-left py-1">Ingredient</th>
								<th className="text-left py-1">Quantity</th>
								<th className="text-left py-1">CO₂ (kg)</th>
							</tr>
						</thead>
						<tbody>
							{mealIngredients.map((ing, idx) => (
								<tr key={idx} className="border-b last:border-b-0">
									<td className="py-1">{ing.name}</td>
									<td className="py-1">{ing.quantity}</td>
									<td className="py-1">
										{typeof ing.carbon === "number"
											? ing.carbon.toFixed(2)
											: "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
				{/* Total meal section with traffic light */}
				<section className="flex flex-col items-center mb-4">
					<h2 className="text-xl font-semibold text-blue-800 mb-2">
						Total Meal Emissions
					</h2>
					<div className="flex flex-col items-center gap-2">
						<div className="text-3xl font-bold text-green-700">
							{totalCarbon.toFixed(2)} kg CO₂
						</div>
						{/* Meal traffic light */}
						<MealTrafficLight value={totalCarbon} />
					</div>
				</section>
				{/* Comparisons section */}
				<section>
					<h2 className="text-xl font-semibold text-blue-800 mb-2">
						Comparisons
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{comparisons.map((item, idx) => (
							<div
								key={idx}
								className="bg-blue-100 rounded-lg p-4 flex flex-col items-center shadow"
							>
								<div className="font-semibold text-blue-900 mb-1">
									{item.name}
								</div>
								<div className="text-lg text-green-700 font-bold">
									{item.carbon.toFixed(2)} kg CO₂
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
