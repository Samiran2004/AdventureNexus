import express from 'express';
import searchNewDestination from '../../recommendations/controllers/searchNewDestination.controller';
import getDestinationImages from '../../recommendations/controllers/getDestinationImages.controller';
import getPersonalizedRecommendations from '../../recommendations/controllers/getPersonalizedRecommendations.controller';
import { getPlanById } from '../controllers/getPlanByIdController';
import { savePlanToUser } from '../controllers/savePlanToUserController';
import protect from '../../../shared/middleware/authClerkTokenMiddleware';
import { cacheMiddleware } from '../../../shared/middleware/cacheMiddleware';
import { CACHE_CONFIG } from '../../../shared/config/cache.config';

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
 * @route POST /api/v1/plans/:planId/save
 * @desc Save an AI-generated plan to a user's personal list.
 */
route.post("/:planId/save", protect, savePlanToUser);

/**
 * @route GET /api/v1/plans/public/:id
 * @desc Fetch a plan by ID publicly (for shared links).
 */
route.get("/public/:id", cacheMiddleware({ prefix: CACHE_CONFIG.PREFIX.PLAN }), getPlanById);

export default route;
