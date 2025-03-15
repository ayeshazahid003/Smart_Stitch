import React from "react";

export default function BespokeSection() {
  return (
    <section className="bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-white py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full md:w-1/2 px-8 md:px-16">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
            Bespoke Suit & Dress Making Professionals
          </h2>
          <p className="text-lg italic text-[#ffffff]-400 mt-2">High Quality</p>
          <p className="text-md text-[#ffffff]-300 mt-4">
            At vero eos et accusamus et justo odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti cupiditate non provident,
            similique sunt in culpa...
          </p>

          {/* Explore Button */}
          <button className="mt-6 px-6 py-2 border border-[#ffffff]-400 text-white text-sm uppercase tracking-wider hover:bg-white hover:text-black transition">
            Explore
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg"
            alt="Tailor at work"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
