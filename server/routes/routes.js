import express from "express";
import { verifyUser } from "../middlewares/VerifyUser.js";
import * as authController from "../controllers/authController.js";
import * as tailorProfileController from "../controllers/tailorProfileController.js";
import * as userController from "../controllers/userController.js";
import * as vouchersController from "../controllers/vouchersController.js";
import * as reviewController from "../controllers/reviewsController.js";
import * as chatController from "../controllers/chatController.js";
import * as orderController from "../controllers/ordersController.js";
import * as offerController from "../controllers/offerController.js";
import * as campaignController from "../controllers/campaignController.js";
import * as paymentController from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.get("/verify-token", protect, authController.verifyToken);
// Tailor Profile Routes
router.post(
  "/tailor/profile-creation",
  protect,
  tailorProfileController.createTailorProfile
);
// Add this new route for getting all services in one request
router.get(
  "/tailor/:tailorId/all-services",
  tailorProfileController.getAllTailorServices
);
router.get(
  "/tailor/get-profile",
  protect,
  tailorProfileController.getTailorShopDetails
);
router.post(
  "/tailor/verify-profile",
  protect,
  tailorProfileController.verifyTailor
);
router.post(
  "/tailor/add-service",
  protect,
  tailorProfileController.addServiceToTailor
);
router.post(
  "/tailor/add-portfolio",
  protect,
  tailorProfileController.addPortfolioEntry
);
router.delete(
  "/tailor/service/:serviceId",
  protect,
  tailorProfileController.removeServiceFromTailor
);
router.delete(
  "/tailor/portfolio/:portfolioId",
  protect,
  tailorProfileController.removePortfolioFromTailor
);
router.put(
  "/tailor/service/:serviceId",
  protect,
  tailorProfileController.updateService
);
router.post(
  "/tailor/extra-service",
  protect,
  tailorProfileController.addExtraService
);
router.put(
  "/tailor/extra-service/:extraServiceId",
  protect,
  tailorProfileController.updateExtraService
);
router.delete(
  "/tailor/extra-service/:extraServiceId",
  protect,
  tailorProfileController.deleteExtraService
);
router.put(
  "/tailors/profile",
  protect,
  tailorProfileController.updateTailorProfile
);
router.delete(
  "/tailors/profile",
  protect,
  tailorProfileController.deleteTailorProfile
);
router.get(
  "/tailor/services/:tailorId",
  tailorProfileController.getListOfServices
);
router.get(
  "/tailor/extra-services/:tailorId",
  tailorProfileController.getListOfExtraServices
);
router.get(
  "/tailor/portfolio/:tailorId",
  tailorProfileController.getListOfPortfolio
);
router.get(
  "/tailors/search/service",
  tailorProfileController.searchTailorsByPartialService
);
router.get("/tailors/search", tailorProfileController.searchTailors);
router.get("/services", tailorProfileController.getAllServicesBySearch);
router.get("/tailors/:tailorId", tailorProfileController.getTailorProfile);
router.get("/tailors", tailorProfileController.getAllTailors);

router.get("/tailor/:tailorId", tailorProfileController.getTailorProfileById);

// User Routes for user profile
router.get("/users/profile", protect, userController.getUserProfile);
router.put("/users/profile", protect, userController.updateUser);
router.put("/users/update-profile", protect, userController.updateUserProfile);
router.post("/users/address", protect, userController.addUserAddress);

// user routes zain
router.get("/users/:id", protect, userController.getUserById);
router.put("/users/:id", protect, userController.updateUser);
router.delete("/users/:id", protect, userController.deleteUser);
router.post(
  "/users/:id/upload-profile-picture",
  protect,
  userController.uploadProfilePicture
);
router.post("/users/:id/measurements", protect, userController.addMeasurements);
router.put(
  "/users/:id/measurements",
  protect,
  userController.updateMeasurements
);

//vouchers Routes
router.get("/all-vouchers", protect, vouchersController.getAllVouchers);
router.post("/vouchers", protect, vouchersController.createVoucher);
router.put("/vouchers/:id", protect, vouchersController.updateVoucher);
router.delete("/vouchers/:id", protect, vouchersController.deleteVoucher);
router.get(
  "/vouchers/:id/check",
  protect,
  vouchersController.checkVoucherIsApplicable
);
router.get(
  "/vouchers/:id",
  protect,
  vouchersController.getSingleVoucherDetails
);

router.post(
  "/vouchers/verify",
  protect,
  vouchersController.verifyVoucherByTitle
);

// Review Routes
router.post("/reviews", protect, reviewController.addReview);
router.put("/reviews/:id", protect, reviewController.updateReview);
router.get("/reviews/:id", protect, reviewController.getReview);
router.get("/reviews", protect, reviewController.getAllReviews);
router.delete("/reviews/:id", protect, reviewController.deleteReview);

//Chat Routes
router.get("/chats", protect, chatController.getUserChats);
router.get("/chat-participants", protect, chatController.getChatParticipants);

//Orders Routes

router.post("/orders", protect, orderController.createNewOrder);
router.get("/orders/tailor", protect, orderController.getOrdersByTailor);
router.get("/orders/:id", protect, orderController.getOrderById);
router.put("/orders/:id", protect, orderController.updateOrder);
router.get("/orders", protect, orderController.getAllOrders);
router.get(
  "/orders/customer/:customerId",
  protect,
  orderController.getOrdersByCustomer
);

router.put("/orders/:id/status", protect, orderController.updateOrderStatus);
router.post(
  "/orders/:id/invoice",
  protect,
  orderController.generateInvoiceForOrder
);
router.get(
  "/orders/customer/:customerId/summary",
  protect,
  orderController.getOrderSummaryByCustomer
);
router.get(
  "/orders/tailor/summary",
  protect,
  orderController.getOrderSummaryByTailor
);
router.get(
  "/orders/customer/status/:status",
  protect,
  orderController.getOrderByStatusOfCustomers
);
router.get(
  "/orders/tailor/status/:status",
  protect,
  orderController.getOrderByStatusOfTailor
);

// Offer routes
router.post("/offers", protect, offerController.createOffer);
router.get("/offers", protect, offerController.getOffers);
router.post(
  "/offers/:offerId/negotiate",
  protect,
  offerController.negotiateOffer
);
router.patch(
  "/offers/:offerId/status",
  protect,
  offerController.updateOfferStatus
);

// Campaign Routes
router.post("/campaigns", protect, campaignController.createCampaign);
router.get("/campaigns/tailor", protect, campaignController.getTailorCampaigns);
router.get("/campaigns/active", campaignController.getActiveCampaigns);
router.put("/campaigns/:id", protect, campaignController.updateCampaign);
router.delete("/campaigns/:id", protect, campaignController.deleteCampaign);

// Payment Routes
router.post(
  "/stripe/create-checkout-session",
  protect,
  paymentController.createCheckoutSession
);
router.get(
  "/stripe/verify-session/:sessionId",
  protect,
  paymentController.verifySession
);
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

export default router;
