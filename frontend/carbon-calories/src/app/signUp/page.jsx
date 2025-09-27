"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const passwordMetrics = [
	{ label: "At least 8 characters", test: pw => pw.length >= 8 },
	{ label: "One uppercase letter", test: pw => /[A-Z]/.test(pw) },
	{ label: "One lowercase letter", test: pw => /[a-z]/.test(pw) },
	{ label: "One number", test: pw => /[0-9]/.test(pw) },
	{ label: "One symbol", test: pw => /[^A-Za-z0-9]/.test(pw) },
];

function getStrength(password) {
	const passed = passwordMetrics.filter(m => m.test(password)).length;
	if (passed <= 2) return "Weak";
	if (passed === 3 || passed === 4) return "Medium";
	if (passed === 5) return "Strong";
	return "";
}

export default function SignUpPage() {

		const [username, setUsername] = useState("");
		const [password, setPassword] = useState("");
		const [confirm, setConfirm] = useState("");
		const [error, setError] = useState("");
		const [success, setSuccess] = useState("");
		const [hasTypedPassword, setHasTypedPassword] = useState(false);
		const router = useRouter();

		const strength = getStrength(password);
		const allMetricsMet = passwordMetrics.every(m => m.test(password));

	const handleSignUp = async e => {
		e.preventDefault();
		setError("");
		setSuccess("");
		if (!username || !password || !confirm) {
			setError("Please fill out all fields.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		if (!allMetricsMet) {
			setError("Password does not meet all requirements.");
			return;
		}
		// TODO: Replace with real sign-up API call
		setSuccess("Account created! You can now log in.");
		setTimeout(() => router.push("/login"), 1500);
	};

	return (
		<main className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden py-10">
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
						<linearGradient id="skyGradientSignUp" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#e3f2fd" />
							<stop offset="100%" stopColor="#b3e0ff" />
						</linearGradient>
					</defs>
					<rect x="0" y="0" width="1440" height="900" fill="url(#skyGradientSignUp)" />
					{/* Green hills */}
					<path d="M0,700 Q360,600 720,700 T1440,700 V900 H0 Z" fill="#8ee596" />
					<path d="M0,800 Q480,750 960,800 T1440,800 V900 H0 Z" fill="#6fd37e" />
				</svg>
			</div>
			<div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-8 z-10">
				<h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Create Account</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSignUp}>
					<label className="text-blue-800 font-semibold">Username</label>
					<input
						className="rounded-lg border border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50"
						type="text"
						placeholder="Choose a username"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
								<label className="text-blue-800 font-semibold">Password</label>
											<input
												className="rounded-lg border border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50"
												type="password"
												placeholder="Create a password"
												value={password}
												onChange={e => {
													setPassword(e.target.value);
													if (!hasTypedPassword && e.target.value.length > 0) {
														setHasTypedPassword(true);
													}
												}}
											/>
											{hasTypedPassword && (
												<div className="mt-2">
													<span className="font-semibold text-blue-700">Password must have:</span>
													<ul className="list-disc ml-6 mt-1 text-sm">
														{passwordMetrics.map((m, idx) => (
															<li key={idx} className={m.test(password) ? "text-green-700" : "text-red-500"}>{m.label}</li>
														))}
													</ul>
													<span className={`block mt-2 font-bold text-${strength === "Strong" ? "green" : strength === "Medium" ? "yellow" : "red"}-600`}>
														Strength: {strength}
													</span>
												</div>
											)}
								<label className="text-blue-800 font-semibold">Confirm Password</label>
								<input
									className="rounded-lg border border-blue-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-blue-50"
									type="password"
									placeholder="Re-enter your password"
									value={confirm}
									onChange={e => setConfirm(e.target.value)}
								/>
					{error && <span className="text-red-600 text-sm mt-2">{error}</span>}
					{success && <span className="text-green-600 text-sm mt-2">{success}</span>}
					<button
						type="submit"
						className="mt-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition"
						disabled={!username.trim() || !password.trim() || !confirm.trim()}
					>
						Create Account
					</button>
				</form>
			</div>
		</main>
	);
}
