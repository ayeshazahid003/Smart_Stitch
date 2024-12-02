import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "../context/UserContext";
import Header from "../components/client/Header";

function MainLayout() {
  return (
    <div>
      <UserProvider>
        <ToastContainer />
        {/* <Header /> */}

        <Outlet />
      </UserProvider>
    </div>
  );
}

export default MainLayout;
