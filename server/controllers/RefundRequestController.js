// filepath: /home/najam-ul-hassn/Desktop/Smart_Stitch/server/controllers/RefundRequestController.js
import RefundRequest from "../models/RefundRequest.js";
import Order from "../models/Order.js";

// Create a refund request for a given order (for customers)
export const createRefundRequest = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find the order and verify it belongs to this user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.customerId.toString() !== userId) {
      return res.status(403).json({
        error: "You are not authorized to request a refund for this order",
      });
    }

    // Check if order is eligible for refund
    if (order.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ error: "Order is not eligible for refund" });
    }

    // Check if a refund request already exists for this order
    const existingRequest = await RefundRequest.findOne({ order: orderId });
    if (existingRequest) {
      return res.status(400).json({
        error: "A refund request already exists for this order",
        refundRequest: existingRequest,
      });
    }

    // Create refund request
    const refundRequest = new RefundRequest({
      order: orderId,
      customer: userId,
      reason,
      amount: order.pricing.total, // Full refund by default
      status: "pending",
    });

    await refundRequest.save();

    // Update order payment status to indicate refund requested
    order.paymentStatus = "refund_requested";
    await order.save();

    console.log("Refund request created:", refundRequest);

    res.status(201).json(refundRequest);
  } catch (error) {
    console.error("Error creating refund request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all refund requests for the platform admin
export const getAllRefundRequests = async (req, res) => {
  try {
    const refundRequests = await RefundRequest.find()
      .populate("order")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(refundRequests);
  } catch (error) {
    console.error("Error fetching refund requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all refund requests for a specific user
export const getUserRefundRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const refundRequests = await RefundRequest.find({ customer: userId })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json(refundRequests);
  } catch (error) {
    console.error("Error fetching user refund requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single refund request by ID
export const getRefundRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const refundRequest = await RefundRequest.findById(id)
      .populate("order")
      .populate("customer", "name email");

    if (!refundRequest) {
      return res.status(404).json({ error: "Refund request not found" });
    }

    // Check if user is authorized (owner or admin)
    if (
      req.user.role !== "platformAdmin" &&
      refundRequest.customer.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this refund request" });
    }

    res.status(200).json(refundRequest);
  } catch (error) {
    console.error("Error fetching refund request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a refund request (for users to edit their request reason)
export const updateRefundRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const refundRequest = await RefundRequest.findById(id);

    if (!refundRequest) {
      return res.status(404).json({ error: "Refund request not found" });
    }

    // Only allow user to update their own request and only if still pending
    if (refundRequest.customer.toString() !== userId) {
      return res.status(403).json({
        error: "You are not authorized to update this refund request",
      });
    }

    if (refundRequest.status !== "pending") {
      return res.status(400).json({
        error:
          "This refund request cannot be updated because its status is " +
          refundRequest.status,
      });
    }

    // Update reason only
    refundRequest.reason = reason;
    await refundRequest.save();

    res.status(200).json(refundRequest);
  } catch (error) {
    console.error("Error updating refund request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update refund request status (admin only)
export const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ["pending", "approved", "rejected", "processed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const refundRequest = await RefundRequest.findById(id);

    if (!refundRequest) {
      return res.status(404).json({ error: "Refund request not found" });
    }

    // Update status and admin notes
    refundRequest.status = status;
    refundRequest.adminNotes = adminNotes || refundRequest.adminNotes;

    // If status is processed, add processedAt timestamp
    if (status === "processed") {
      refundRequest.processedAt = Date.now();

      // Update the related order as well
      const order = await Order.findById(refundRequest.order);
      if (order) {
        order.paymentStatus = "refunded";
        order.status = "refunded";
        await order.save();
      }
    }

    await refundRequest.save();

    res.status(200).json(refundRequest);
  } catch (error) {
    console.error("Error updating refund status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Process a refund (this would connect with your payment provider's API)
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;

    const refundRequest = await RefundRequest.findById(id);

    if (!refundRequest) {
      return res.status(404).json({ error: "Refund request not found" });
    }

    if (refundRequest.status !== "approved") {
      return res.status(400).json({
        error:
          "This refund request cannot be processed because its status is " +
          refundRequest.status,
      });
    }

    // Get the order to access payment details
    const order = await Order.findById(refundRequest.order);
    if (
      !order ||
      !order.paymentDetails ||
      !order.paymentDetails.paymentIntent
    ) {
      return res
        .status(400)
        .json({ error: "Order payment information not found" });
    }

    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      // For example:
      // const refund = await stripe.refunds.create({
      //   payment_intent: order.paymentDetails.paymentIntent,
      //   amount: refundRequest.amount * 100, // Convert to cents for Stripe
      // });

      // For now, we'll simulate a successful refund
      const mockRefundId = "rf_" + Math.random().toString(36).substring(2, 15);

      // Update the refund request
      refundRequest.status = "processed";
      refundRequest.processedAt = Date.now();
      refundRequest.refundId = mockRefundId;
      await refundRequest.save();

      // Update the order
      order.paymentStatus = "refunded";
      order.status = "refunded";
      await order.save();

      res.status(200).json({
        message: "Refund processed successfully",
        refundRequest,
      });
    } catch (paymentError) {
      console.error("Payment provider error:", paymentError);
      return res.status(500).json({
        error: "Failed to process refund with payment provider",
        details: paymentError.message,
      });
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: error.message });
  }
};
