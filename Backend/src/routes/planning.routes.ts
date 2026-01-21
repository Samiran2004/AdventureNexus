import express from 'express';
import searchNewDestination from '../controllers/recommendationController/searchNewDestination.controller';
import getDestinationImages from '../controllers/recommendationController/getDestinationImages.controller';
import getPersonalizedRecommendations from '../controllers/recommendationController/getPersonalizedRecommendations.controller';
import { getPlanById } from '../controllers/planningController/getPlanByIdController';
import protect from '../middlewares/authClerkTokenMiddleware';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';
import { CACHE_CONFIG } from '../config/cache.config';

const route = express.Router();

/**
 * @route POST /api/v1/plans/search/destination
 * @desc Generate travel plan recommendations based on user input.
 * @access Public (Currently not using 'protect' middleware in line 15, but logic inside controller might check auth)
 */
route.post("/search/destination", searchNewDestination);

/**
 * @route GET /api/v1/plans/recommendations
 * @desc Get personalized travel recommendations based on user history
 */
route.get("/recommendations", cacheMiddleware({ prefix: CACHE_CONFIG.PREFIX.RECOMMENDATIONS, useUserPrefix: true }), getPersonalizedRecommendations);

/**
 * @route POST /api/v1/plans/search/destination-images
 * @desc Fetch a batch of images for a destination from Unsplash.
 */
route.post("/search/destination-images", getDestinationImages);

/**
 * @route GET /api/v1/plans/public/:id
 * @desc Fetch a plan by ID publicly (for shared links).
 */
route.get("/public/:id", cacheMiddleware({ prefix: CACHE_CONFIG.PREFIX.PLAN }), getPlanById);

export default route;
