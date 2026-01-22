import { Router } from 'express';
import { likePlan, unlikePlan, getLikedPlans } from '../controllers/likedPlansController';
import { protect } from '../../../shared/middleware/authClerkTokenMiddleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Like a plan
router.post('/:planId', likePlan);

// Unlike a plan
router.delete('/:planId', unlikePlan);

// Get all liked plans for current user
router.get('/', getLikedPlans);

export default router;
