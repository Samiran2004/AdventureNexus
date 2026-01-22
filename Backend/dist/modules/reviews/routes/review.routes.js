"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const cacheMiddleware_1 = require("../../../shared/middleware/cacheMiddleware");
const cache_config_1 = require("../../../shared/config/cache.config");
const router = express_1.default.Router();
router.get('/', (0, cacheMiddleware_1.cacheMiddleware)({ prefix: cache_config_1.CACHE_CONFIG.PREFIX.REVIEWS }), reviewController_1.getAllReviews);
router.post('/', reviewController_1.createReview);
router.put('/:id/like', reviewController_1.likeReview);
exports.default = router;
