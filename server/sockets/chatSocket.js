import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const chatSocketHandler = (io, connectedUsers) => {
  io.on("connection", (socket) => {
    console.log(`Chat Socket connected: ${socket.id}`);

    // 1) Track user -> socket mapping
    socket.on("userConnected", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // 2) Join a specific chat room
    socket.on("joinChat", (chatId) => {
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
      socket.join(chatId);
    });

    // 3) Send a message
    socket.on("sendMessage", async (data) => {
      try {
        console.log("Data received in sendMessage:", data);
        const { chatId, senderId, message, participants } = data;

        // Check if this chat already exists in the DB
        let chat = await Chat.findById(chatId);

        // If no chat, create a new one with the given participants
        if (!chat) {
          if (!participants || participants.length < 2) {
            return socket.emit("error", {
              message: "Participants are required to create a new chat.",
            });
          }

          chat = new Chat({
            participants: participants.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            messages: [],
            readStatus: participants.map((id) => ({
              userId: new mongoose.Types.ObjectId(id),
              lastReadMessageId: null,
            })),
          });
        }

        // Build the new message
        const newMessage = {
          _id: new mongoose.Types.ObjectId(),
          senderId: new mongoose.Types.ObjectId(senderId),
          message,
        };

        // Add to messages array
        chat.messages.push(newMessage);
        chat.updatedAt = new Date();

        // Mark unread for other participants
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

        // === Send 'messageReceived' only to other sockets in this room ===
        // This prevents the sender from receiving their own message again
        socket.broadcast.to(chat._id.toString()).emit("messageReceived", {
          chatId: chat._id,
          message: newMessage,
        });

        // === Also send a 'newMessageNotification' to other participants if they're online ===
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

    // 4) Mark messages as read
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
          readStatus.lastReadMessageId = new mongoose.Types.ObjectId(
            lastReadMessageId
          );
        } else {
          chat.readStatus.push({
            userId: new mongoose.Types.ObjectId(userId),
            lastReadMessageId: new mongoose.Types.ObjectId(lastReadMessageId),
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

    // 5) On disconnect
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
