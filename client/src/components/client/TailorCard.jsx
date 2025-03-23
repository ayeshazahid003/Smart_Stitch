import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function TailorCard({
  shopName,
  image,
  rating,
  experience,
  priceRange,
  description,
}) {
  return (
    <Link to={`/tailor/${shopName}`}>
      <motion.div
        className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        whileHover={{ y: -10 }} // Moves up by 10px
        transition={{ duration: 0.3 }}
      >
        <img
          src={image || "https://via.placeholder.com/300x200"}
          alt={shopName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{shopName}</h3>
          <p className="text-md text-gray-500 mb-2">{description}</p>
          <div className="text-md text-gray-600 space-y-1">
            <div>⭐ {rating || 0}</div>
            <div>🧵 {experience || 0} Years Experience</div>
            <div>
              💰 PKR {priceRange?.min?.toLocaleString()} -{" "}
              {priceRange?.max?.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
