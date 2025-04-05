import Notification from "../models/Notification.js";

export const notificationSocketHandler = (io, connectedUsers) => {
  const notificationNamespace = io.of("/notifications");

  // Handle namespace connection errors
  notificationNamespace.on("connect_error", (error) => {
    console.error("[Notification Socket] Namespace connection error:", error);
  });

  notificationNamespace.on("connection", (socket) => {
    console.log(`[Notification Socket] New connection: ${socket.id}`);

    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("[Notification Socket] Connection attempt without userId");
      socket.disconnect();
      return;
    }

    // Store user's socket id and join their room
    connectedUsers[userId] = socket.id;
    socket.join(`user_${userId}`);
    console.log(
      `[Notification Socket] User ${userId} joined room: user_${userId}`
    );

    // Send connection confirmation and fetch initial notifications
    socket.emit("connectionConfirmed", { userId, socketId: socket.id });

    const fetchAndSendNotifications = async () => {
      try {
        const notifications = await Notification.find({
          userId,
          isRead: false,
        })
          .sort({ createdAt: -1 })
          .exec();

        console.log(
          `[Notification Socket] Found ${notifications.length} unread notifications for user ${userId}`
        );
        socket.emit("unreadNotifications", notifications);
      } catch (error) {
        console.error(
          "[Notification Socket] Error fetching notifications:",
          error
        );
        socket.emit("error", { message: "Failed to fetch notifications" });
      }
    };

    // Fetch notifications on initial connection
    fetchAndSendNotifications();

    // Handle reconnection
    socket.on("userConnected", async (reconnectedUserId) => {
      if (reconnectedUserId !== userId) {
        console.warn("[Notification Socket] User ID mismatch on reconnection");
        return;
      }
      console.log(`[Notification Socket] User ${userId} reconnected`);
      await fetchAndSendNotifications();
    });

    // Handle fetching unread notifications
    socket.on("getUnreadNotifications", async () => {
      await fetchAndSendNotifications();
    });

    // Handle marking notifications as read
    socket.on("markNotificationRead", async ({ notificationId }) => {
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
        console.error("[Notification Socket] Error marking as read:", error);
        socket.emit("error", {
          message: "Failed to mark notification as read",
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `[Notification Socket] User ${userId} disconnected. Reason: ${reason}`
      );
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
      }
      socket.leave(`user_${userId}`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(
        `[Notification Socket] Socket error for user ${userId}:`,
        error
      );
    });
  });

  return notificationNamespace;
};
