import { getSocket } from "../socket.js";
import Notification from "../models/Notification.js";

export const sendNotification = async ({
  userId,
  type,
  message,
  relatedId = null,
  onModel = null,
}) => {
  try {
    console.log("[Notification Helper] Creating notification:", {
      userId,
      type,
      message,
      relatedId,
      onModel,
    });

    const notification = new Notification({
      userId,
      type,
      message,
      relatedId,
      onModel,
    });

    await notification.save();
    console.log(
      "[Notification Helper] Notification saved to database:",
      notification._id
    );

    // Get the socket instance
    const io = getSocket();
    if (!io) {
      throw new Error("[Notification Helper] Socket.io instance not found");
    }

    // Get the notifications namespace
    const notificationNamespace = io.of("/notifications");

    // Emit to user's room
    const userRoom = `user_${userId}`;
    console.log(
      "[Notification Helper] Emitting notification to room:",
      userRoom
    );

    notificationNamespace.to(userRoom).emit("receiveNotification", {
      notification,
    });

    console.log("[Notification Helper] Notification emitted successfully");
    return notification;
  } catch (error) {
    console.error("[Notification Helper] Error in sendNotification:", error);
    console.error("[Notification Helper] Error details:", {
      userId,
      type,
      message,
      stack: error.stack,
    });
    throw error;
  }
};
