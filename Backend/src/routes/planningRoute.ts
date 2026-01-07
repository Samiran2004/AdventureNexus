import express from 'express';
import searchNewDestination from '../controller/recommendationController/searchNewDestination.controller';
import protect from '../middlewares/authClerkTokenMiddleware';

const route = express.Router();

/**
 * @route POST /api/v1/plans/search/destination
 * @desc Generate travel plan recommendations based on user input.
 * @access Public (Currently not using 'protect' middleware in line 15, but logic inside controller might check auth)
 */
route.post("/search/destination", searchNewDestination);

export default route;
