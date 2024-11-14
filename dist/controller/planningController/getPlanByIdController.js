"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanById = void 0;
const planModel_1 = __importDefault(require("../../models/planModel"));
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const getPlanById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Define Redis key
        const redisKey = `${id}`;
        // Check Redis cache
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }
            // Find the plan in the database
            try {
                const plan = await planModel_1.default.findById(id);
                if (plan) {
                    // Cache the plan data in Redis
                    client_1.default.setex(redisKey, 60, JSON.stringify(plan));
                    return res.status(200).json({
                        status: 'Success',
                        data: plan,
                    });
                }
                return next((0, http_errors_1.default)(404, 'Plan Not Found or The id is Invalid.'));
            }
            catch (error) {
                return next((0, http_errors_1.default)(400, 'Plan Not Found or The ID is Invalid.'));
            }
        });
    }
    catch (error) {
        // console.error(`Error in getPlanByIdController: ${error}`); // Log the error for debugging
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.getPlanById = getPlanById;
