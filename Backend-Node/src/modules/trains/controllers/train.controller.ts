import { Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import logger from '../../../shared/utils/logger';
import getFullURL from '../../../shared/services/getFullURL.service';
import * as IrctcService from '../services/irctc.service';
import { generatePNR } from '../services/pnr.service';
import TrainBooking from '../../../shared/database/models/trainBookingModel';
import { searchTrainsSchema, bookTicketSchema } from '../validators/train.validator';

const BOOKING_DISCLAIMER =
    'This is a DEMO booking on AdventureNexus. NO actual IRCTC ticket has been issued. ' +
    'For real train tickets, please visit irctc.co.in';

// ─── GET /api/v1/trains/stations/search ──────────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/stations/search:
 *   get:
 *     summary: Search railway stations by name or code
 *     tags: [Trains]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Station name or code (min 2 chars)
 *     responses:
 *       200:
 *         description: List of matching stations
 */
export const searchStations = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const query = (req.query.q as string) || '';
        if (query.length < 2) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Query must be at least 2 characters'
            });
        }

        const stations = await IrctcService.searchStations(query);
        return res.status(StatusCodes.OK).json({ status: 'Ok', data: stations });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - searchStations error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── GET /api/v1/trains/search ───────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/search:
 *   get:
 *     summary: Search trains between two stations on a given date
 *     tags: [Trains]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string }
 *         required: true
 *         description: Origin station code (e.g. NDLS)
 *       - in: query
 *         name: to
 *         schema: { type: string }
 *         required: true
 *         description: Destination station code (e.g. HWH)
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *         required: true
 *         description: Journey date in DD-MM-YYYY format
 *     responses:
 *       200:
 *         description: List of available trains
 */
export const searchTrains = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const parseResult = searchTrainsSchema.safeParse({
            from: req.query.from,
            to: req.query.to,
            date: req.query.date
        });

        if (!parseResult.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Invalid parameters',
                errors: parseResult.error.flatten().fieldErrors
            });
        }

        const { from, to, date } = parseResult.data;
        const trains = await IrctcService.searchTrains(from, to, date);

        logger.info(`URL: ${fullUrl} - searchTrains: ${from} → ${to} on ${date}, found ${trains.length}`);
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            count: trains.length,
            data: trains,
            isDemo: !Boolean(process.env.RAPIDAPI_KEY)
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - searchTrains error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── GET /api/v1/trains/schedule/:trainNumber ─────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/schedule/{trainNumber}:
 *   get:
 *     summary: Get complete timetable/schedule for a train
 *     tags: [Trains]
 *     parameters:
 *       - in: path
 *         name: trainNumber
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: List of stations with arrival/departure times
 */
export const getTrainSchedule = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const { trainNumber } = req.params;
        if (!trainNumber || trainNumber.length < 4) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Valid train number required'
            });
        }

        const schedule = await IrctcService.getTrainSchedule(trainNumber);
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            trainNumber,
            count: schedule.length,
            data: schedule,
            isDemo: !Boolean(process.env.RAPIDAPI_KEY)
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - getTrainSchedule error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── GET /api/v1/trains/live/:trainNumber ─────────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/live/{trainNumber}:
 *   get:
 *     summary: Get live running status of a train
 *     tags: [Trains]
 *     parameters:
 *       - in: path
 *         name: trainNumber
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Live status of the train
 */
export const getTrainLiveStatus = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const { trainNumber } = req.params;
        if (!trainNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Train number required'
            });
        }

        const liveStatus = await IrctcService.getTrainLiveStatus(trainNumber);
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            data: liveStatus,
            isDemo: !Boolean(process.env.RAPIDAPI_KEY)
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - getTrainLiveStatus error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── POST /api/v1/trains/book ─────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/book:
 *   post:
 *     summary: Book a simulated unreserved/sleeper train ticket (Demo)
 *     tags: [Trains]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passengerName
 *               - passengerAge
 *               - passengerGender
 *               - trainNumber
 *               - trainName
 *               - fromStation
 *               - fromStationCode
 *               - toStation
 *               - toStationCode
 *               - journeyDate
 *               - departureTime
 *               - arrivalTime
 *               - seatClass
 *               - fareAmount
 *     responses:
 *       201:
 *         description: Booking confirmed with PNR number
 *       401:
 *         description: Unauthorized
 */
export const bookTicket = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: 'Authentication required to book tickets'
            });
        }

        const parseResult = bookTicketSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Invalid booking data',
                errors: parseResult.error.flatten().fieldErrors
            });
        }

        const bookingData = parseResult.data;
        const pnrNumber = generatePNR();

        const newBooking = new TrainBooking({
            clerkUserId,
            ...bookingData,
            journeyDate: new Date(bookingData.journeyDate),
            pnrNumber,
            status: 'Confirmed',
            disclaimer: BOOKING_DISCLAIMER
        });

        await newBooking.save();

        logger.info(`URL: ${fullUrl} - Train booking created: PNR=${pnrNumber} by ${clerkUserId}`);

        return res.status(StatusCodes.CREATED).json({
            status: 'Ok',
            message: 'Booking confirmed (Demo)',
            data: {
                pnrNumber: newBooking.pnrNumber,
                trainNumber: newBooking.trainNumber,
                trainName: newBooking.trainName,
                from: newBooking.fromStation,
                to: newBooking.toStation,
                journeyDate: newBooking.journeyDate,
                passengerName: newBooking.passengerName,
                seatClass: newBooking.seatClass,
                fareAmount: newBooking.fareAmount,
                status: newBooking.status,
                disclaimer: newBooking.disclaimer,
                bookingId: newBooking._id
            }
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - bookTicket error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── GET /api/v1/trains/bookings/mine ────────────────────────────────────────
/**
 * @swagger
 * /api/v1/trains/bookings/mine:
 *   get:
 *     summary: Get all train bookings for the logged-in user
 *     tags: [Trains]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: List of user's train bookings
 *       401:
 *         description: Unauthorized
 */
export const getMyBookings = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: 'Authentication required'
            });
        }

        const bookings = await TrainBooking.find({ clerkUserId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            count: bookings.length,
            data: bookings
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - getMyBookings error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

// ─── DELETE /api/v1/trains/bookings/:id/cancel ───────────────────────────────
/**
 * @swagger
 * /api/v1/trains/bookings/{id}/cancel:
 *   delete:
 *     summary: Cancel a train booking
 *     tags: [Trains]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       404:
 *         description: Booking not found
 */
export const cancelBooking = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: 'Authentication required'
            });
        }

        const { id } = req.params;
        const booking = await TrainBooking.findOne({ _id: id, clerkUserId });

        if (!booking) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'Booking not found or does not belong to you'
            });
        }

        if (booking.status === 'Cancelled') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'Cancelled';
        await booking.save();

        logger.info(`URL: ${fullUrl} - Train booking cancelled: ${id} by ${clerkUserId}`);

        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            message: 'Booking cancelled successfully',
            data: { pnrNumber: booking.pnrNumber, status: booking.status }
        });
    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - cancelBooking error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};
