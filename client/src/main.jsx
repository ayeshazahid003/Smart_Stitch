import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/public/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UnderConstructionPage from "./pages/public/UnderConstructionPage";
import ProtectLayout from "./pages/protected/ProtectLayout";
import Dashboard from "./pages/protected/dashboard";

import MainLayout from "./pages/MainLayout";

import UserRegistrationForm from "./pages/protected/client/Profile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<UserRegistrationForm />} />
          </Route>
        </Route>
        <Route path="*" element={<UnderConstructionPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
