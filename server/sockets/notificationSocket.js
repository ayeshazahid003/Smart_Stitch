import Notification from "../models/Notification.js";

export const notificationSocketHandler = (io, connectedUsers) => {
  const notificationNamespace = io.of("/notifications");

  notificationNamespace.on("connection", (socket) => {
    console.log(`[Notification Socket] New connection: ${socket.id}`);

    // Handle user connection
    socket.on("userConnected", (userId) => {
      if (!userId) {
        console.log("[Notification Socket] Connection attempt without userId");
        return;
      }

      console.log(
        `[Notification Socket] User ${userId} connected with socket ${socket.id}`
      );

      // Store user's socket id and join their room
      connectedUsers[userId] = socket.id;
      socket.join(`user_${userId}`);

      // Send connection confirmation
      socket.emit("connectionConfirmed", { userId, socketId: socket.id });
    });

    // Handle fetching unread notifications
    socket.on("getUnreadNotifications", async (userId) => {
      console.log(
        `[Notification Socket] Fetching unread notifications for user ${userId}`
      );
      try {
        const notifications = await Notification.find({
          userId,
          isRead: false,
        })
          .sort({ createdAt: -1 })
          .exec();

        console.log(
          `[Notification Socket] Found ${notifications.length} unread notifications`
        );
        socket.emit("unreadNotifications", notifications);
      } catch (error) {
        console.error(
          "[Notification Socket] Error fetching unread notifications:",
          error
        );
        socket.emit("error", { message: "Failed to fetch notifications" });
      }
    });

    // Handle marking notifications as read
    socket.on("markNotificationRead", async ({ notificationId, userId }) => {
      console.log(
        `[Notification Socket] Marking notification ${notificationId} as read for user ${userId}`
      );
      try {
        const notification = await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );

        if (notification) {
          // Emit to all user's connected devices
          notificationNamespace
            .to(`user_${userId}`)
            .emit("notificationRead", notification);
          console.log(
            `[Notification Socket] Notification marked as read and broadcasted to user ${userId}`
          );
        }
      } catch (error) {
        console.error(
          "[Notification Socket] Error marking notification as read:",
          error
        );
        socket.emit("error", {
          message: "Failed to mark notification as read",
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Find and remove the disconnected user
      for (const [userId, socketId] of Object.entries(connectedUsers)) {
        if (socketId === socket.id) {
          delete connectedUsers[userId];
          console.log(
            `[Notification Socket] User ${userId} disconnected from socket ${socket.id}`
          );
          break;
        }
      }
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("[Notification Socket] Socket error:", error);
    });
  });

  return notificationNamespace;
};
