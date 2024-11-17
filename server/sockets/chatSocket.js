import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const chatSocketHandler = (io, connectedUsers) => {
  io.on("connection", (socket) => {
    console.log(`Chat Socket connected: ${socket.id}`);

    // Handle user connection
    socket.on("userConnected", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // Join a specific chat room
    socket.on("joinChat", (chatId) => {
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
      socket.join(chatId);
    });

    // Send a message
    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, senderId, message, participants } = data;

        let chat = await Chat.findById(chatId);

        // Create a new chat if it doesn't exist
        if (!chat) {
          if (!participants || participants.length < 2) {
            return socket.emit("error", {
              message: "Participants are required to create a new chat.",
            });
          }

          chat = new Chat({
            participants: participants.map((id) =>
              mongoose.Types.ObjectId(id)
            ),
            messages: [],
            readStatus: participants.map((id) => ({
              userId: mongoose.Types.ObjectId(id),
              lastReadMessageId: null, // No messages read yet
            })),
          });
        }

        const newMessage = {
          senderId: mongoose.Types.ObjectId(senderId),
          message,
        };

        chat.messages.push(newMessage);
        chat.updatedAt = new Date();

        chat.participants.forEach((participant) => {
          if (participant.toString() !== senderId) {
            const unreadStatus = chat.readStatus.find(
              (status) => status.userId.toString() === participant.toString()
            );
            if (unreadStatus) {
              unreadStatus.lastReadMessageId = null;
            }
          }
        });

        await chat.save();

        io.to(chat._id.toString()).emit("messageReceived", {
          chatId: chat._id,
          message: newMessage,
        });

        chat.participants.forEach((participant) => {
          if (
            participant.toString() !== senderId &&
            connectedUsers[participant]
          ) {
            io.to(connectedUsers[participant]).emit("newMessageNotification", {
              chatId: chat._id,
              senderId,
              message: newMessage.message,
            });
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark messages as read
    socket.on("markAsRead", async (data) => {
      try {
        const { chatId, userId, lastReadMessageId } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          return socket.emit("error", { message: "Chat not found" });
        }

        const readStatus = chat.readStatus.find(
          (status) => status.userId.toString() === userId
        );

        if (readStatus) {
          readStatus.lastReadMessageId = mongoose.Types.ObjectId(
            lastReadMessageId
          );
        } else {
          chat.readStatus.push({
            userId: mongoose.Types.ObjectId(userId),
            lastReadMessageId: mongoose.Types.ObjectId(lastReadMessageId),
          });
        }

        await chat.save();

        io.to(chatId).emit("readStatusUpdated", {
          chatId,
          userId,
          lastReadMessageId,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    socket.on("disconnect", () => {
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          console.log(`User ${userId} disconnected.`);
          break;
        }
      }
      console.log(`Chat Socket disconnected: ${socket.id}`);
    });
  });
};
