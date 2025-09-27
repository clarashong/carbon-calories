"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: "url('/field.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4B2E09] drop-shadow-lg z-10 text-center">
        Welcome to Carbon Calories
      </h1>
      <button
        className="z-10 px-8 py-4 text-lg font-semibold bg-[#7da63a] hover:bg-[#5c7c2b] text-white rounded-lg shadow-lg transition mb-4"
        onClick={() => router.push("/logMeal")}
      >
        Let's save the planet!
      </button>
    </main>
  );
}
