"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchNewDestination_controller_1 = __importDefault(require("../controllers/recommendationController/searchNewDestination.controller"));
const getDestinationImages_controller_1 = __importDefault(require("../controllers/recommendationController/getDestinationImages.controller"));
const getPersonalizedRecommendations_controller_1 = __importDefault(require("../controllers/recommendationController/getPersonalizedRecommendations.controller"));
const route = express_1.default.Router();
route.post("/search/destination", searchNewDestination_controller_1.default);
route.get("/recommendations", getPersonalizedRecommendations_controller_1.default);
route.post("/search/destination-images", getDestinationImages_controller_1.default);
exports.default = route;
