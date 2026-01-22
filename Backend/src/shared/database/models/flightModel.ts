import { Schema, model, Document } from 'mongoose';
import { IFlight } from '../dtos/FlightsDTO';

export interface IFlightDocument extends IFlight, Document { }

const flightSchema = new Schema<IFlightDocument>({
    airline: { type: String, required: true },
    flight_number: { type: String, required: true },
    departure_time: { type: String, required: true },
    arrival_time: { type: String, required: true },
    price: { type: String, required: true },
    class: { type: String, default: 'Economy' },
    duration: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure_airport: String,
    arrival_airport: String,
    available_seats: { type: Number, default: 60 }
}, { timestamps: true });

const Flight = model<IFlightDocument>('Flight', flightSchema);
export default Flight;
