import express from 'express';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import getRecommendationController from '../controller/recomendationController/getRecommendationController';
import getUserRecHistory from '../controller/recomendationController/getUserRecHistory';
import getPopularDestController from '../controller/recomendationController/getPopularDestController';
import getRecBudgetController from '../controller/recomendationController/getRecBudgetController';

const route = express.Router();

// Generate personalized recommendations using Gemini
// Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations', authTokenMiddleware, getRecommendationController);

// View user's past recommendations
// Path: /api/v1/recommendations/recommendation-history
route.get('/recommendation-history', authTokenMiddleware, getUserRecHistory);

// Discover trending travel destinations
// Path: /api/v1/recommendations/popular-destinations
route.get('/popular-destinations', authTokenMiddleware, getPopularDestController);

// Generate all possible recommendations using budget
// Path: /api/v1/recommendation/:budget
route.get('/:budget', authTokenMiddleware, getRecBudgetController);

export default route;
