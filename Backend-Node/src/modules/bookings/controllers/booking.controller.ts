import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Booking from "../../../shared/database/models/bookingModel";
import logger from "../../../shared/utils/logger";
import getFullURL from "../../../shared/services/getFullURL.service";

/**
 * Create a new booking (Hotel or Flight)
 */
export const createBooking = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }

        const { type, referenceId, roomId, totalPrice, travelDates, paxCount, bookingDetails } = req.body;

        if (!type || !referenceId || !totalPrice) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Missing required fields"
            });
        }

        // In a real app, we'd find the userId from clerkUserId first
        // For now, let's assume the user exists
        const bookingData = {
            clerkUserId,
            userId: (req as any).user?._id, // Assume middleware attaches this
            type,
            referenceId,
            roomId,
            totalPrice,
            travelDates,
            paxCount,
            bookingDetails,
            status: 'Confirmed' // Simulate successful booking
        };

        const newBooking = new Booking(bookingData);
        await newBooking.save();

        logger.info(`URL: ${fullUrl} - Booking created: ${newBooking._id}`);

        return res.status(StatusCodes.CREATED).json({
            status: "Ok",
            message: "Booking confirmed",
            data: newBooking
        });

    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - Error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

/**
 * Get all bookings for the current user
 */
export const getMyBookings = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }

        const bookings = await Booking.find({ clerkUserId })
            .populate('referenceId')
            .populate('roomId');

        return res.status(StatusCodes.OK).json({
            status: "Ok",
            data: bookings
        });

    } catch (error: any) {
        logger.error(`URL: ${fullUrl} - Error: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};
