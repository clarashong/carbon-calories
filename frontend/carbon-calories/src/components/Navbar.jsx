"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-100 shadow-md py-3 px-4 md:px-16 lg:px-32 xl:px-64 flex items-center justify-between z-50">
      <Link href="/" className="font-bold text-xl text-green-900 hover:text-green-700 transition">Carbon Calories</Link>
      <div className="flex-1 flex justify-end">
        <ul className="flex gap-6 max-w-xl w-full justify-end items-center">
          <li>
            <Link href="/logMeal" className="text-blue-700 items-center hover:text-blue-900 font-semibold">Log Meal</Link>
          </li>
          <li>
            <Link href="/history" className="text-blue-700 items-center hover:text-blue-900 font-semibold">History</Link>
          </li>
          <li>
            <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-200 transition" aria-label="Account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-700">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
