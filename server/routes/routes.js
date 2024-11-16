import express from 'express';
import { verifyUser } from '../middlewares/VerifyUser.js';
import * as authController from '../controllers/authController.js'
import * as tailorProfileController from "../controllers/tailorProfileController.js"

const router = express.Router();

router.post("/signup", authController.createUser)
router.post("/login", authController.loginUser)
router.get('/verify-token', verifyUser, authController.verifyToken);

router.post('/tailor/profile-creation', verifyUser, tailorProfileController.createTailorProfile)
router.post('/tailor/verify-profile', verifyUser, tailorProfileController.verifyTailor)
router.post('/tailor/add-service', verifyUser ,tailorProfileController.addServiceToTailor);
router.post('/tailor/add-portfolio', verifyUser ,tailorProfileController.addPortfolioEntry);
router.delete('/tailor/service/:serviceId', tailorProfileController.removeServiceFromTailor);
router.delete('/tailor/portfolio/:portfolioId', tailorProfileController.removePortfolioFromTailor);
router.put('/tailor/service/:serviceId', tailorProfileController.updateService);
router.post('/tailor/extra-service', tailorProfileController.addExtraService);
router.put('/tailor/extra-service/:extraServiceId', tailorProfileController.updateExtraService);
router.delete('/tailor/extra-service/:extraServiceId',tailorProfileController.deleteExtraService);
router.get('/tailor/services', tailorProfileController.getListOfServices);
router.get('/tailor/extra-services', tailorProfileController.getListOfExtraServices);
router.get('/tailor/portfolio', tailorProfileController.getListOfPortfolio);



export default router