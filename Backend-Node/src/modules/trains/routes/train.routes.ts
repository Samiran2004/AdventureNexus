import { Router } from 'express';
import {
    searchStations,
    searchTrains,
    getTrainSchedule,
    getTrainLiveStatus,
    bookTicket,
    getMyBookings,
    cancelBooking
} from '../controllers/train.controller';

const router = Router();

// ── Public Routes (no auth required) ──────────────────────────────────────────
router.get('/stations/search', searchStations);
router.get('/search', searchTrains);
router.get('/schedule/:trainNumber', getTrainSchedule);
router.get('/live/:trainNumber', getTrainLiveStatus);

// ── Protected Routes (Clerk auth via middleware in app.ts) ────────────────────
router.post('/book', bookTicket);
router.get('/bookings/mine', getMyBookings);
router.delete('/bookings/:id/cancel', cancelBooking);

export default router;
