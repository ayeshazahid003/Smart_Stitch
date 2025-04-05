// src/context/SocketContext.js
import { createContext, useContext } from "react";
import { getSocket } from "@/lib/socketUtils";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const value = {
    getSocket: () => getSocket(),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn(
      "[Socket Context] useSocket must be used within a SocketProvider"
    );
  }
  return context;
};
