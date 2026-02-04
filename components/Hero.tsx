"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cars, manufacturers, fuels } from "@/constants/constants";

const decades = [
  { title: "1990s", value: "1990s", start: 1990, end: 1999 },
  { title: "2000s", value: "2000s", start: 2000, end: 2009 },
  { title: "2010s", value: "2010s", start: 2010, end: 2019 },
  { title: "2020s", value: "2020s", start: 2020, end: 2029 },
];

const Hero = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [selectedDecade, setSelectedDecade] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");

  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredCars = cars.filter((car) => {
    const matchesManufacturer = selectedManufacturer
      ? car.manufacturer === selectedManufacturer
      : true;

    const matchesFuel = selectedFuel ? car.fuel === selectedFuel : true;

    let matchesDecade = true;
    if (selectedDecade) {
      const decade = decades.find((d) => d.value === selectedDecade);
      if (decade) {
        const carYear = parseInt(car.year, 10);
        matchesDecade = carYear >= decade.start && carYear <= decade.end;
      }
    }

    return matchesManufacturer && matchesFuel && matchesDecade;
  });

  return (
    <section className="mx-auto min-h-screen bg-gradient-to-r from-white to-blue-400 px-6 sm:px-12">
      <div className="flex min-h-screen flex-col items-center gap-10 xl:flex-row">
        <div className="flex-1 pt-32 xl:pt-0">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Find, Book, or Rent a Car <br />
            <span className="text-primary-600">Quickly & Easily</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-600 sm:text-lg">
            Streamline your car rental experience with our effortless booking process.
            Choose from a wide range of vehicles — all at your fingertips.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <button
              type="button"
              onClick={handleScroll}
              className="rounded-full bg-blue-200 px-6 py-3 font-medium text-gray-900 transition duration-300 hover:bg-blue-900 hover:text-white"
            >
              Explore Cars
            </button>

            <div className="flex flex-col gap-2 sm:flex-row items-center mt-2">
              <select
                className="rounded border border-gray-300 px-4 py-2"
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
              >
                <option value="">Manufacturer</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className="rounded border border-gray-300 px-4 py-2"
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
              >
                <option value="">Year</option>
                {decades.map((d) => (
                  <option key={d.value} value={d.value}>{d.title}</option>
                ))}
              </select>
              <select
                className="rounded border border-gray-300 px-4 py-2"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                <option value="">Fuel</option>
                {fuels.map((f) => (
                  <option key={f.value} value={f.value}>{f.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-end justify-end xl:h-screen xl:flex-[1.5]">
          <div className="relative z-0 h-[600px] w-[90%] xl:h-full xl:w-full">
            <Image
              src="/m3.png"
              alt="M3 E46"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>


      <div
        id="discover"
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <Link key={car.id} href={`/cars/${car.id}`} className="group">
              <div className="rounded-lg border border-gray-200 p-4 shadow hover:shadow-lg cursor-pointer transition">
                <h3 className="text-lg font-semibold">
                  {car.manufacturer} {car.model}
                </h3>
                <p className="text-sm text-gray-500">${car.pricePerDay}/day</p>
                <div className="relative h-40 w-full">
                  <Image
                    src={car.image}
                    alt={car.model}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Image src="/transmission.png" alt="Transmission" width={20} height={20} />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src="/drive.png" alt="Drive" width={20} height={20} />
                    <span>{car.drive}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src="/fuel.png" alt="Fuel" width={20} height={20} />
                    <span>{car.kmPerLitre > 0 ? `${car.kmPerLitre} km/L` : "—"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No cars match your filters.
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
