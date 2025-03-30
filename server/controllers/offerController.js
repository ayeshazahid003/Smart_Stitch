import Offer from "../models/Offer.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { sendNotification } from "../helper/notificationHelper.js";

export const createOffer = async (req, res) => {
  try {
    const {
      tailorId,
      amount,
      description,
      selectedServices,
      extraServices,
      totalItems,
    } = req.body;
    const customerId = req.user._id;

    console.log("Creating offer with data:", {
      customerId,
      tailorId,
      amount,
      description,
      selectedServices,
      extraServices,
      totalItems,
    });

    // Validate required fields
    if (
      !tailorId ||
      !amount ||
      !description ||
      !selectedServices ||
      !totalItems
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate services array
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one service must be selected",
      });
    }

    // Create new offer
    const offer = new Offer({
      customer: customerId,
      tailor: tailorId,
      amount,
      description,
      selectedServices,
      extraServices: extraServices || [],
      totalItems,
      status: "pending",
      negotiationHistory: [
        {
          amount,
          message: description,
          by: customerId,
        },
      ],
    });

    await offer.save();

    // Send notification to tailor
    await sendNotification({
      userId: tailorId,
      type: "new_offer",
      message: `You have received a new offer of ₨${amount} for ${totalItems} items`,
      relatedId: offer._id,
      onModel: "Offer",
    });

    // Populate customer and tailor details
    const populatedOffer = await offer.populate([
      { path: "customer", select: "name email" },
      { path: "tailor", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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

        // Send notification to customer about tailor's acceptance
        await sendNotification({
          userId: offer.customer._id,
          type: "offer_accepted",
          message: `Your offer of ₨${
            amount || offer.amount
          } has been accepted by ${offer.tailor.shopName}`,
          relatedId: offer._id,
          onModel: "Offer",
        });
      } else {
        offer.status =
          offer.status === "accepted_by_tailor"
            ? "accepted"
            : "accepted_by_customer";

        // Send notification to tailor about customer's acceptance
        await sendNotification({
          userId: offer.tailor._id,
          type: "offer_accepted",
          message: `The customer has accepted your counter-offer of ₨${
            amount || offer.amount
          }`,
          relatedId: offer._id,
          onModel: "Offer",
        });
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

        // Create a new order with correct fields
        const orderData = {
          customerId: offer.customer._id,
          tailorId: offer.tailor._id,
          status: "pending", // Changed from pending_payment to pending
          pricing: {
            subtotal: finalAmount, // Set required subtotal
            total: finalAmount, // Set required total
            campaignDiscount: 0,
            voucherDiscount: 0,
          },
          design: {
            customization: {
              description: offer.description,
            },
          },
          utilizedServices: [
            ...offer.selectedServices.map((service) => ({
              serviceId: service.serviceId,
              serviceName: service.serviceName,
              quantity: service.quantity,
              price: service.price,
            })),
            ...offer.extraServices.map((service) => ({
              serviceId: service.serviceId,
              serviceName: service.serviceName,
              quantity: service.quantity,
              price: service.price,
              isExtra: true,
            })),
          ],
        };

        const order = new Order(orderData);
        await order.save();

        // Link the order to the offer
        offer.convertedToOrder = true;
        offer.orderId = order._id;
      }
    } else if (!accept && amount) {
      // Send counter-offer notification
      const recipientId =
        userRole === "tailor" ? offer.customer._id : offer.tailor._id;
      const senderName =
        userRole === "tailor" ? offer.tailor.shopName : offer.customer.name;

      await sendNotification({
        userId: recipientId,
        type: "new_offer",
        message: `${senderName} has made a counter-offer of ₨${amount}`,
        relatedId: offer._id,
        onModel: "Offer",
      });

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
        message:
          "Negotiation completed and order created! Please proceed with payment.",
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

    const offer = await Offer.findById(offerId)
      .populate("customer", "name")
      .populate("tailor", "name shopName");

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

    // Send notification about offer rejection
    if (status === "rejected") {
      const recipientId =
        userId === offer.tailor._id ? offer.customer._id : offer.tailor._id;
      const senderName =
        userId === offer.tailor._id
          ? offer.tailor.shopName
          : offer.customer.name;

      await sendNotification({
        userId: recipientId,
        type: "offer_rejected",
        message: `${senderName} has rejected the offer`,
        relatedId: offer._id,
        onModel: "Offer",
      });
    }

    await offer.save();

    res.json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
