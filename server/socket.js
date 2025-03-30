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
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware to log all socket events
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      console.log(`Socket auth successful for user: ${userId}`);
      socket.userId = userId;
      next();
    } else {
      console.log("Socket connection attempt without userId");
      next();
    }
  });

  io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}, User: ${socket.userId}`);
  });

  // Initialize handlers
  chatSocketHandler(io, connectedUsers);
  notificationSocketHandler(io, connectedUsers);

  return io;
}

export function getSocket() {
  if (!io) {
    console.error("Socket.io not initialized!");
    return null;
  }
  return io;
}
