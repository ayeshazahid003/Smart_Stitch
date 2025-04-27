"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate, useSearchParams } from "react-router";
import { updateOrderStatus } from "../../hooks/orderHooks";
import axios from "axios";

export default function OrderPlaced() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPaymentAndUpdateOrder = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");

        if (!orderId) {
          throw new Error("Missing session_id or order_id");
        }

        if (orderId && !sessionId) {
          // if order id is present but the session id is not,  then it means the order was placed with COD option
          await updateOrderStatus(orderId, {
            status: "placed",
            paymentStatus: "pending",
            paymentMethod: "cod",
          });
          // Show confetti effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setShowConfetti(true);
          return;
        }

        // Verify the stripe session
        const response = await axios.get(
          `http://localhost:5000/stripe/verify-session/${sessionId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // Update order status to "paid"
          await updateOrderStatus(orderId, {
            status: "placed",
            paymentStatus: "paid",
            paymentMethod: "card",
          });

          // Show confetti effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setShowConfetti(true);
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError(err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentAndUpdateOrder();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#111827] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/browse")}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#111827] text-white rounded-lg"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() =>
              navigate(`/order-details/${searchParams.get("order_id")}`)
            }
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
