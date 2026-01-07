import express from 'express';
import createHotelsController from '../controller/hotelsController/createHotels.controller';

const route = express.Router();

route.get('/create', createHotelsController);

export default route;
