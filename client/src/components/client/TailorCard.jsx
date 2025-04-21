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
  services,
  location,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the maximum discount from all services
  const maxDiscount = services?.reduce((max, service) => {
    if (service.discount?.value > max) {
      return service.discount.value;
    }
    return max;
  }, 0);

  return (
    <div className="relative group">
      <Link to={`/tailor/${_id}`}>
        <motion.div
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {maxDiscount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              Up to {maxDiscount}% Off on Services
            </div>
          )}
          <img
            src={image || "https://via.placeholder.com/300x200"}
            alt={shopName}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 pb-16">
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
              {location && location.coordinates && location.address ? (
                <div className="flex items-center gap-1">
                  <a
                    href={`https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>📍</span> View on Map
                  </a>
                </div>
              ) : (
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span>ℹ️</span> Location not available
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>

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
        services={services}
      />
    </div>
  );
}
