import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
// 1) Import motion from framer-motion
import { motion } from "framer-motion";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        
        {/* Left Content with motion */}
        <motion.div
          // 2) Define initial and animate states to fade in from left
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover the Essence of <br className="hidden md:block" />
            Timeless Elegance
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-8">
            Step into a world where fashion meets art. Experience unparalleled
            luxury and sophisticated style with our exclusive collections.
            Discover the perfect blend of timeless elegance and contemporary flair.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {/* Shop the Collection Button */}
            <button
              onClick={() => navigate("/browse")}
              className="bg-black text-white px-6 py-3 uppercase tracking-wider hover:bg-gray-800 transition flex items-center justify-center"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4 ml-2 transform -rotate-45" />
            </button>

            {/* Discover More Button */}
            <button
              onClick={() => navigate("/browse")}
              className="border border-black px-6 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition flex items-center justify-center"
            >
              Discover More
              <ArrowRight className="w-4 h-4 ml-2 transform -rotate-45" />
            </button>
          </div>
        </motion.div>

        {/* Right Image with motion */}
        <motion.div
          // 3) Define initial and animate states to fade in from right
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          // Optionally add a slight delay for a staggered effect
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <img
            src="https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg"
            alt="Model"
            className="object-cover h-auto max-h-[80vh]"
          />
        </motion.div>
      </div>
    </section>
  );
}
