import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
// 1) Import motion from framer-motion
import { motion } from "framer-motion";
import homebg from "../../assets/bg-grid.png"; // ✅ Import the image

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
    className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
    style={{ backgroundImage: `url(${homebg})` }} // ✅ Apply the background image
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        
        {/* Left Content with motion */}
        <motion.div
          // 2) Define initial and animate states to fade in from left
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] bg-clip-text text-transparent"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              lineHeight: "1.2", // Smooth line height for clarity
              paddingTop: "10px",
              paddingBottom: "10px",
              overflowWrap: "break-word", // Prevent cutting
            }}
          >
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
              className="bg-[#51cbff] text-[#020535] px-6 py-3 uppercase tracking-wider hover:bg-[#ffffff] hover:border hover:border-[#9760F4] hover:text-[#9760F4] transition flex items-center justify-center"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4 ml-2 transform -rotate-45" />
            </button>

            {/* Discover More Button */}
            <button
              onClick={() => navigate("/search")}
              className="border border-[#9760F4] text-[#9760F4] px-6 py-3 uppercase tracking-wider hover:bg-[#51cbff] hover:border-[#51cbff] hover:text-[#020535] transition flex items-center justify-center"
            >
              Find Tailors
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