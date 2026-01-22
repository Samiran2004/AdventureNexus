import express from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';
import protect from '../../../shared/middleware/authClerkTokenMiddleware';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

export default router;
