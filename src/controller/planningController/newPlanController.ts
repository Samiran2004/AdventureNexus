import { NextFunction, Request, Response } from 'express';
import Plan from '../../Database/models/planModel';
import User from '../../Database/models/userModel';
import generateFlightPrompt from '../../utils/Gemini Utils/flightPlanPrompt';
import generateHotelPrompt from '../../utils/Gemini Utils/hotelPlanPrompt';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import redis from '../../redis/client';
import { ObjectId } from 'mongoose';
import createHttpError from 'http-errors';

interface TravelDates {
    start_date: string;
    end_date: string;
}

export interface CreatePlanRequestBody {
    destination: string;
    dispatch_city: string;
    travel_dates: TravelDates;
    budget: string;
    total_people: number;
}
export interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}>
    extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
        currency_code: string;
    };
}

export const createPlan = async (
    req: CustomRequest<{}, {}, CreatePlanRequestBody>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const {
            destination,
            dispatch_city,
            travel_dates,
            budget,
            total_people,
        } = req.body;

        // Check if all required fields are present
        if (
            !destination ||
            !dispatch_city ||
            !travel_dates ||
            !budget ||
            !total_people
        ) {
            return next(createHttpError(400, 'All fields are required!'));
        }

        const lowerDestination: string = destination.toLowerCase();
        const lowerDispatchCity: string = dispatch_city.toLowerCase();
        const lowerBudget: string = budget.toLowerCase();

        // Check plan in Redis
        const redisKey = `${req.user._id}:${lowerDestination}:${lowerDispatchCity}:${total_people}:${lowerBudget}`;
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                // console.log("Internal Redis Error...");  //For Debugging
                return next(
                    createHttpError(500, 'Internal Redis Server Error!')
                );
            }

            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    message: 'Plan Already Created',
                    data: JSON.parse(cacheData),
                });
            } else {
                // Check plan in plan database
                const checkPlan = await Plan.findOne({
                    destination: lowerDestination,
                    dispatch_city: lowerDispatchCity,
                    total_people,
                    user: req.user._id,
                });

                // Return the existing plan and save it into cache
                if (checkPlan) {
                    await redis.setex(redisKey, 120, JSON.stringify(checkPlan));
                    return res.status(200).json({
                        status: 'Success',
                        message: 'Plan Already Created',
                        data: checkPlan,
                    });
                }

                // Generate Flight Data
                const flightPayload = {
                    start_destination: lowerDispatchCity,
                    final_destination: lowerDestination,
                    start_date: travel_dates.start_date,
                    return_date: travel_dates.end_date,
                    total_people,
                    budget: lowerBudget,
                    currency_code: req.user.currency_code,
                };

                const flightPrompt: string =
                    generateFlightPrompt(flightPayload);
                const generateFlightData: string =
                    (await generateRecommendation(flightPrompt)) as string;
                let flightData;
                flightData = JSON.parse(
                    generateFlightData.replace(/```json|```/g, '').trim()
                );

                // Generate Hotels Data
                const hotelPayload = {
                    destination: lowerDestination,
                    checkInDate: travel_dates.start_date,
                    checkOutDate: travel_dates.end_date,
                    total_people,
                    type: lowerBudget,
                    currency_code: req.user.currency_code,
                };

                const hotelPrompt: string = generateHotelPrompt(hotelPayload);
                const generateHotelData: string = (await generateRecommendation(
                    hotelPrompt
                )) as string;
                var hotelsData = JSON.parse(
                    generateHotelData.replace(/```json|```/g, '').trim()
                );

                // Save the plan in the database
                const newPlan = new Plan({
                    user: req.user._id,
                    destination: lowerDestination,
                    dispatch_city: lowerDispatchCity,
                    budget: lowerBudget,
                    total_people,
                    travel_dates: {
                        start_date: travel_dates.start_date,
                        end_date: travel_dates.end_date,
                    },
                    flights: flightData,
                    hotels: hotelsData,
                });

                const planSaveRes = await newPlan.save();

                // Format the response
                let response;
                if (Array.isArray(flightData) && Array.isArray(hotelsData)) {
                    response = {
                        _id: planSaveRes._id,
                        user: req.user._id,
                        destination: lowerDestination,
                        dispatch_city: lowerDispatchCity,
                        budget: lowerBudget,
                        total_people,
                        travel_dates: {
                            start_date: travel_dates.start_date,
                            end_date: travel_dates.end_date,
                        },
                        flights: flightData.map(flight => ({
                            airline: flight.airline,
                            flight_number: flight.flight_number,
                            departure_time: flight.departure_time,
                            arrival_time: flight.arrival_time,
                            price: flight.price,
                            class: flight.class,
                            duration: flight.duration,
                        })),
                        hotels: hotelsData.map(hotel => ({
                            hotel_name: hotel.hotel_name,
                            estimated_cost: hotel.total_cost,
                            price_per_night: hotel.price_per_night,
                            address: hotel.address,
                            rating: hotel.rating,
                            amenities: hotel.amenities,
                            distance_to_city_center:
                                hotel.distance_to_city_center,
                        })),
                    };
                }

                // Save the plan ID into user database
                const adminUser = await User.findById(req.user._id);
                if (adminUser) {
                    adminUser.plans.push(planSaveRes._id as ObjectId);
                    await adminUser.save();
                }

                // Return success response
                return res.status(200).json({
                    status: 'Success',
                    message: 'New Plan Created',
                    data: response,
                });
            }
        });
    } catch (error) {
        if ((error as Error).name === 'ValidationError') {
            return res.status(400).json({
                status: 'Failed',
                message: 'Validation Error: ' + (error as Error).message,
            });
        }
        console.error(error); // Log the error for debugging
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};
