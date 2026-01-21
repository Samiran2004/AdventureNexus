import express from 'express';
import { getAllReviews, createReview, likeReview } from '../controllers/reviewController';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';
import { CACHE_CONFIG } from '../config/cache.config';

const router = express.Router();

router.get('/', cacheMiddleware({ prefix: CACHE_CONFIG.PREFIX.REVIEWS }), getAllReviews);
router.post('/', createReview);
router.put('/:id/like', likeReview);

export default router;
