import express from 'express';
import { verifyUser } from '../middlewares/VerifyUser.js';
import * as authController from '../controllers/authController.js';
import * as tailorProfileController from "../controllers/tailorProfileController.js";
import * as userController from '../controllers/userController.js';
import * as vouchersController from '../controllers/vouchersController.js'
import * as reviewController from '../controllers/reviewsController.js';
import * as chatController from '../controllers/chatController.js'
import * as orderController from '../controllers/ordersController.js'


const router = express.Router();

// Authentication Routes
router.post("/signup", authController.createUser);
router.post("/login", authController.loginUser);
router.get('/verify-token', verifyUser, authController.verifyToken);

// Tailor Profile Routes
router.post('/tailor/profile-creation', verifyUser, tailorProfileController.createTailorProfile);
router.post('/tailor/verify-profile', verifyUser, tailorProfileController.verifyTailor);
router.post('/tailor/add-service', verifyUser, tailorProfileController.addServiceToTailor);
router.post('/tailor/add-portfolio', verifyUser, tailorProfileController.addPortfolioEntry);
router.delete('/tailor/service/:serviceId', verifyUser, tailorProfileController.removeServiceFromTailor);
router.delete('/tailor/portfolio/:portfolioId', verifyUser, tailorProfileController.removePortfolioFromTailor);
router.put('/tailor/service/:serviceId', verifyUser, tailorProfileController.updateService);
router.post('/tailor/extra-service', verifyUser, tailorProfileController.addExtraService);
router.put('/tailor/extra-service/:extraServiceId', verifyUser, tailorProfileController.updateExtraService);
router.delete('/tailor/extra-service/:extraServiceId', verifyUser, tailorProfileController.deleteExtraService);
router.put('/tailors/profile', verifyUser, tailorProfileController.updateTailorProfile);
router.delete('/tailors/profile', verifyUser, tailorProfileController.deleteTailorProfile);
router.get('/tailor/services', tailorProfileController.getListOfServices);
router.get('/tailor/extra-services', tailorProfileController.getListOfExtraServices);
router.get('/tailor/portfolio', tailorProfileController.getListOfPortfolio);
router.get('/tailors/search/service', tailorProfileController.searchTailorsByPartialService);
router.get('/services', tailorProfileController.getAllServicesBySearch);
router.get('/tailors/:tailorId', tailorProfileController.getTailorProfile);
router.get('/tailors', tailorProfileController.getAllTailors);
router.get('/tailors/search', tailorProfileController.searchTailors);

// User Routes
router.get('/users/:id', verifyUser, userController.getUserById); 
router.put('/users/:id', verifyUser, userController.updateUser);
router.delete('/users/:id', verifyUser, userController.deleteUser); 
router.post('/users/:id/upload-profile-picture', verifyUser, userController.uploadProfilePicture);
router.post('/users/:id/measurements', verifyUser, userController.addMeasurements); 
router.put('/users/:id/measurements', verifyUser, userController.updateMeasurements);

//vouchers Routes
router.post('/vouchers', verifyUser, vouchersController.createVoucher);
router.put('/vouchers/:id', verifyUser, vouchersController.updateVoucher);
router.delete('/vouchers/:id', verifyUser, vouchersController.deleteVoucher);
router.get('/vouchers/:id/check', verifyUser, vouchersController.checkVoucherIsApplicable);
router.get('/vouchers/:id', verifyUser, vouchersController.getSingleVoucherDetails);

// Review Routes
router.post('/reviews', verifyUser, reviewController.addReview);
router.put('/reviews/:id', verifyUser, reviewController.updateReview);
router.get('/reviews/:id', verifyUser, reviewController.getReview);
router.get('/reviews', verifyUser, reviewController.getAllReviews);
router.delete('/reviews/:id', verifyUser, reviewController.deleteReview); 

//Chat Routes 
router.get("/chats", verifyUser, chatController.getUserChats);

//Orders Routes
router.post('/orders',verifyUser ,orderController.createNewOrder);
router.get('/orders/:id',verifyUser, orderController.getOrderById);
router.get('/orders',verifyUser, orderController.getAllOrders);
router.get('/orders/customer/:customerId',verifyUser, orderController.getOrdersByCustomer);
router.get('/orders/tailor',verifyUser, orderController.getOrdersByTailor);
router.put('/orders/:id/status',verifyUser, orderController.updateOrderStatus);
router.post('/orders/:id/invoice',verifyUser, orderController.generateInvoiceForOrder);
router.get('/orders/customer/:customerId/summary',verifyUser, orderController.getOrderSummaryByCustomer);
router.get('/orders/tailor/summary',verifyUser, orderController.getOrderSummaryByTailor);
router.get('/orders/customer/status/:status',verifyUser, orderController.getOrderByStatusOfCustomers);
router.get('/orders/tailor/status/:status',verifyUser, orderController.getOrderByStatusOfTailor);



export default router;
