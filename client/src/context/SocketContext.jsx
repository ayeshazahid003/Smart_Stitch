// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to your backend Socket.io server URL
    const newSocket = io("http://localhost:5000"); // update with your backend URL if different
    setSocket(newSocket);

    // Optional: If you have an authenticated user, you can notify the backend:
    // newSocket.emit("userConnected", userId);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
