"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeReview = exports.createReview = exports.getAllReviews = void 0;
const reviewModel_1 = __importDefault(require("../database/models/reviewModel"));
const http_status_codes_1 = require("http-status-codes");
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, rating, search, sortBy } = req.query;
        let query = {};
        if (category && category !== 'all') {
            query.tripType = category;
        }
        if (rating && rating !== 'all') {
            query.rating = { $gte: Number(rating) };
        }
        if (search) {
            query.$or = [
                { comment: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } }
            ];
        }
        let sortOption = { createdAt: -1 };
        if (sortBy === 'oldest') {
            sortOption = { createdAt: 1 };
        }
        else if (sortBy === 'highest') {
            sortOption = { rating: -1 };
        }
        else if (sortBy === 'helpful') {
            sortOption = { helpfulCount: -1 };
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const reviews = yield reviewModel_1.default.find(query).sort(sortOption).skip(skip).limit(limit);
        const total = yield reviewModel_1.default.countDocuments(query);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: reviews
        });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
});
exports.getAllReviews = getAllReviews;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received Review Data:", req.body);
        const { userName, userAvatar, location, tripType, tripDuration, travelers, rating, comment, images } = req.body;
        const review = yield reviewModel_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, data: review });
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid data', error });
    }
});
exports.createReview = createReview;
const likeReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const review = yield reviewModel_1.default.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true });
        if (!review) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ success: false, message: 'Review not found' });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: review });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server Error' });
    }
});
exports.likeReview = likeReview;
