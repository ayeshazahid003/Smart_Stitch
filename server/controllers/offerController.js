import Offer from "../models/Offer.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import { sendNotificationToUser } from "../helper/notificationHelper.js";

const createAndSendNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    await sendNotificationToUser(notification);
    return notification;
  } catch (error) {
    console.error("Error creating/sending notification:", error);
  }
};

export const createOffer = async (req, res) => {
  try {
    const {
      tailorId,
      amount,
      description,
      selectedServices,
      extraServices,
      totalItems,
      requiredDate,
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
      requiredDate,
    });

    // Validate required fields
    if (
      !tailorId ||
      !amount ||
      !description ||
      !selectedServices ||
      !totalItems ||
      !requiredDate
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
      requiredDate: new Date(requiredDate),
      negotiationHistory: [
        {
          amount,
          message: description,
          by: customerId,
        },
      ],
    });

    await offer.save();

    // Send real-time notification to tailor
    await createAndSendNotification({
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

    console.log(req.user.role, "userRole ----------------");

    // Handle acceptance
    if (accept) {
      if (userRole === "tailor") {
        offer.status =
          offer.status === "accepted_by_customer" ? "accepted" : "accepted";

        // Send real-time notification to customer about tailor's acceptance
        await createAndSendNotification({
          userId: offer.customer._id,
          type: "offer_accepted",
          message: `Your offer of ₨${
            amount || offer.amount
          } has been accepted by ${offer.tailor.name}`,
          relatedId: offer._id,
          onModel: "Offer",
        });
      } else {
        offer.status =
          offer.status === "accepted_by_tailor" ? "accepted" : "accepted";

        // Send real-time notification to tailor about customer's acceptance
        await createAndSendNotification({
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

      await createAndSendNotification({
        userId: recipientId,
        type: "new_counter_offer",
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
    const isCustomer = offer.customer?._id.toString() === userId.toString();
    const isTailor = offer.tailor?._id.toString() === userId.toString();

    if (isCustomer || isTailor) {
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

      // Send real-time notification about offer rejection/cancellation
      if (
        status === "rejected" ||
        status === "cancelled" ||
        status === "negotiating"
      ) {
        const recipientId =
          userId === offer.tailor._id ? offer.customer._id : offer.tailor._id;
        const senderName =
          userId === offer.tailor._id ? offer.tailor.name : offer.customer.name;
        const action = status === "rejected" ? "rejected" : "cancelled";

        await createAndSendNotification({
          userId: recipientId,
          type: `offer_${action}`,
          message: `${senderName} has ${action} the offer`,
          relatedId: offer._id,
          onModel: "Offer",
        });
      }

      await offer.save();

      res.json({ success: true, offer });

      return;
    }
    res
      .status(403)
      .json({ message: "You do not have permission to update this offer" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
