import { Server } from "socket.io";
import { chatSocketHandler } from "./sockets/chatSocket.js";
import { notificationSocketHandler } from "./sockets/notificationSocket.js";

let io;

const connectedUsers = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });


  // Initialize chat socket
  chatSocketHandler(io, connectedUsers);

  // Initialize notification socket
  notificationSocketHandler(io, connectedUsers);

  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}
