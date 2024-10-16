"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanById = void 0;
const planModel_1 = __importDefault(require("../../models/planModel"));
const client_1 = __importDefault(require("../../redis/client"));
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        // Define Redis key
        const redisKey = `${id}`;
        // Check Redis cache
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                return res.status(500).json({
                    status: 'Failed',
                    message: "Internal Redis Error."
                });
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData)
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
                        data: plan
                    });
                }
                return res.status(404).json({
                    status: 'Failed',
                    message: "Plan Not Found or The ID is Invalid."
                });
            }
            catch (error) {
                return res.status(400).json({
                    status: 'Failed',
                    message: "Plan Not Found or The ID is Invalid."
                });
            }
        });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
};
exports.getPlanById = getPlanById;
