import express, {Router} from 'express';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import generateRecommendations, {
    CustomRequestRecommendationController, RequestBody
} from "../controller/recommendationController/getRecommendationController";
import getUserRecommendationHistory from "../controller/recommendationController/getUserRecHistory";
import {
    CustomRequestGetPopularDest,
    getPopularDestinations
} from "../controller/recommendationController/getPopularDestController";
import {
    CustomRequestGetRecBudget,
    RequestParamsGetRecBudget,
    getBudgetRecommendations
} from "../controller/recommendationController/getRecBudgetController";

const route: Router = express.Router();

// Generate personalized recommendations using Gemini
// Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations', authTokenMiddleware, (req, res, next)=>{
    generateRecommendations(req as CustomRequestRecommendationController<{}, {}, RequestBody>, res, next);
});

// View user's past recommendations
// Path: /api/v1/recommendations/recommendation-history
route.get('/recommendation-history', authTokenMiddleware, (req, res, next)=>{
    getUserRecommendationHistory(req as CustomRequestRecommendationController<{}, {}, {}>, res, next);
});

// Discover trending travel destinations
// Path: /api/v1/recommendations/popular-destinations
route.get('/popular-destinations', authTokenMiddleware, (req, res, next)=>{
    getPopularDestinations(req as CustomRequestGetPopularDest<{}, {}, {}>, res, next);
});

// Generate all possible recommendations using budget
// Path: /api/v1/recommendation/:budget
route.get('/:budget', authTokenMiddleware, (req, res, next) => {
    getBudgetRecommendations(req as unknown as CustomRequestGetRecBudget<{ budget: number }>, res, next);
});


export default route;
