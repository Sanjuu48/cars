"use client";

import Image from "next/image";
import CustomButton from "./CustomButton";

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mx-auto px-6 sm:px-12 min-h-screen 
                        bg-linear-to-b from-blue-400 to-white">
      <div className="flex flex-col xl:flex-row items-center gap-10 min-h-screen">
        <div className="flex-1 pt-32 xl:pt-0">
          <h1 className="font-extrabold leading-tight text-gray-900 text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Find, Book, or Rent a Car <br />
            <span className="text-primary-600">Quickly & Easily</span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-xl text-base sm:text-lg">
            Streamline your car rental experience with our effortless booking
            process. Choose from a wide range of vehicles — all at your fingertips.
          </p>

          <CustomButton
            title="Explore Cars"
            containerStyles="mt-10 bg-blue-200 text-gray-900 rounded-full px-6 py-3 hover:bg-blue-900 hover:text-white transition duration-300"
            handleClick={handleScroll}
          />
        </div>

        <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen">
          <div className="relative xl:w-full w-[90%] xl:h-full h-[590px] z-0">
            <Image
              src="/m3.png"
              alt="M3 E46"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
