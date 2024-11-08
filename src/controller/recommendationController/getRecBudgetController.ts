import { NextFunction, Request, Response } from 'express';
import generatePromptForBudget from '../../utils/Gemini Utils/generatePromptForBudget';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import redis from '../../redis/client';
import createHttpError from 'http-errors';

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TQuery, TBody> {
    user: {
        country: string
    }
}
interface RequestParams {
    budget: number | string;
}
interface promptData {
    country: string;
    budget: number;
}

export const getBudgetRecommendations = async (req: CustomRequest<RequestParams>, res: Response, next: NextFunction) => {
    try {
        // Fetch budget from req.params
        let { budget } = req.params;
        if (!budget) {
            return next(createHttpError(400, "Budget is required!"));
        }

        // If the budget is a string type, convert it into an integer
        if (typeof budget === 'string') {
            budget = parseInt(budget);
        }

        if (isNaN(budget)) {
            return next(createHttpError(400, "Invalid budget format!"));
        }

        // Redis Key
        const redisKey = `${budget}:${req.user.country}`;

        // Check if recommendation exists in Redis
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                // console.error('Redis error:', err); //Log for Debugging
                return next(createHttpError(500, "Internal Redis Server Error!"));
            }

            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData)
                });
            } else {
                // Generate a prompt
                const data: promptData = {
                    budget: budget,
                    country: req.user.country
                };
                const prompt = generatePromptForBudget(data);

                // Generate recommendations
                const recommendations = await generateRecommendation(prompt);
                if (typeof recommendations != 'string') {
                    // console.error('Error: recommendations is not a valid string.'); // Log for Debugging
                    return next(createHttpError(500, "Invalid response from recommendation service!"));
                }
                const result = recommendations.replace(/```json|```/g, "").trim();

                // Save the new recommendation in Redis (For 5 min)
                redis.setex(redisKey, 300, JSON.stringify(result));

                // Return the response
                return res.status(200).json({
                    status: 'Success',
                    recommendations: JSON.parse(result)
                });
            }
        });
    } catch (error) {
        console.error('Internal Server Error:', error); // Log the error for debugging
        return next(createHttpError(500, "Internal Server Error!"));
    }
};
