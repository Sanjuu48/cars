"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/signin?redirectTo=/admin");
      else if (user.email !== "admin@gmail.com") router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== "admin@gmail.com") {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a]">
        <div className="animate-pulse text-gray-400 text-lg font-medium">
          Checking permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white">
      
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Control and manage your rental fleet.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        <div
          onClick={() => router.push("/admin/add")}
          className="group cursor-pointer rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-10 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-blue-500/10"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold mb-6 mx-auto group-hover:scale-110 transition">
            +
          </div>
          <h2 className="text-2xl font-semibold mb-3">
            Add New Car
          </h2>
          <p className="text-gray-400">
            Add new vehicles to your premium fleet inventory.
          </p>
        </div>

        <div
          onClick={() => router.push("/admin/manage")}
          className="group cursor-pointer rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-10 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-red-500/10"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white text-2xl font-bold mb-6 mx-auto group-hover:scale-110 transition">
            ⚙
          </div>
          <h2 className="text-2xl font-semibold mb-3">
            Manage Cars
          </h2>
          <p className="text-gray-400">
            Update, edit or remove vehicles from your system.
          </p>
        </div>

      </div>
    </div>
  );
}