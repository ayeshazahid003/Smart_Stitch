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
import Browse from "./pages/public/Browse";

import MainLayout from "./pages/MainLayout";

import UserRegistrationForm from "./pages/protected/client/Profile";
import CustomerLayout from "./pages/protected/client/CustomerLayout";
import ProfileForm from "./pages/protected/client/ProfileForm";
import AddressForm from "./pages/protected/client/AddressForm";
import MeasurementForm from "./pages/protected/client/MeasurementForm";
import TailorProfile from "./pages/public/TailorProfile";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/browse" element={<Browse/>} />
          <Route path="/tailor/:id" element={<TailorProfile/>} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route element={<CustomerLayout />}>
              <Route path="profile" element={<ProfileForm />} />
              <Route path="address" element={<AddressForm />} />
              <Route path="measurements" element={<MeasurementForm />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<UnderConstructionPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
