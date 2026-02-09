"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cars } from "@/constants/constants";

export default function SubmissionPage() {
  const params = useParams();
  const id = params?.id;
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as "day" | "week" | "month";

  const carId = Number(id);
  const [car, setCar] = useState<typeof cars[0] | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const foundCar = cars.find((c) => c.id === carId);
    setCar(foundCar || null);
  }, [carId]);

  if (!car) return <p className="text-center mt-20 text-gray-500">Car not found</p>;

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

  const price =
    plan === "day"
      ? car.pricePerDay
      : plan === "week"
      ? Math.round(car.pricePerDay * 7 * 0.9)
      : Math.round(car.pricePerDay * 30 * 0.75);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-400 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Booking for {car.manufacturer} {car.model}
        </h1>
        <p className="mb-6 text-gray-600">
          You selected the <strong>{plan}</strong> plan. Total price: <strong>${price}</strong>.
        </p>

        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ul className="mb-6 list-disc list-inside text-gray-600">
          <li>Fill in your contact details below.</li>
          <li>We will send a confirmation email within 24 hours.</li>
          <li>Please have a valid driver’s license ready at pickup.</li>
          <li>Payment will be collected upon confirmation.</li>
        </ul>

        {submitted ? (
          <p className="text-green-600 font-bold text-lg">
            Booking submitted! We will contact you shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Submit Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
