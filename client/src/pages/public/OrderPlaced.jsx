"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router";

export default function OrderPlaced() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti effect on component mount
    if (!showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowConfetti(true);
    }
  }, [showConfetti]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        {/* Success Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
          className="relative inline-block"
        >
          {/* Background pulse using primary color with reduced opacity */}
          <div className="absolute inset-0 bg-[#111827] rounded-full scale-150 animate-pulse opacity-20" />
          <CheckCircle
            size={80}
            className="relative z-10 text-[#111827] mx-auto"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-3xl font-bold text-gray-800"
        >
          Order Placed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-gray-600"
        >
          Thank you for your purchase! Your order has been successfully placed
          and is being processed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          {/* Solid Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/requests")}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#111827] text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 transition-colors hover:brightness-90"
          >
            <Package className="mr-2" size={20} />
            View Order Details
          </motion.button>

          {/* Outline Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/browse")}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-[#111827] text-[#111827] rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 transition-colors hover:bg-[#111827] hover:text-white"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
