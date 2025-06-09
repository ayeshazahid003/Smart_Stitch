// Test script to debug notification flow
import { sendNotification } from "../helper/notificationHelper.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

const testNotification = async () => {
  try {
    console.log("Testing notification flow...");

    // Test sending a notification
    // Replace with an actual user ID from your database
    const testUserId = "6756f2e4d6ca94c9dbecda5e"; // Replace with real user ID

    const notification = await sendNotification({
      userId: testUserId,
      type: "ORDER_PLACED",
      message: "Test notification - your order has been placed",
      relatedId: "6756f2e4d6ca94c9dbecda5f", // Replace with real order ID
      onModel: "Order",
    });

    console.log("Notification sent successfully:", notification);
  } catch (error) {
    console.error("Error sending test notification:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

testNotification();
