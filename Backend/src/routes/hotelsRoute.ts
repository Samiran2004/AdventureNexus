import express from 'express';
import createHotelsController from '../controller/hotelsController/createHotels.controller';

const route = express.Router();

/**
 * @route GET /api/v1/hotels/create
 * @desc Seed/Create initial hotel data in the database.
 * @access Public (Should be protected in production)
 */
route.get('/create', createHotelsController);

export default route;
