import mongoose from "mongoose";
import Offer from "../models/Offer.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const createOffer = async (req, res) => {
  try {
    const { tailorId, amount, description } = req.body;
    const customerId = req.user._id; // From auth middleware

    // Verify tailor exists and is actually a tailor
    const tailor = await User.findOne({ _id: tailorId, role: "tailor" });
    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    const offer = new Offer({
      customer: customerId,
      tailor: tailorId,
      amount: parseFloat(amount),
      description,
    });

    await offer.save();

    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOffers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    const query = role === "tailor" ? { tailor: userId } : { customer: userId };
    const offers = await Offer.find(query)
      .populate("customer", "name email")
      .populate("tailor", "name email shopName")
      .sort("-createdAt");

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const negotiateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { amount, message, accept } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const offer = await Offer.findById(offerId)
      .populate("customer", "name email")
      .populate("tailor", "name email shopName");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Add negotiation to history
    if (amount && message) {
      offer.negotiationHistory.push({
        amount,
        message,
        by: userId,
        accepted: accept || false,
      });
    }

    // Handle acceptance
    if (accept) {
      if (userRole === "tailor") {
        offer.status =
          offer.status === "accepted_by_customer"
            ? "accepted"
            : "accepted_by_tailor";
      } else {
        offer.status =
          offer.status === "accepted_by_tailor"
            ? "accepted"
            : "accepted_by_customer";
      }

      // If both parties have accepted
      if (offer.status === "accepted") {
        // Get the final amount from the last negotiation or original amount
        const finalAmount =
          amount ||
          offer.negotiationHistory[offer.negotiationHistory.length - 1]
            ?.amount ||
          offer.amount;
        offer.finalAmount = finalAmount;

        // Create a new order with correct field names
        const orderData = {
          customerId: offer.customer._id,
          tailorId: offer.tailor._id,
          status: "pending",
          design: {
            customization: {
              description: offer.description,
            },
          },
          utilizedServices: [
            {
              serviceName: "Custom Order",
              price: finalAmount,
            },
          ],
        };

        const order = new Order(orderData);
        await order.save();

        // Link the order to the offer
        offer.convertedToOrder = true;
        offer.orderId = order._id;
      }
    } else if (!accept && amount) {
      // Continue negotiation
      offer.status = "negotiating";
    }

    await offer.save();

    // If an order was created, include it in the response
    if (offer.status === "accepted" && offer.orderId) {
      const order = await Order.findById(offer.orderId)
        .populate("customerId", "name email")
        .populate("tailorId", "name email shopName");

      return res.json({
        success: true,
        offer,
        order,
        message: "Negotiation completed and order created successfully!",
      });
    }

    res.json({
      success: true,
      offer,
      message: accept ? "Offer accepted!" : "Counter offer sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOfferStatus = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Verify user has permission to update status
    const isCustomer = offer.customer.toString() === userId.toString();
    const isTailor = offer.tailor.toString() === userId.toString();

    if (!isCustomer && !isTailor) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Validate status transitions
    const validStatuses = ["rejected", "cancelled", "negotiating"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Only allow cancellation by the appropriate party
    if (status === "cancelled") {
      if (isCustomer) {
        offer.status = status;
      } else {
        return res
          .status(403)
          .json({ message: "Only customers can cancel offers" });
      }
    } else if (status === "rejected") {
      if (isTailor) {
        offer.status = status;
      } else {
        return res
          .status(403)
          .json({ message: "Only tailors can reject offers" });
      }
    } else {
      offer.status = status;
    }

    await offer.save();

    res.json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
