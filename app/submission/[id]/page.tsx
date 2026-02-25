"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Car {
  _id: string;
  manufacturer: string;
  model: string;
  year: number;
  fuel: string;
  engine: string;
  image: string;
  pricePerDay: number;
  transmission: string;
  drive: string;
  kmPerLitre: number;
}

type Plan = "day" | "week" | "month";

export default function SubmissionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const plan = (searchParams.get("plan") || "day") as Plan;

  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();
        if (!res.ok) setCar(null);
        else setCar(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setCar(null);
      }
    };
    fetchCar();
  }, [id]);

  if (!car)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Car not found
      </p>
    );

  const price =
    plan === "day"
      ? car.pricePerDay
      : plan === "week"
      ? Math.round(car.pricePerDay * 7 * 0.9)
      : Math.round(car.pricePerDay * 30 * 0.75);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/sendBookingEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ car, plan, ...formData }),
    });
    if (res.ok) setSubmitted(true);
    else alert("Something went wrong. Please try again.");
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-blue-100 via-white to-blue-300 px-6 sm:px-12 py-12 flex items-center justify-center">
      <div className="max-w-3xl w-full backdrop-blur-md bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-8 md:p-12 transition-transform hover:scale-[1.02]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Booking: {car.manufacturer} {car.model}
        </h1>

        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <Image
            src={car.image}
            alt={car.model}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        <p className="text-center text-gray-700 mb-8 text-lg">
          You selected the <strong>{plan}</strong> plan. Total price:{" "}
          <strong className="text-blue-600">${price}</strong>.
        </p>

        {submitted ? (
          <p className="text-green-600 font-bold text-lg text-center">
            Booking submitted! We will contact you shortly.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-lg"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Submit Booking
            </button>
          </form>
        )}
      </div>
    </section>
  );
}