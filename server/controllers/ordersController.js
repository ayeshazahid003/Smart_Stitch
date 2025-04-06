import Order from "../models/Order.js";
import Invoice from "../models/Invoice.js";
import TailorProfile from "../models/TailorProfile.js";
import Voucher from "../models/Voucher.js";
import { sendEmail } from "../helper/mail.js";
import { uploadMultipleFiles } from "../helper/cloudinaryUploader.js";
import { getSocket } from "../socket.js";
import Campaign from "../models/Campaign.js";
import mongoose from "mongoose";
import { sendNotificationToUser } from "../helper/notificationHelper.js";

export const createNewOrder = async (req, res) => {
  try {
    const {
      customerId,
      tailorId,
      design,
      measurement,
      utilizedServices,
      extraServices,
      voucherId,
      campaignId,
      status = "pending",
    } = req.body;

    // Validate tailor existence first
    const tailorProfile = await TailorProfile.findOne({ tailorId });
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

    // Calculate base prices
    const totalServiceCost = utilizedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const totalExtraServiceCost = extraServices.reduce(
      (sum, extraService) => sum + extraService.price,
      0
    );
    let subtotal = totalServiceCost + totalExtraServiceCost;
    let campaignDiscount = 0;
    let voucherDiscount = 0;

    // Apply campaign discount if applicable
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign && campaign.isActive) {
        const now = new Date();
        if (
          now >= new Date(campaign.validFrom) &&
          now <= new Date(campaign.validUntil)
        ) {
          if (subtotal >= (campaign.minimumOrderValue || 0)) {
            if (campaign.discountType === "percentage") {
              campaignDiscount = (subtotal * campaign.discountValue) / 100;
              if (campaign.maximumDiscount) {
                campaignDiscount = Math.min(
                  campaignDiscount,
                  campaign.maximumDiscount
                );
              }
            } else {
              campaignDiscount = campaign.discountValue;
            }
          }
        }
      }
    }

    // Apply voucher discount if applicable
    if (voucherId) {
      const voucher = await Voucher.findById(voucherId);
      if (voucher) {
        voucherDiscount = voucher.discount;
      }
    }

    // Calculate final total
    const total = subtotal - campaignDiscount - voucherDiscount;

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
      campaignId,
      discounts: {
        campaignDiscount,
        voucherDiscount,
      },
      pricing: {
        subtotal,
        campaignDiscount,
        voucherDiscount,
        total,
      },
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
      amount: total,
      details: invoiceDetails,
      generatedAt: new Date(),
    });

    const savedInvoice = await newInvoice.save();

    // Update the order with the invoice reference
    savedOrder.invoiceId = savedInvoice._id;
    await savedOrder.save();

    // Send email to the customer
    const customerEmail = req.user.email;
    const customerEmailBody = `
      <h1>Order Confirmation - The Tailor Platform</h1>
      <p>Dear Valued Customer,</p>
      <p>Your order has been successfully placed! Here are the details:</p>
      <ul>
        <li><strong>Order ID:</strong> ${savedOrder._id}</li>
        <li><strong>Tailor Shop:</strong> ${tailorProfile.shopName}</li>
        <li><strong>Total Amount:</strong> $${total}</li>
        <li><strong>Status:</strong> ${status}</li>
      </ul>
      <p>Thank you for choosing our platform. You can track your order progress in your account dashboard.</p>
      <p>Warm regards,<br>The Tailor Platform Team</p>
    `;

    // Send email to the tailor
    const tailorEmail = tailorProfile.email;
    const tailorEmailBody = `
      <h1>New Order Alert - The Tailor Platform</h1>
      <p>Dear ${tailorProfile.shopName},</p>
      <p>You have received a new order! Here are the details:</p>
      <ul>
        <li><strong>Order ID:</strong> ${savedOrder._id}</li>
        <li><strong>Total Amount:</strong> $${total}</li>
        <li><strong>Status:</strong> ${status}</li>
      </ul>
      <p>Log in to your dashboard for more details.</p>
      <p>Best regards,<br>The Tailor Platform Team</p>
    `;

    // Uncomment to enable email sending
    /*
    await sendEmail(
      "no-reply@cogentro.com",
      customerEmail,
      "Your Order Has Been Placed",
      customerEmailBody
    );

    await sendEmail(
      "no-reply@cogentro.com",
      tailorEmail,
      "You Have Received a New Order",
      tailorEmailBody
    );
    */

    // Emit notifications using socket events
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
      error: error.message,
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
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId tailorId invoiceId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
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
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
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
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { status, design, shippingAddress, measurement } = req.body;

    const order = await Order.findById(orderId)
      .populate("customerId", "username")
      .populate("tailorId", "username");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.status = status;
    order.design = design || order.design;
    order.shippingAddress = shippingAddress || order.shippingAddress;
    order.measurement = measurement || order.measurement;
    await order.save();

    // Determine notification recipient and message based on status
    let notification;
    if (status === "accepted") {
      notification = {
        userId: order.customerId._id,
        type: "ORDER_ACCEPTED",
        message: `Your order has been accepted by ${order.tailorId.username}`,
        relatedId: order._id,
        onModel: "Order",
      };
    } else if (status === "rejected") {
      notification = {
        userId: order.customerId._id,
        type: "ORDER_REJECTED",
        message: `Your order has been rejected by ${order.tailorId.username}`,
        relatedId: order._id,
        onModel: "Order",
      };
    } else if (status === "completed") {
      notification = {
        userId: order.customerId._id,
        type: "ORDER_COMPLETED",
        message: `Your order has been completed by ${order.tailorId.username}`,
        relatedId: order._id,
        onModel: "Order",
      };
    }

    // Send real-time notification if applicable
    if (notification) {
      const savedNotification = await Notification.create(notification);
      await sendNotificationToUser(savedNotification);
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating order status" });
  }
};

