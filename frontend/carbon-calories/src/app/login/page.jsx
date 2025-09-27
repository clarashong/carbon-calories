// This is the login page component
// It handles user authentication
// ...existing code...
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async e => {
		e.preventDefault();
		// Placeholder login logic
		if (!username || !password) {
			setError("Please enter both username and password.");
			return;
		}
		setError("");
		// TODO: Replace with real login API call
		alert(`Logged in as ${username}`);
		router.push("/home");
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
					<div className="absolute inset-0 w-full h-full bg-white bg-opacity-80 -z-10" />
			{/* Blue sky background */}
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
						<linearGradient id="skyGradientLogin" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#e3f2fd" />
							<stop offset="100%" stopColor="#b3e0ff" />
						</linearGradient>
					</defs>
					<rect x="0" y="0" width="1440" height="900" fill="url(#skyGradientLogin)" />
				</svg>
			</div>
					<div className="bg-[#f5f5f0] bg-opacity-90 rounded-xl shadow-lg drop-shadow-[0_8px_32px_rgba(123,86,36,0.35)] p-8 w-full max-w-md flex flex-col gap-8 z-10">
						<h1 className="text-3xl font-bold text-[#4B2E09] text-center mb-2">Login</h1>
						<form className="flex flex-col gap-4" onSubmit={handleLogin}>
							<label className="text-[#4B2E09] font-semibold">Username</label>
							<input
								className="rounded-lg border border-[#d5dcd2] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7da63a] text-[#4B2E09] bg-[#e9ede5]"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
							<label className="text-[#4B2E09] font-semibold">Password</label>
							<input
								className="rounded-lg border border-[#d5dcd2] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7da63a] text-[#4B2E09] bg-[#e9ede5]"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{error && <span className="text-red-600 text-sm mt-2">{error}</span>}
							<button
								type="submit"
								className="mt-2 bg-[#7da63a] hover:bg-[#5c7c2b] text-white font-semibold py-2 rounded-lg transition"
								disabled={!username.trim() || !password.trim()}
							>
								Log In
							</button>
						</form>
						<div className="text-center mt-4">
							<span className="text-[#4B2E09]">Don't have an account? </span>
							<a href="/signUp" className="text-[#7da63a] underline hover:text-[#5c7c2b] font-semibold">Create one.</a>
						</div>
					</div>
				</main>
			);
		}
