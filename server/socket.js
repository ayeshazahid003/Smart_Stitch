import { Server } from "socket.io";

let io; 

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend URL
      methods: ["GET", "POST"],
    },
  });
  return io;
}

// Export a function to retrieve the io instance
export function getSocket() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}
