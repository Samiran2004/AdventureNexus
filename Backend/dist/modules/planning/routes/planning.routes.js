"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchNewDestination_controller_1 = __importDefault(require("../../recommendations/controllers/searchNewDestination.controller"));
const getDestinationImages_controller_1 = __importDefault(require("../../recommendations/controllers/getDestinationImages.controller"));
const getPersonalizedRecommendations_controller_1 = __importDefault(require("../../recommendations/controllers/getPersonalizedRecommendations.controller"));
const getPlanByIdController_1 = require("../controllers/getPlanByIdController");
const cacheMiddleware_1 = require("../../../shared/middleware/cacheMiddleware");
const cache_config_1 = require("../../../shared/config/cache.config");
const route = express_1.default.Router();
route.post("/search/destination", searchNewDestination_controller_1.default);
route.get("/recommendations", (0, cacheMiddleware_1.cacheMiddleware)({ prefix: cache_config_1.CACHE_CONFIG.PREFIX.RECOMMENDATIONS, useUserPrefix: true }), getPersonalizedRecommendations_controller_1.default);
route.post("/search/destination-images", getDestinationImages_controller_1.default);
route.get("/public/:id", (0, cacheMiddleware_1.cacheMiddleware)({ prefix: cache_config_1.CACHE_CONFIG.PREFIX.PLAN }), getPlanByIdController_1.getPlanById);
exports.default = route;
