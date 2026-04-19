import { z } from 'zod';

export const searchTrainsSchema = z.object({
    from: z.string().min(2, 'From station code required').max(10),
    to: z.string().min(2, 'To station code required').max(10),
    date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in DD-MM-YYYY format')
});

export const bookTicketSchema = z.object({
    // Passenger
    passengerName: z.string().min(2).max(100),
    passengerAge: z.number().int().min(1).max(120),
    passengerGender: z.enum(['Male', 'Female', 'Other']),
    // Train
    trainNumber: z.string().min(4).max(8),
    trainName: z.string().min(2).max(200),
    fromStation: z.string().min(2).max(100),
    fromStationCode: z.string().min(2).max(10),
    toStation: z.string().min(2).max(100),
    toStationCode: z.string().min(2).max(10),
    // Journey
    journeyDate: z.string().min(10), // ISO date string
    departureTime: z.string().min(4).max(10),
    arrivalTime: z.string().min(4).max(10),
    seatClass: z.enum(['General', 'Sleeper', 'Second_AC', 'Third_AC']),
    passengersCount: z.number().int().min(1).max(6).default(1),
    fareAmount: z.number().min(0)
});

export type SearchTrainsInput = z.infer<typeof searchTrainsSchema>;
export type BookTicketInput = z.infer<typeof bookTicketSchema>;
