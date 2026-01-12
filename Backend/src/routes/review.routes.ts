import express from 'express';
import { getAllReviews, createReview, likeReview } from '../controllers/reviewController';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', createReview);
router.put('/:id/like', likeReview);

export default router;
