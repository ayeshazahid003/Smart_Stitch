// filepath: /home/najam-ul-hassn/Desktop/Smart_Stitch/server/controllers/RefundRequestController.js
import RefundRequest from "../models/RefundRequest.js";
import Order from "../models/Order.js";
import { sendEmail } from "../helper/mail.js";
import { sendNotification } from "../helper/notificationHelper.js";

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
    if (
      order.paymentStatus !== "paid" &&
      order?.paymentDetails?.paymentStatus !== "paid"
    ) {
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

    // Populate order with customer and tailor data for emails
    const populatedOrder = await Order.findById(orderId)
      .populate("customerId", "name email")
      .populate("tailorId", "name email");

    // Send email notification to customer
    try {
      const customerEmailBody = `
        <h1>Refund Request Submitted - Smart Stitch</h1>
        <p>Dear ${populatedOrder.customerId.name},</p>
        <p>Your refund request has been successfully submitted.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Refund Amount:</strong> $${order.pricing.total}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>We will review your request and get back to you within 2-3 business days.</p>
        <p>Thank you for your patience.</p>
        <p>Best regards,<br>Smart Stitch Team</p>
      `;

      await sendEmail(
        "noreply@smartstitch.com",
        populatedOrder.customerId.email,
        "Refund Request Submitted - Smart Stitch",
        customerEmailBody
      );
      console.log(
        `Customer email sent successfully to: ${populatedOrder.customerId.email}`
      );

      // Send notification to customer
      await sendNotification({
        userId: userId,
        type: "refund_request_created",
        message: `Your refund request for order #${orderId
          .toString()
          .slice(-6)} has been submitted and is under review.`,
        relatedId: orderId,
        onModel: "Order",
      });
      console.log(`Customer notification sent successfully to user: ${userId}`);
    } catch (error) {
      console.error("Error sending customer email/notification:", error);
      // Don't fail the entire request if customer notification fails
    }

    // Send email notification to tailor (only if tailor exists)
    if (populatedOrder.tailorId) {
      try {
        const tailorEmailBody = `
          <h1>Refund Request Received - Smart Stitch</h1>
          <p>Dear ${populatedOrder.tailorId.name},</p>
          <p>A customer has submitted a refund request for one of your orders.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${populatedOrder.customerId.name}</p>
          <p><strong>Refund Amount:</strong> $${order.pricing.total}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>Our team will review this request and notify you of any updates. Please ensure all order details are accurate in our system.</p>
          <p>If you have any questions or concerns about this refund request, please contact our support team.</p>
          <p>Best regards,<br>Smart Stitch Team</p>
        `;

        await sendEmail(
          "noreply@smartstitch.com",
          populatedOrder.tailorId.email,
          "Refund Request Received - Smart Stitch",
          tailorEmailBody
        );
        console.log(
          `Tailor email sent successfully to: ${populatedOrder.tailorId.email}`
        );

        // Send notification to tailor
        await sendNotification({
          userId: populatedOrder.tailorId._id,
          type: "refund_request_received",
          message: `Customer ${
            populatedOrder.customerId.name
          } has requested a refund for order #${orderId
            .toString()
            .slice(-6)}. Reason: ${reason}`,
          relatedId: orderId,
          onModel: "Order",
        });
        console.log(
          `Tailor notification sent successfully to user: ${populatedOrder.tailorId._id}`
        );
      } catch (error) {
        console.error("Error sending tailor email/notification:", error);
        // Don't fail the entire request if tailor notification fails
      }
    } else {
      console.log(
        "No tailor found for this order - skipping tailor notifications"
      );
    }

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

    // Populate customer and tailor data for email and notification
    const populatedRefundRequest = await RefundRequest.findById(id)
      .populate("customer", "name email")
      .populate({
        path: "order",
        populate: {
          path: "tailorId",
          select: "name email",
        },
      });

    if (!populatedRefundRequest) {
      return res
        .status(404)
        .json({ error: "Failed to load refund request details" });
    }

    if (!populatedRefundRequest.customer) {
      console.error("Customer data not found for refund request:", id);
      return res
        .status(500)
        .json({ error: "Customer information not available" });
    }

    if (!populatedRefundRequest.order) {
      console.error("Order data not found for refund request:", id);
      return res.status(500).json({ error: "Order information not available" });
    }

    console.log("Populated refund request:", {
      id: populatedRefundRequest._id,
      customer: populatedRefundRequest.customer?.name,
      tailor: populatedRefundRequest.order?.tailorId?.name || "No tailor",
      status: status,
    });

    // Send email and notification based on status update
    let emailSubject = "";
    let emailBody = "";
    let notificationType = "";
    let notificationMessage = "";
    let tailorEmailSubject = "";
    let tailorEmailBody = "";
    let tailorNotificationType = "";
    let tailorNotificationMessage = "";

    if (status === "approved") {
      emailSubject = "Refund Request Approved - Smart Stitch";
      emailBody = `
        <h1>Refund Request Approved - Smart Stitch</h1>
        <p>Dear ${populatedRefundRequest.customer.name},</p>
        <p>Your refund request has been approved!</p>
        <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
        <p><strong>Refund Amount:</strong> $${populatedRefundRequest.amount}</p>
        <p>The refund will be processed within 3-5 business days.</p>
        ${
          adminNotes ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>` : ""
        }
        <p>Thank you for your patience.</p>
        <p>Best regards,<br>Smart Stitch Team</p>
      `;
      notificationType = "refund_approved";
      notificationMessage = `Your refund request for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been approved.`;

      // Tailor notifications for approved refund
      tailorEmailSubject = "Refund Request Approved - Smart Stitch";
      if (
        populatedRefundRequest.order &&
        populatedRefundRequest.order.tailorId
      ) {
        tailorEmailBody = `
          <h1>Refund Request Approved - Smart Stitch</h1>
          <p>Dear ${populatedRefundRequest.order.tailorId.name},</p>
          <p>A refund request for one of your orders has been approved by our admin team.</p>
          <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
          <p><strong>Customer:</strong> ${
            populatedRefundRequest.customer.name
          }</p>
          <p><strong>Refund Amount:</strong> $${
            populatedRefundRequest.amount
          }</p>
          ${
            adminNotes
              ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>`
              : ""
          }
          <p>The refund will be processed and the customer will be notified.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>Smart Stitch Team</p>
        `;
      }
      tailorNotificationType = "refund_request_approved";
      tailorNotificationMessage = `Refund request for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been approved by admin.`;
    } else if (status === "rejected") {
      emailSubject = "Refund Request Rejected - Smart Stitch";
      emailBody = `
        <h1>Refund Request Update - Smart Stitch</h1>
        <p>Dear ${populatedRefundRequest.customer.name},</p>
        <p>Unfortunately, your refund request has been rejected.</p>
        <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
        <p><strong>Refund Amount:</strong> $${populatedRefundRequest.amount}</p>
        ${adminNotes ? `<p><strong>Reason:</strong> ${adminNotes}</p>` : ""}
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>Smart Stitch Team</p>
      `;
      notificationType = "refund_rejected";
      notificationMessage = `Your refund request for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been rejected.`;

      // Tailor notifications for rejected refund
      tailorEmailSubject = "Refund Request Rejected - Smart Stitch";
      if (
        populatedRefundRequest.order &&
        populatedRefundRequest.order.tailorId
      ) {
        tailorEmailBody = `
          <h1>Refund Request Rejected - Smart Stitch</h1>
          <p>Dear ${populatedRefundRequest.order.tailorId.name},</p>
          <p>A refund request for one of your orders has been rejected by our admin team.</p>
          <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
          <p><strong>Customer:</strong> ${
            populatedRefundRequest.customer.name
          }</p>
          <p><strong>Refund Amount:</strong> $${
            populatedRefundRequest.amount
          }</p>
          ${adminNotes ? `<p><strong>Reason:</strong> ${adminNotes}</p>` : ""}
          <p>The customer has been notified of this decision.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>Smart Stitch Team</p>
        `;
      }
      tailorNotificationType = "refund_request_rejected";
      tailorNotificationMessage = `Refund request for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been rejected by admin.`;
    } else if (status === "processed") {
      emailSubject = "Refund Processed - Smart Stitch";
      emailBody = `
        <h1>Refund Processed - Smart Stitch</h1>
        <p>Dear ${populatedRefundRequest.customer.name},</p>
        <p>Your refund has been successfully processed!</p>
        <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
        <p><strong>Refund Amount:</strong> $${populatedRefundRequest.amount}</p>
        <p>The refund should appear in your account within 3-5 business days.</p>
        <p>Thank you for your patience.</p>
        <p>Best regards,<br>Smart Stitch Team</p>
      `;
      notificationType = "refund_processed";
      notificationMessage = `Your refund of $${
        populatedRefundRequest.amount
      } for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been processed.`;

      // Tailor notifications for processed refund
      tailorEmailSubject = "Refund Processed - Smart Stitch";
      if (
        populatedRefundRequest.order &&
        populatedRefundRequest.order.tailorId
      ) {
        tailorEmailBody = `
          <h1>Refund Processed - Smart Stitch</h1>
          <p>Dear ${populatedRefundRequest.order.tailorId.name},</p>
          <p>A refund for one of your orders has been successfully processed.</p>
          <p><strong>Order ID:</strong> ${populatedRefundRequest.order._id}</p>
          <p><strong>Customer:</strong> ${populatedRefundRequest.customer.name}</p>
          <p><strong>Refund Amount:</strong> $${populatedRefundRequest.amount}</p>
          <p>The customer has been refunded and notified of the completion.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>Smart Stitch Team</p>
        `;
      }
      tailorNotificationType = "refund_request_processed";
      tailorNotificationMessage = `Refund for order #${populatedRefundRequest.order._id
        .toString()
        .slice(-6)} has been processed and completed.`;
    }

    // Send customer email and notification if status is not pending
    if (status !== "pending") {
      try {
        console.log(`Sending customer notification for status: ${status}`);
        await sendEmail(
          "noreply@smartstitch.com",
          populatedRefundRequest.customer.email,
          emailSubject,
          emailBody
        );
        console.log(
          `Customer email sent successfully to: ${populatedRefundRequest.customer.email}`
        );

        await sendNotification({
          userId: populatedRefundRequest.customer._id,
          type: notificationType,
          message: notificationMessage,
          relatedId: populatedRefundRequest.order._id,
          onModel: "Order",
        });
        console.log(
          `Customer notification sent successfully to user: ${populatedRefundRequest.customer._id}`
        );
      } catch (error) {
        console.error("Error sending customer email/notification:", error);
        // Don't fail the entire request if customer notification fails
      }

      // Send tailor email and notification if tailor exists and status is not pending
      if (
        populatedRefundRequest.order &&
        populatedRefundRequest.order.tailorId
      ) {
        try {
          console.log(`Sending tailor notification for status: ${status}`);
          await sendEmail(
            "noreply@smartstitch.com",
            populatedRefundRequest.order.tailorId.email,
            tailorEmailSubject,
            tailorEmailBody
          );
          console.log(
            `Tailor email sent successfully to: ${populatedRefundRequest.order.tailorId.email}`
          );

          await sendNotification({
            userId: populatedRefundRequest.order.tailorId._id,
            type: tailorNotificationType,
            message: tailorNotificationMessage,
            relatedId: populatedRefundRequest.order._id,
            onModel: "Order",
          });
          console.log(
            `Tailor notification sent successfully to user: ${populatedRefundRequest.order.tailorId._id}`
          );
        } catch (error) {
          console.error("Error sending tailor email/notification:", error);
          // Don't fail the entire request if tailor notification fails
        }
      } else {
        console.log(
          "No tailor found for this order - skipping tailor notifications"
        );
      }
    }

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
