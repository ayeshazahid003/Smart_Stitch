import { getSocket } from "../socket.js";
import Notification from "../models/Notification.js";

const getNamespaceAndEmit = async (notification) => {
  const io = getSocket();
  if (!io) {
    throw new Error("[Notification Helper] Socket.io instance not found");
  }

  const notificationNamespace = io.of("/notifications");
  const userRoom = `user_${notification.userId}`;

  // Check if the user's room exists and has connections
  const sockets = await notificationNamespace.in(userRoom).allSockets();
  if (sockets.size === 0) {
    console.log(
      `[Notification Helper] No active connections in room: ${userRoom}`
    );
  }

  // Emit to user's room
  notificationNamespace.to(userRoom).emit("receiveNotification", {
    notification,
  });

  return true;
};

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

    // Create and save notification
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

    // Try to emit the notification
    try {
      await getNamespaceAndEmit(notification);
      console.log("[Notification Helper] Notification emitted successfully");
    } catch (socketError) {
      console.error(
        "[Notification Helper] Socket emission error:",
        socketError
      );
      // Don't throw here - notification is saved even if emission fails
    }

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

export const sendNotificationToUser = async (notification) => {
  try {
    await getNamespaceAndEmit(notification);
    console.log(
      `[Notification Helper] Notification sent to user ${notification.userId}:`,
      notification.message
    );
    return true;
  } catch (error) {
    console.error("[Notification Helper] Error sending notification:", error);
    return false;
  }
};
