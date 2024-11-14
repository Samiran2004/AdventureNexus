"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlan = void 0;
const planModel_1 = __importDefault(require("../../models/planModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const flightPlanPrompt_1 = __importDefault(require("../../utils/Gemini Utils/flightPlanPrompt"));
const hotelPlanPrompt_1 = __importDefault(require("../../utils/Gemini Utils/hotelPlanPrompt"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const createPlan = async (req, res, next) => {
    try {
        const { destination, dispatch_city, travel_dates, budget, total_people } = req.body;
        // Check if all required fields are present
        if (!destination ||
            !dispatch_city ||
            !travel_dates ||
            !budget ||
            !total_people) {
            return next((0, http_errors_1.default)(400, 'All fields are required!'));
        }
        const lowerDestination = destination.toLowerCase();
        const lowerDispatchCity = dispatch_city.toLowerCase();
        const lowerBudget = budget.toLowerCase();
        // Check plan in Redis
        const redisKey = `${req.user._id}:${lowerDestination}:${lowerDispatchCity}:${total_people}:${lowerBudget}`;
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                // console.log("Internal Redis Error...");  //For Debugging
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    message: 'Plan Already Created',
                    data: JSON.parse(cacheData),
                });
            }
            else {
                // Check plan in plan database
                const checkPlan = await planModel_1.default.findOne({
                    destination: lowerDestination,
                    dispatch_city: lowerDispatchCity,
                    total_people,
                    user: req.user._id,
                });
                // Return the existing plan and save it into cache
                if (checkPlan) {
                    await client_1.default.setex(redisKey, 120, JSON.stringify(checkPlan));
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
                const flightPrompt = (0, flightPlanPrompt_1.default)(flightPayload);
                const generateFlightData = (await (0, generateRecommendation_1.default)(flightPrompt));
                let flightData;
                flightData = JSON.parse(generateFlightData.replace(/```json|```/g, '').trim());
                // Generate Hotels Data
                const hotelPayload = {
                    destination: lowerDestination,
                    checkInDate: travel_dates.start_date,
                    checkOutDate: travel_dates.end_date,
                    total_people,
                    type: lowerBudget,
                    currency_code: req.user.currency_code,
                };
                const hotelPrompt = (0, hotelPlanPrompt_1.default)(hotelPayload);
                const generateHotelData = (await (0, generateRecommendation_1.default)(hotelPrompt));
                var hotelsData = JSON.parse(generateHotelData.replace(/```json|```/g, '').trim());
                // Save the plan in the database
                const newPlan = new planModel_1.default({
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
                            distance_to_city_center: hotel.distance_to_city_center,
                        })),
                    };
                }
                // Save the plan ID into user database
                const adminUser = await userModel_1.default.findById(req.user._id);
                if (adminUser) {
                    adminUser.plans.push(planSaveRes._id);
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
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'Failed',
                message: 'Validation Error: ' + error.message,
            });
        }
        console.error(error); // Log the error for debugging
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.createPlan = createPlan;
