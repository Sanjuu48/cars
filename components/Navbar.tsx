"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../app/context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12">
        
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Car Rental Logo"
            width={40}
            height={40}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="hidden sm:inline text-xl font-semibold tracking-tight text-gray-900">
            Car Rental
          </span>
        </Link>

        {loading ? null : user ? (
          <div className="flex items-center gap-4">

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200">
              
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                {user.email.charAt(0).toUpperCase()}
              </div>

              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="rounded-full bg-red-500/90 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/signin"
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 font-medium text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;