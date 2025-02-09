import React from "react";
import { motion } from "framer-motion";

export default function TailorFeatureSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-20 bg-gray-50">
      {/* Left Content Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg text-left"
      >
        {/* Gradient Title */}
        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 uppercase tracking-wide">
          Seamless Tailoring Experience
        </p>

        {/* Main Heading */}
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mt-3">
          Find Expert <span className="text-indigo-500">Tailors</span> for Every
          Need
        </h2>

        {/* Subtext */}
        <p className="text-gray-700 mt-6 text-lg font-medium">
          500+ Verified Tailoring Professionals
        </p>
        <p className="text-gray-500 text-md mt-2">
          Choose from skilled tailors offering **custom suits, bridal dresses,
          alterations**, and **traditional wear** for every occasion.
        </p>

        <p className="text-gray-700 mt-6 text-lg font-medium">
          Personalized Tailoring at Your Fingertips
        </p>
        <p className="text-gray-500 text-md mt-2">
          Whether you need a quick alteration or a bespoke design, connect with
          top-rated tailors who match your style and budget.
        </p>

        {/* Call-to-Action Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="mt-8 px-8 py-4 bg-black text-white font-bold shadow-lg hover:shadow-xl transition-all"
        >
          EXPLORE TAILORS
        </motion.button>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mt-12 lg:mt-0"
      >
        <motion.img
          src="https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg"
          alt="Tailor Marketplace"
          className="w-full max-w-xl rounded-lg shadow-2xl "
          initial={{ rotate: 10 }} // Image starts tilted
          whileHover={{ rotate: 0, scale: 1.05 }} // Straightens on hover
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}
