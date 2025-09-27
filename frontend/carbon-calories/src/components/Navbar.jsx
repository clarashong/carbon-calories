"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-100 shadow-md py-3 px-6 flex items-center justify-between">
      <div className="font-bold text-xl text-green-900">Carbon Calories</div>
      <ul className="flex gap-6">
        <li>
          <Link href="/logMeal" className="text-blue-700 hover:text-blue-900 font-semibold">Log Meal</Link>
        </li>
        <li>
          <Link href="/history" className="text-blue-700 hover:text-blue-900 font-semibold">History</Link>
        </li>
        <li>
          <Link href="/login" className="text-blue-700 hover:text-blue-900 font-semibold">Login</Link>
        </li>
        <li>
          <Link href="/signUp" className="text-blue-700 hover:text-blue-900 font-semibold">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}
