// src/context/SocketContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useUser } from "./UserContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  const connectSocket = useCallback(() => {
    console.log("[Socket Context] Attempting to connect socket", user);
    if (!user?._id) {
      console.log("[Socket Context] No user ID available, skipping connection");
      return;
    }

    console.log(
      "[Socket Context] Initializing socket connection for user:",
      user._id
    );

    // Connect to the notification namespace
    const newSocket = io("http://localhost:5000/notifications", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        userId: user._id,
      },
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log(
        "[Socket Context] Connected successfully, socket ID:",
        newSocket.id
      );
      newSocket.emit("userConnected", user._id);
    });

    newSocket.on("connectionConfirmed", (data) => {
      console.log("[Socket Context] Connection confirmed:", data);
    });

    // Notification events
    newSocket.on("receiveNotification", (data) => {
      console.log("[Socket Context] Received notification:", data);
    });

    newSocket.on("notificationRead", (notification) => {
      console.log(
        "[Socket Context] Notification marked as read:",
        notification
      );
    });

    newSocket.on("unreadNotifications", (notifications) => {
      console.log(
        "[Socket Context] Received unread notifications:",
        notifications
      );
    });

    // Error handling
    newSocket.on("connect_error", (error) => {
      console.error("[Socket Context] Connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("[Socket Context] Socket error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[Socket Context] Socket disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("[Socket Context] Cleaning up socket connection");
        newSocket.disconnect();
      }
    };
  }, [user?._id]);

  useEffect(() => {
    const cleanup = connectSocket();
    return () => cleanup?.();
  }, [connectSocket]);

  // Provide both the main socket and notification functions
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn(
      "[Socket Context] useSocket must be used within a SocketProvider"
    );
  }
  return socket;
};
