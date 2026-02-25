"use client";

import { useEffect, useState } from "react";

interface Car {
  _id: string;
  manufacturer: string;
  model: string;
  year: number;
  image: string;
}

export default function ManageCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });
  const [modalCar, setModalCar] = useState<Car | null>(null);

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cars");
      if (!res.ok) {
        const errData = await safeJson(res);
        throw new Error(errData?.message || `Fetch failed: ${res.status}`);
      }
      const data: Car[] = await res.json();
      setCars(data);
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to load cars.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const confirmDelete = (car: Car) => {
    setModalCar(car);
  };

  const handleDelete = async () => {
    if (!modalCar) return;

    try {
      const res = await fetch(`/api/cars/${modalCar._id}`, {
        method: "DELETE",
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setMessage({
          text: data?.message || `Delete failed with status ${res.status}`,
          type: "error",
        });
        setModalCar(null);
        return;
      }

      setCars((prev) => prev.filter((c) => c._id !== modalCar._id));
      setMessage({ text: "Car deleted successfully!", type: "success" });
    } catch (err: any) {
      setMessage({
        text: err.message || "Unexpected error occurred",
        type: "error",
      });
    } finally {
      setModalCar(null);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(
        () => setMessage({ text: "", type: "" }),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-gray-400 text-lg">
        Loading cars...
      </div>
    );

  return (
    <div className="min-h-screen pt-28 px-6 pb-16 
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white">

      <h1 className="text-5xl font-bold text-center mb-14 
        bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Manage Cars
      </h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No cars available.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cars.map((car) => (
            <li
              key={car._id}
              className="group flex flex-col justify-between p-6 rounded-3xl 
              bg-white/5 backdrop-blur-xl border border-white/10 
              shadow-xl hover:shadow-2xl 
              hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={car.image}
                alt={car.model}
                className="w-full h-44 object-contain rounded-2xl mb-6 
                border border-white/10 bg-black/30"
              />

              <div className="flex flex-col gap-2 mb-6">
                <p className="font-semibold text-lg">
                  {car.manufacturer} {car.model}
                </p>
                <p className="text-gray-400 text-sm">
                  Year: {car.year}
                </p>
              </div>

              <button
                onClick={() => confirmDelete(car)}
                className="mt-auto py-3 rounded-2xl 
                bg-gradient-to-r from-red-500 to-pink-600 
                text-white font-medium shadow-lg 
                hover:shadow-red-500/30 hover:scale-105 
                transition-all duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {message.text && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl text-white 
          shadow-2xl backdrop-blur-md transition-all duration-500
          ${message.type === "success"
            ? "bg-emerald-500/90"
            : "bg-red-500/90"}`}
        >
          {message.text}
        </div>
      )}

      {modalCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
          bg-black/70 backdrop-blur-md">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
            p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">

            <h2 className="text-2xl font-bold mb-4">
              Delete Vehicle?
            </h2>

            <p className="text-gray-400 mb-8">
              Are you sure you want to delete{" "}
              <strong className="text-white">
                {modalCar.manufacturer} {modalCar.model}
              </strong>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModalCar(null)}
                className="px-6 py-2 rounded-2xl 
                bg-white/10 border border-white/10 
                hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-2xl 
                bg-gradient-to-r from-red-500 to-pink-600 
                text-white hover:scale-105 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}