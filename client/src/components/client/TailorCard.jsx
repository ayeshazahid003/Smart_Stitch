import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import PlaceOrderModal from "../Modals/PlaceOrderModal";

export default function TailorCard({
  _id,
  shopName,
  image,
  rating,
  experience,
  priceRange,
  description,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative group">
      <Link to={`/tailor/${_id}`}>
        <motion.div
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={image || "https://via.placeholder.com/300x200"}
            alt={shopName}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 pb-16">
            {" "}
            {/* Added padding bottom to accommodate button */}
            <h3 className="text-lg font-semibold mb-1">{shopName}</h3>
            <p className="text-md text-gray-500 mb-2 line-clamp-2">
              {description}
            </p>
            <div className="text-md text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <span>⭐</span> {rating || 0}
              </div>
              <div className="flex items-center gap-1">
                <span>🧵</span> {experience || 0} Years Experience
              </div>
              <div className="flex items-center gap-1">
                <span>💰</span> PKR {priceRange?.min?.toLocaleString()} -{" "}
                {priceRange?.max?.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Place Order Button with improved positioning and styling */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="absolute bottom-4 left-4 right-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm text-sm font-medium opacity-90 group-hover:opacity-100"
      >
        Place Order
      </button>

      <PlaceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tailorName={shopName}
        tailorId={_id}
      />
    </div>
  );
}
