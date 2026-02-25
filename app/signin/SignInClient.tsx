"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const { refreshUser } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Successfully logged in!");
        setSuccess(true);

        await refreshUser();

        router.push(redirectTo);
      } else {
        setMessage(data.error || data.message || "Signin failed");
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-white to-blue-700 px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">Log In</h2>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              success ? "bg-green-200 text-green-800 p-2 rounded" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
