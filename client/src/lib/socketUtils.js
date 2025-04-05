import io from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const connectSocket = (userId) => {
  // Clean up existing socket if any
  if (socket) {
    console.log("[Socket Util] Cleaning up existing socket connection");
    socket.disconnect();
    socket = null;
  }

  if (!userId) {
    console.log("[Socket Util] No user ID available, skipping connection");
    return null;
  }

  console.log("[Socket Util] Initializing socket connection for user:", userId);

  // Connect to the notification namespace
  const socketUrl = `${BASE_URL}/notifications`;
  const newSocket = io(socketUrl, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    auth: {
      userId: userId,
    },
  });

  // Connection events with reconnection handling
  newSocket.on("connect", () => {
    console.log(
      "[Socket Util] Connected successfully, socket ID:",
      newSocket.id
    );
    newSocket.emit("userConnected", userId);
  });

  newSocket.on("connect_error", (error) => {
    console.error("[Socket Util] Connection error:", error);
  });

  newSocket.on("reconnect_attempt", (attempt) => {
    console.log("[Socket Util] Reconnection attempt:", attempt);
  });

  newSocket.on("reconnect", (attempt) => {
    console.log("[Socket Util] Reconnected after", attempt, "attempts");
    // Re-establish user connection after reconnect
    newSocket.emit("userConnected", userId);
  });

  newSocket.on("disconnect", (reason) => {
    console.log("[Socket Util] Socket disconnected:", reason);
  });

  socket = newSocket;
  return newSocket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("[Socket Util] Manually disconnecting socket");
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
