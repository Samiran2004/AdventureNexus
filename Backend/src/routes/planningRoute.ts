import express from 'express';
import searchNewDestination from '../controller/recommendationController/searchNewDestination.controller';
import protect from '../middlewares/authClerkTokenMiddleware';

const route = express.Router();

// route.post("/search/destination", protect, searchNewDestination);
/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Travel plan generation and management
 */

route.post("/search/destination", searchNewDestination);

export default route;
