import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const PlaceOrderModal = ({ isOpen, onClose, tailorName }) => {
  const [offerAmount, setOfferAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Offer placed:", {
      amount: offerAmount,
      tailorName,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 shadow-xl rounded-xl z-[70] animate-in fade-in-0 zoom-in-95 duration-200">
          <Dialog.Title className="text-2xl font-semibold mb-6 text-gray-900">
            Place an Offer to {tailorName}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="offerAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Offer Amount (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none mr-2">
                  ₨
                </span>
                <input
                  type="number"
                  id="offerAmount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter amount"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Place Offer
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlaceOrderModal;
