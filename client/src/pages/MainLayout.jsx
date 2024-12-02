import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "../context/UserContext";

function MainLayout() {
  return (
    <div>
      <UserProvider>
        <ToastContainer />

        <Outlet />
      </UserProvider>
    </div>
  );
}

export default MainLayout;
