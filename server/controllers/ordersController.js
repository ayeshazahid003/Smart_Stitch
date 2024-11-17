import Order from "../models/Order.js";
import Invoice from "../models/Invoice.js";
import TailorProfile from "../models/TailorProfile.js";
import { sendEmail } from "../helper/mail.js";
import { uploadMultipleFiles } from "../helper/cloudinaryUploader.js";
import { getSocket } from "../socket.js";

export const createNewOrder = async (req, res) => {
  try {
    const {
      customerId,
      tailorId,
      status,
      design,
      measurement,
      utilizedServices,
      extraServices,
      voucherId,
    } = req.body;

    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor not found." });
    }

    // Upload design images to Cloudinary
    if (design.designImage && design.designImage.length > 0) {
      const uploadedImages = await uploadMultipleFiles(
        design.designImage,
        "Home"
      );
      design.designImage = uploadedImages.map((img) => img.secure_url);
    }

    // Upload media files to Cloudinary
    if (design.media && design.media.length > 0) {
      const mediaUploadPromises = design.media.map(async (media) => {
        if (media.data) {
          const uploadedMedia = await uploadMultipleFiles([media.data], "Home");
          return {
            type: media.type,
            url: uploadedMedia[0].secure_url,
            description: media.description || "",
          };
        }
        return media; // Skip if no data to upload
      });

      design.media = await Promise.all(mediaUploadPromises);
    }

    // Validate tailor existence
    const tailorProfile = await TailorProfile.findOne({ tailorId });

    // Calculate total cost
    const totalServiceCost = utilizedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const totalExtraServiceCost = extraServices.reduce(
      (sum, extraService) => sum + extraService.price,
      0
    );
    const totalAmount = totalServiceCost + totalExtraServiceCost;

    // Create an order
    const newOrder = new Order({
      customerId,
      tailorId,
      status,
      design,
      measurement,
      utilizedServices,
      extraServices,
      voucherId,
    });
    const savedOrder = await newOrder.save();

    // Generate an invoice
    const invoiceDetails = {
      serviceCost: totalServiceCost,
      customizationCost: design.customization?.cost || 0,
      extraServicesCost: totalExtraServiceCost,
      deliveryCost: 0, // Add delivery cost if applicable
    };
    const newInvoice = new Invoice({
      orderId: savedOrder._id,
      amount: totalAmount,
      details: invoiceDetails,
      generatedAt: new Date(),
    });
    const savedInvoice = await newInvoice.save();

    // Update the order with the invoice reference
    savedOrder.invoiceId = savedInvoice._id;
    await savedOrder.save();

    // Send email to the customer
    const customerEmail = req.user.email; // Assuming user email is available in req.user
    const customerEmailBody = `
        <h1>Order Confirmation - The Tailor Platform</h1>
        <p>Dear Valued Customer,</p>
        <p>Your order has been successfully placed! Here are the details:</p>
        <ul>
          <li><strong>Order ID:</strong> ${savedOrder._id}</li>
          <li><strong>Tailor Shop:</strong> ${tailorProfile.shopName}</li>
          <li><strong>Total Amount:</strong> $${totalAmount}</li>
          <li><strong>Status:</strong> ${status}</li>
        </ul>
        <p>Thank you for choosing our platform. You can track your order progress in your account dashboard.</p>
        <p>Warm regards,<br>The Tailor Platform Team</p>
      `;
    await sendEmail(
      "no-reply@cogentro.com",
      customerEmail,
      "Your Order Has Been Placed",
      customerEmailBody
    );

    // Send email to the tailor
    const tailorEmail = tailorProfile.email;
    const tailorEmailBody = `
        <h1>New Order Alert - The Tailor Platform</h1>
        <p>Dear ${tailorProfile.shopName},</p>
        <p>You have received a new order! Here are the details:</p>
        <ul>
          <li><strong>Order ID:</strong> ${savedOrder._id}</li>
          <li><strong>Total Amount:</strong> $${totalAmount}</li>
          <li><strong>Status:</strong> ${status}</li>
        </ul>
        <p>Log in to your dashboard for more details.</p>
        <p>Best regards,<br>The Tailor Platform Team</p>
      `;
    await sendEmail(
      "no-reply@cogentro.com",
      tailorEmail,
      "You Have Received a New Order",
      tailorEmailBody
    );

    // Emit notifications using renamed socket events
    const io = getSocket();
    if (io) {
      io.emit("sendNotification", {
        tailorId,
        orderId: savedOrder._id,
        message: `You have a new order!`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: savedOrder,
      invoice: savedInvoice,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again later.",
      error,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate(
      "customerId tailorId invoiceId"
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId tailorId invoiceId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).populate(
      "tailorId invoiceId"
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrdersByTailor = async (req, res) => {
  try {
    const tailorProfile = await TailorProfile.findOne({
      tailorId: req.user._id,
    });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    const orders = await Order.find({
      tailorId: tailorProfile.tailorId,
    }).populate("customerId invoiceId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the order
    const order = await Order.findById(id).populate("customerId tailorId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Update the order status
    order.status = status;
    const updatedOrder = await order.save();

    // Get customer and tailor details
    const customer = order.customerId;
    const tailor = order.tailorId;

    const io = getSocket();
    const notificationMessage = `Your order (ID: ${order._id}) status has been updated to ${status}.`;

    // Emit notification to the client via the single socket
    if (io) {
      io.emit("sendNotification", {
        receiverId: customer._id.toString(),
        type: "order update",
        message: notificationMessage,
      });
    }

    // Email Templates
    let customerEmailSubject;
    let customerEmailBody;
    let tailorEmailSubject;
    let tailorEmailBody;

    if (status === "completed") {
      // Email template for completed status
      customerEmailSubject = "Order Completed Successfully";
      customerEmailBody = `
          <h1>Order Completed</h1>
          <p>Dear ${customer.name},</p>
          <p>We are pleased to inform you that your order with ID <strong>${order._id}</strong> has been successfully completed.</p>
          <p>Thank you for choosing our service. We hope to serve you again in the future.</p>
          <p>Best regards,</p>
          <p>The Cogentro Team</p>
        `;

      tailorEmailSubject = "Order Completion Notification";
      tailorEmailBody = `
          <h1>Order Completed</h1>
          <p>Dear ${tailor.name},</p>
          <p>Congratulations! Your order with ID <strong>${order._id}</strong> has been marked as completed.</p>
          <p>Thank you for delivering excellent service to our valued customer.</p>
          <p>Best regards,</p>
          <p>The Cogentro Team</p>
        `;
    } else {
      // Generic email template for other status updates
      customerEmailSubject = "Order Status Update";
      customerEmailBody = `
          <h1>Order Status Updated</h1>
          <p>Dear ${customer.name},</p>
          <p>Your order with ID <strong>${order._id}</strong> has been updated to:</p>
          <p><strong>Status:</strong> ${status}</p>
          <p>Thank you for choosing our service.</p>
          <p>Best regards,</p>
          <p>The Cogentro Team</p>
        `;

      tailorEmailSubject = "Order Status Update";
      tailorEmailBody = `
          <h1>Order Status Updated</h1>
          <p>Dear ${tailor.name},</p>
          <p>The status of the order with ID <strong>${order._id}</strong> has been updated to:</p>
          <p><strong>Status:</strong> ${status}</p>
          <p>Please ensure to follow up if necessary.</p>
          <p>Best regards,</p>
          <p>The Cogentro Team</p>
        `;
    }

    // Send email to the customer
    await sendEmail(
      "no-reply@cogentro.com",
      customer.email,
      customerEmailSubject,
      customerEmailBody
    );

    // Send email to the tailor
    await sendEmail(
      "no-reply@cogentro.com",
      tailor.email,
      tailorEmailSubject,
      tailorEmailBody
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const generateInvoiceForOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const totalServiceCost = order.utilizedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const totalExtraServiceCost = order.extraServices.reduce(
      (sum, service) => sum + service.price,
      0
    );

    const invoiceDetails = {
      serviceCost: totalServiceCost,
      customizationCost: order.design.customization?.cost || 0,
      extraServicesCost: totalExtraServiceCost,
      deliveryCost: 0, // Add delivery cost if applicable
    };

    const newInvoice = new Invoice({
      orderId: order._id,
      amount: totalServiceCost + totalExtraServiceCost,
      details: invoiceDetails,
      generatedAt: new Date(),
    });

    const savedInvoice = await newInvoice.save();
    order.invoiceId = savedInvoice._id;
    await order.save();

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully.",
      invoice: savedInvoice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrderSummaryByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId });
    const totalOrders = orders.length;
    const totalAmountSpent = orders.reduce(
      (sum, order) => sum + (order.invoiceId?.amount || 0),
      0
    );

    res.status(200).json({
      success: true,
      summary: {
        totalOrders,
        totalAmountSpent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrderSummaryByTailor = async (req, res) => {
  try {
    const tailorProfile = await TailorProfile.findOne({
      tailorId: req.user._id,
    });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    const orders = await Order.find({ tailorId: tailorProfile.tailorId });
    const totalOrders = orders.length;
    const totalEarnings = orders.reduce(
      (sum, order) => sum + (order.invoiceId?.amount || 0),
      0
    );

    res.status(200).json({
      success: true,
      summary: {
        totalOrders,
        totalEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrderByStatusOfCustomers = async (req, res) => {
  try {
    const { status } = req.params;
    const { customerId } = req.query;

    const orders = await Order.find({ status, customerId }).populate(
      "tailorId invoiceId"
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getOrderByStatusOfTailor = async (req, res) => {
  try {
    const { status } = req.params;

    const tailorProfile = await TailorProfile.findOne({
      tailorId: req.user._id,
    });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    const orders = await Order.find({
      status,
      tailorId: tailorProfile.tailorId,
    }).populate("customerId invoiceId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};
