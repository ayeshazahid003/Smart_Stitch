import React from "react";
import { motion } from "framer-motion";

export default function TailorCard({ image, title, categories }) {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden pb-16 flex flex-col items-center"
      whileHover={{ y: -10 }}  // Moves up by 10px
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="relative w-full h-72 flex items-center justify-center rounded-xl">
        <img src={image} alt={title} className="rounded-lg w-full h-full object-cover" />
      </div>

      {/* Content Section */}
      <h3 className="text-xl font-semibold text-gray-900 mt-4">{title}</h3>
      <p className="text-gray-500 text-sm">{categories}</p>
    </motion.div>
  );
}
