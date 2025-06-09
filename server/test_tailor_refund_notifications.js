// Test script to verify tailor refund notifications
import mongoose from "mongoose";
import { sendNotification } from "./helper/notificationHelper.js";
import { sendEmail } from "./helper/mail.js";

const testTailorRefundNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/smartstitch", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Test notification data
    const testData = {
      tailorId: new mongoose.Types.ObjectId(), // Mock tailor ID
      customerName: "John Doe",
      orderId: new mongoose.Types.ObjectId(), // Mock order ID
      reason: "Item doesn't fit properly",
      amount: 150.0,
    };

    console.log("Testing tailor refund notification...");

    // Test notification
    await sendNotification({
      userId: testData.tailorId,
      type: "refund_request_received",
      message: `Customer ${
        testData.customerName
      } has requested a refund for order #${testData.orderId
        .toString()
        .slice(-6)}. Reason: ${testData.reason}`,
      relatedId: testData.orderId,
      onModel: "Order",
    });

    console.log("✅ Tailor notification sent successfully");

    // Test email
    const tailorEmailBody = `
      <h1>Refund Request Received - Smart Stitch</h1>
      <p>Dear Tailor,</p>
      <p>A customer has submitted a refund request for one of your orders.</p>
      <p><strong>Order ID:</strong> ${testData.orderId}</p>
      <p><strong>Customer:</strong> ${testData.customerName}</p>
      <p><strong>Refund Amount:</strong> $${testData.amount}</p>
      <p><strong>Reason:</strong> ${testData.reason}</p>
      <p>Our team will review this request and notify you of any updates. Please ensure all order details are accurate in our system.</p>
      <p>If you have any questions or concerns about this refund request, please contact our support team.</p>
      <p>Best regards,<br>Smart Stitch Team</p>
    `;

    await sendEmail(
      "no-reply@smartstitch.com",
      "test.tailor@example.com",
      "Refund Request Received - Smart Stitch",
      tailorEmailBody
    );

    console.log("✅ Tailor email sent successfully");
    console.log("✅ All tailor refund notification tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

testTailorRefundNotifications();
