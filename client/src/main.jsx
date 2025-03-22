// src/index.js
import React, { StrictMode } from "react";
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
import Search from "./pages/public/Search.jsx";
import AddPortfolioOfTailor from "./pages/protected/client/AddPortfolioOfTailor.jsx";
import UserProfile from "./pages/protected/client/UserProfile.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MainLayout from "./pages/MainLayout";
import UserRegistrationForm from "./pages/protected/client/Profile";
import CustomerLayout from "./pages/protected/client/CustomerLayout";
import ProfileForm from "./pages/protected/client/ProfileForm";
import AddressForm from "./pages/protected/client/AddressForm";
import TailorDashboard from "./pages/protected/TailorDashboard";
import AllOrders from "./pages/protected/AllOrders.jsx";
import OrderDetail from "./pages/protected/OrderDetail.jsx";
import AddServices from "./pages/protected/client/AddServices.jsx";
import AddExtraServices from "./pages/protected/client/AddExtraServices.jsx";
import AddShopDetails from "./pages/protected/client/AddShopDetails.jsx";
import MeasurementForm from "./pages/protected/client/MeasurementForm";
import TailorProfile from "./pages/public/TailorProfile";
import AllExtraServices from "./pages/protected/client/AllExtraServices.jsx";
import AllServices from "./pages/protected/client/AllServices.jsx";
import AllPortfolio from "./pages/protected/client/AllPortfolio.jsx";
import Checkout from "./pages/public/Checkout";
import OrderPlaced from "./pages/public/OrderPlaced";
import Chat from "./pages/chat/Chat";
import OrderDetails from "./pages/orders/OrderDetails";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/tailor/:id" element={<TailorProfile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-placed" element={<OrderPlaced />} />
            <Route path="/order-detail/:id" element={<OrderDetails />} />
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route element={<ProtectLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route element={<CustomerLayout />}>
                <Route path="profile" element={<ProfileForm />} />
                <Route path="user-profile" element={<UserProfile />} />
                <Route path="address" element={<AddressForm />} />
                <Route path="measurements" element={<MeasurementForm />} />
                <Route path="tailor" element={<TailorDashboard />} />
                <Route path="all-orders" element={<AllOrders />} />
                <Route path="order-details/:orderId" element={<OrderDetail />} />
                <Route path="add-services" element={<AddServices />} />
                <Route path="add-extra-services" element={<AddExtraServices />} />
                <Route path="add-shop-details" element={<AddShopDetails />} />
                <Route path="add-Portfolio" element={<AddPortfolioOfTailor />} />
                <Route path="all-services" element={<AllServices />} />
                <Route path="all-extra-services" element={<AllExtraServices />} />
                <Route path="all-portfolio" element={<AllPortfolio />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<UnderConstructionPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>
);
