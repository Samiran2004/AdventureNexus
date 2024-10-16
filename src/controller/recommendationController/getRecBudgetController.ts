import { Request, Response } from 'express';
import generatePromptForBudget from '../../utils/Gemini Utils/generatePromptForBudget';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import redis from '../../redis/client';

export const getBudgetRecommendations = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch budget from req.params
        let { budget } = req.params;
        if (!budget) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Budget is required'
            });
        }

        // If the budget is a string type, convert it into an integer
        if (typeof budget === 'string') {
            budget = parseInt(budget);
        }

        // Redis Key
        const redisKey = `${budget}:${req.user.country}`;

        // Check if recommendation exists in Redis
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                console.error('Redis error:', err);
                return res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Redis error'
                });
            }

            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData)
                });
            } else {
                // Generate a prompt
                const data = {
                    budget: budget,
                    country: req.user.country
                };
                const prompt = generatePromptForBudget(data);

                // Generate recommendations
                const recommendations = await generateRecommendation(prompt);
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
        return res.status(500).json({
            status: 'Failed',
            message: 'Internal Server Error.'
        });
    }
};
