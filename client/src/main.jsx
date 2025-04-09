// src/index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./pages/MainLayout";
import AuthLayout from "./pages/auth/AuthLayout";
import CustomerLayout from "./pages/protected/client/CustomerLayout";
import ProtectLayout from "./pages/protected/ProtectLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import Browse from "./pages/public/Browse";
import Search from "./pages/public/Search";
import TailorProfile from "./pages/public/TailorProfile";
import Checkout from "./pages/public/Checkout";
import OrderPlaced from "./pages/public/OrderPlaced";
import UnderConstructionPage from "./pages/public/UnderConstructionPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";

// Protected Pages
import UserProfile from "./pages/protected/client/UserProfile";
import MeasurementForm from "./pages/protected/client/MeasurementForm";
import Chat from "./pages/chat/Chat";
import AllOrders from "./pages/protected/AllOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import TailorDashboard from "./pages/protected/TailorDashboard";
import AddPortfolioOfTailor from "./pages/protected/client/AddPortfolioOfTailor";
import AddServices from "./pages/protected/client/AddServices";
import AddExtraServices from "./pages/protected/client/AddExtraServices";
import AddShopDetails from "./pages/protected/client/AddShopDetails";
import AllExtraServices from "./pages/protected/client/AllExtraServices";
import AllServices from "./pages/protected/client/AllServices";
import AllPortfolio from "./pages/protected/client/AllPortfolio";
import OrderDetail from "./pages/protected/OrderDetail";
import AddressForm from "./pages/protected/client/AddressForm";
import Offers from "./pages/protected/Offers";

// Context
import { SocketProvider } from "./context/SocketContext";
import Campaigns from "./pages/protected/tailor/Campaigns";
import Vouchers from "./pages/protected/tailor/Vouchers";
import { UserProvider } from "./context/UserContext";
import TailorOrders from "./pages/protected/tailor/TailorOrders";
import BlogListingPage from "./pages/protected/platform_admin/BlogListingPage";
import BlogCreationPage from "./pages/protected/platform_admin/BlogCreationPage";
import SingleBlogPage from "./pages/public/SingleBlogPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/search" element={<Search />} />
              <Route path="/blogs/:slug" element={<SingleBlogPage />} />
              <Route path="/tailor/:id" element={<TailorProfile />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/order-placed" element={<OrderPlaced />} />
              <Route path="chats" element={<Chat />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="verify-otp" element={<VerifyOTP />} />
                <Route path="reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectLayout />}>
                <Route element={<CustomerLayout />}>
                  {/* Customer Routes */}
                  <Route path="user-profile" element={<UserProfile />} />
                  <Route path="measurements" element={<MeasurementForm />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="orders" element={<AllOrders />} />
                  <Route path="orders" element={<OrderDetails />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/vouchers" element={<Vouchers />} />
                  <Route path="tailor/orders" element={<TailorOrders />} />
                  <Route
                    path="/platform-admin/blogs"
                    element={<BlogListingPage />}
                  />
                  <Route
                    path="/admin/blogs/create"
                    element={<BlogCreationPage />}
                  />
                  <Route
                    path="/admin/blogs/edit/:id"
                    element={<BlogCreationPage />}
                  />

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
      </UserProvider>
    </SocketProvider>
    <ToastContainer />
  </StrictMode>
);
