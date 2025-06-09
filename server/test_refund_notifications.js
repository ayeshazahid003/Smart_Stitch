// test_refund_notifications.js
import mongoose from "mongoose";
import RefundRequest from "./models/RefundRequest.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import { sendEmail } from "./helper/mail.js";
import { sendNotification } from "./helper/notificationHelper.js";

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smart_stitch", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Test refund notification flow
const testRefundNotifications = async () => {
  try {
    console.log("🧪 Testing refund notification system...\n");

    // Find a sample refund request
    const refundRequest = await RefundRequest.findOne()
      .populate("customer", "name email")
      .populate({
        path: "order",
        populate: {
          path: "tailorId",
          select: "name email",
        },
      });

    if (!refundRequest) {
      console.log("❌ No refund requests found in database");
      return;
    }

    console.log("📋 Found refund request:", {
      id: refundRequest._id,
      status: refundRequest.status,
      customer: refundRequest.customer?.name,
      tailor: refundRequest.order?.tailorId?.name,
      amount: refundRequest.amount,
    });

    // Test customer email
    console.log("\n📧 Testing customer email...");
    try {
      const customerEmailBody = `
        <h1>Test Email - Smart Stitch</h1>
        <p>Dear ${refundRequest.customer.name},</p>
        <p>This is a test email for refund notifications.</p>
        <p><strong>Refund Request ID:</strong> ${refundRequest._id}</p>
        <p><strong>Status:</strong> ${refundRequest.status}</p>
        <p><strong>Amount:</strong> $${refundRequest.amount}</p>
        <p>Best regards,<br>Smart Stitch Team</p>
      `;

      await sendEmail(
        "noreply@smartstitch.com",
        refundRequest.customer.email,
        "Test Refund Notification - Smart Stitch",
        customerEmailBody
      );
      console.log("✅ Customer email sent successfully");
    } catch (error) {
      console.error("❌ Customer email failed:", error.message);
    }

    // Test customer notification
    console.log("\n🔔 Testing customer notification...");
    try {
      await sendNotification({
        userId: refundRequest.customer._id,
        type: "test_refund_notification",
        message: `Test notification for refund request #${refundRequest._id.toString().slice(-6)}`,
        relatedId: refundRequest.order._id,
        onModel: "Order",
      });
      console.log("✅ Customer notification sent successfully");
    } catch (error) {
      console.error("❌ Customer notification failed:", error.message);
    }

    // Test tailor email (if tailor exists)
    if (refundRequest.order?.tailorId) {
      console.log("\n📧 Testing tailor email...");
      try {
        const tailorEmailBody = `
          <h1>Test Email - Smart Stitch</h1>
          <p>Dear ${refundRequest.order.tailorId.name},</p>
          <p>This is a test email for refund notifications.</p>
          <p><strong>Refund Request ID:</strong> ${refundRequest._id}</p>
          <p><strong>Customer:</strong> ${refundRequest.customer.name}</p>
          <p><strong>Status:</strong> ${refundRequest.status}</p>
          <p><strong>Amount:</strong> $${refundRequest.amount}</p>
          <p>Best regards,<br>Smart Stitch Team</p>
        `;

        await sendEmail(
          "noreply@smartstitch.com",
          refundRequest.order.tailorId.email,
          "Test Tailor Refund Notification - Smart Stitch",
          tailorEmailBody
        );
        console.log("✅ Tailor email sent successfully");
      } catch (error) {
        console.error("❌ Tailor email failed:", error.message);
      }

      // Test tailor notification
      console.log("\n🔔 Testing tailor notification...");
      try {
        await sendNotification({
          userId: refundRequest.order.tailorId._id,
          type: "test_tailor_refund_notification",
          message: `Test notification: Refund request #${refundRequest._id.toString().slice(-6)} for customer ${refundRequest.customer.name}`,
          relatedId: refundRequest.order._id,
          onModel: "Order",
        });
        console.log("✅ Tailor notification sent successfully");
      } catch (error) {
        console.error("❌ Tailor notification failed:", error.message);
      }
    } else {
      console.log("\n⚠️  No tailor found for this order - skipping tailor tests");
    }

    console.log("\n🎉 Test completed!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testRefundNotifications();
};

runTest();