export const generateInvoiceForOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Check if invoice already exists
    if (order.invoiceId) {
      const existingInvoice = await Invoice.findById(order.invoiceId);
      if (existingInvoice) {
        return res.status(200).json({
          success: true,
          message: "Invoice already exists for this order.",
          invoice: existingInvoice,
        });
      }
    }

    // Calculate totals
    const serviceCost = order.utilizedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const extraServicesCost = order.extraServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const customizationCost = order.design?.customization?.cost || 0;

    // Create invoice details
    const invoiceDetails = {
      serviceCost,
      customizationCost,
      extraServicesCost,
      deliveryCost: 0, // Add delivery cost if applicable
    };

    // Create new invoice
    const newInvoice = new Invoice({
      orderId: order._id,
      amount: order.pricing.total,
      details: invoiceDetails,
      generatedAt: new Date(),
    });

    const savedInvoice = await newInvoice.save();

    // Update order with invoice reference
    order.invoiceId = savedInvoice._id;
    await order.save();

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully.",
      invoice: savedInvoice,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice.",
      error: error.message,
    });
  }
};

export const getOrderSummaryByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId });

    const summary = {
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      inProgress: orders.filter((order) => order.status === "in progress")
        .length,
      completed: orders.filter((order) => order.status === "completed").length,
      totalSpent: orders.reduce(
        (sum, order) => sum + (order.pricing?.total || 0),
        0
      ),
    };

    res.status(200).json({ success: true, summary });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const getOrderSummaryByTailor = async (req, res) => {
  try {
    const tailorId = req.user._id;
    const orders = await Order.find({ tailorId });

    const summary = {
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      inProgress: orders.filter((order) => order.status === "in progress")
        .length,
      completed: orders.filter((order) => order.status === "completed").length,
      totalEarned: orders.reduce(
        (sum, order) => sum + (order.pricing?.total || 0),
        0
      ),
    };

    res.status(200).json({ success: true, summary });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const getOrderByStatusOfCustomers = async (req, res) => {
  try {
    const { status } = req.params;
    const { customerId } = req.query;

    const orders = await Order.find({
      customerId,
      status,
    }).populate("tailorId invoiceId");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const getOrderByStatusOfTailor = async (req, res) => {
  try {
    const { status } = req.params;
    const tailorId = req.user._id;

    const orders = await Order.find({
      tailorId,
      status,
    }).populate("customerId invoiceId");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingAddress, measurement, status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order fields
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (measurement) order.measurement = measurement;
    if (status) order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};
