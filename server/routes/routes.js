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
import * as blogController from "../controllers/BlogController.js";
import * as imageController from "../controllers/imageController.js";
import * as trendingDesignController from "../controllers/trendingDesignController.js";
import * as refundRequestController from "../controllers/RefundRequestController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { PlatformAdminPermission } from "../middlewares/platformAdminMiddleware.js";

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

router.get(
  "/tailor/dashboard",
  protect,
  tailorProfileController.getTailorDashboard
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
  "/tailor/portfolio/:portfolioId",
  protect,
  tailorProfileController.updatePortfolio
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
router.get("/orders/user", protect, orderController.getOrdersByUser);
router.get("/orders/:id", protect, orderController.getOrderById);
router.put("/orders/:id", protect, orderController.updateOrder);
router.get("/orders", protect, orderController.getAllOrders);
router.get(
  "/orders/customer/:customerId",
  protect,
  orderController.getOrdersByCustomer
);

router.put("/orders/:id/status", orderController.updateOrderStatus);
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

// Blog Routes
router.post(
  "/blogs",
  protect,
  PlatformAdminPermission,
  blogController.createBlog
);
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/id/:id", protect, blogController.getBlogById);
router.get("/blog/:slug", blogController.getBlogBySlug);
router.put(
  "/blogs/:id",
  protect,
  PlatformAdminPermission,
  blogController.updateBlog
);
router.delete(
  "/blogs/:id",
  protect,
  PlatformAdminPermission,
  blogController.deleteBlog
);

router.post("/uploadimage", protect, imageController.uploadImage);

// Trending Designs Routes
router.post(
  "/trending-designs",
  protect,
  PlatformAdminPermission,
  trendingDesignController.addTrendingDesign
);
router.get(
  "/trending-designs",
  protect,
  PlatformAdminPermission,
  trendingDesignController.getAllTrendingDesigns
);
router.get(
  "/trending-designs/featured",
  trendingDesignController.getFeaturedTrendingDesigns
);
router.get(
  "/trending-designs/:id",
  protect,
  PlatformAdminPermission,
  trendingDesignController.getSingleTrendingDesign
);
router.put(
  "/trending-designs/:id",
  protect,
  PlatformAdminPermission,
  trendingDesignController.updateTrendingDesign
);
router.delete(
  "/trending-designs/:id",
  protect,
  PlatformAdminPermission,
  trendingDesignController.deleteTrendingDesign
);

// New routes for trending designs interactions
router.post(
  "/trending-designs/:id/like",
  protect,
  trendingDesignController.likeDesign
);
router.post(
  "/trending-designs/:id/unlike",
  protect,
  trendingDesignController.unlikeDesign
);
router.post(
  "/trending-designs/:id/download",
  protect,
  trendingDesignController.downloadDesign
);

// Refund Request Routes
// Create a new refund request (customer only)
router.post(
  "/refund-requests",
  protect,
  refundRequestController.createRefundRequest
);

// Get all refund requests (platform admin only)
router.get(
  "/refund-requests/admin",
  protect,
  PlatformAdminPermission,
  refundRequestController.getAllRefundRequests
);

// Get all refund requests for the current user
router.get(
  "/refund-requests/user",
  protect,
  refundRequestController.getUserRefundRequests
);

// Get a single refund request by ID
router.get(
  "/refund-requests/:id",
  protect,
  refundRequestController.getRefundRequestById
);

// Update a refund request (reason only - for customers)
router.put(
  "/refund-requests/:id",
  protect,
  refundRequestController.updateRefundRequest
);

// Update refund request status (platform admin only)
router.patch(
  "/refund-requests/:id/status",
  protect,
  PlatformAdminPermission,
  refundRequestController.updateRefundStatus
);

// Process a refund (platform admin only)
router.post(
  "/refund-requests/:id/process",
  protect,
  PlatformAdminPermission,
  refundRequestController.processRefund
);

export default router;
