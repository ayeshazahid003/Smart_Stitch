import Notification from "../models/Notification.js";

export const notificationSocketHandler = (io, connectedUsers) => {
  io.on("connection", (socket) => {
    console.log(`Notification Socket connected: ${socket.id}`);

    // Handle sending notifications
    socket.on("sendNotification", async (data) => {
      const { receiverId, type, message } = data;

      try {
        // Save the notification to the database
        const newNotification = new Notification({
          userId: receiverId,
          type,
          message,
        });
        await newNotification.save();

        // Check if the user is connected via socket
        if (connectedUsers[receiverId]) {
          io.to(connectedUsers[receiverId]).emit("receiveNotification", {
            notification: newNotification,
          });
        } else {
          console.log(`User ${receiverId} is not connected.`);
        }
      } catch (error) {
        console.error("Error saving notification:", error);
        socket.emit("error", {
          message: "Failed to send notification.",
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`Notification Socket disconnected: ${socket.id}`);
    });
  });
};
