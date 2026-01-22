import express from 'express';
import { adminLogin } from '../controllers/adminAuth.controller';
import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getAllPlans,
    deletePlan,
    getAllReviews,
    deleteReview
} from '../controllers/adminDashboard.controller';
import { protectAdmin } from '../../../shared/middleware/adminAuthMiddleware';

const router = express.Router();

// Public Admin Route
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/plans', getAllPlans);
router.delete('/plans/:id', deletePlan);

router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
