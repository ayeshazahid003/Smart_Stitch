import { Server } from "socket.io";
import { chatSocketHandler } from "./sockets/chatSocket.js";
import { notificationSocketHandler } from "./sockets/notificationSocket.js";

let io;
const connectedUsers = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    path: "/socket.io",
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    },
  });

  // Middleware to log all socket events
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("[Socket.io] Connection attempt without userId");
      return next(new Error("Authentication error"));
    }

    console.log(`[Socket.io] Auth successful for user: ${userId}`);
    socket.userId = userId;
    next();
  });

  // Global error handler
  io.engine.on("connection_error", (err) => {
    console.log("[Socket.io] Connection error:", err);
  });

  io.on("connection", (socket) => {
    console.log(
      `[Socket.io] New connection: ${socket.id}, User: ${socket.userId}`
    );

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.io] Client disconnected. Reason: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error("[Socket.io] Socket error:", error);
    });
  });

  // Initialize handlers with error catching
  try {
    chatSocketHandler(io, connectedUsers);
    notificationSocketHandler(io, connectedUsers);
  } catch (error) {
    console.error("[Socket.io] Error initializing socket handlers:", error);
  }

  return io;
}

export function getSocket() {
  if (!io) {
    console.error("[Socket.io] Not initialized!");
    return null;
  }
  return io;
}

// Helper function to broadcast to specific user
export function emitToUser(userId, event, data) {
  if (!io) return;
  const namespace = io.of("/");
  namespace.to(`user_${userId}`).emit(event, data);
}
