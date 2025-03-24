// src/index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Layouts
import MainLayout from "./pages/MainLayout";
import AuthLayout from "./pages/auth/AuthLayout";
import CustomerLayout from "./pages/protected/client/CustomerLayout";
import ProtectLayout from "./pages/protected/ProtectLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import Browse from "./pages/public/Browse";
import Search from "./pages/public/Search.jsx";
import TailorProfile from "./pages/public/TailorProfile";
import Checkout from "./pages/public/Checkout";
import OrderPlaced from "./pages/public/OrderPlaced";
import UnderConstructionPage from "./pages/public/UnderConstructionPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import UserProfile from "./pages/protected/client/UserProfile.jsx";
import MeasurementForm from "./pages/protected/client/MeasurementForm";
import Chat from "./pages/chat/Chat";
import AllOrders from "./pages/protected/AllOrders.jsx";
import OrderDetails from "./pages/orders/OrderDetails";
import TailorDashboard from "./pages/protected/TailorDashboard";
import AddPortfolioOfTailor from "./pages/protected/client/AddPortfolioOfTailor.jsx";
import AddServices from "./pages/protected/client/AddServices.jsx";
import AddExtraServices from "./pages/protected/client/AddExtraServices.jsx";
import AddShopDetails from "./pages/protected/client/AddShopDetails.jsx";
import AllExtraServices from "./pages/protected/client/AllExtraServices.jsx";
import AllServices from "./pages/protected/client/AllServices.jsx";
import AllPortfolio from "./pages/protected/client/AllPortfolio.jsx";
import OrderDetail from "./pages/protected/OrderDetail.jsx";
import AddressForm from "./pages/protected/client/AddressForm";

// Context
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tailor/:id" element={<TailorProfile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-placed" element={<OrderPlaced />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectLayout />}>
              <Route element={<CustomerLayout />}>
                {/* Customer Routes */}
                <Route path="user-profile" element={<UserProfile />} />
                <Route path="measurements" element={<MeasurementForm />} />
                <Route path="chats" element={<Chat />} />
                <Route path="requests" element={<AllOrders />} />
                <Route path="orders" element={<OrderDetails />} />

                {/* Tailor Routes */}
                <Route path="tailor" element={<TailorDashboard />} />
                <Route path="all-services" element={<AllServices />} />
                <Route path="add-services" element={<AddServices />} />
                <Route
                  path="all-extra-services"
                  element={<AllExtraServices />}
                />
                <Route
                  path="add-extra-services"
                  element={<AddExtraServices />}
                />
                <Route path="all-portfolio" element={<AllPortfolio />} />
                <Route
                  path="add-Portfolio"
                  element={<AddPortfolioOfTailor />}
                />
                <Route path="offers" element={<UnderConstructionPage />} />

                {/* Shared Routes */}
                <Route path="address" element={<AddressForm />} />
                <Route path="add-shop-details" element={<AddShopDetails />} />
                <Route
                  path="order-details/:orderId"
                  element={<OrderDetail />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<UnderConstructionPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>
);
