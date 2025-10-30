import express from 'express';
import createHotelsController from '../controller/hotelsController/createHotels.controller';

const route = express.Router();

/**
 * @swagger
 * /api/v1/hotels/create
 * get:
 *      
 */
route.get('/create', createHotelsController);

export default route;
