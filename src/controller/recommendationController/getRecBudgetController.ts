import { NextFunction, Request, Response } from 'express';
import generatePromptForBudget from '../../utils/Gemini Utils/generatePromptForBudget';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import redis from '../../redis/client';
import createHttpError from 'http-errors';

export interface CustomRequestGetRecBudget<
  TParams = { budget: number },
  ResBody = any,
  ReqBody = any,
> extends Request<TParams, ResBody, ReqBody> {
  user: {
    _id: string;
    currency_code: string;
    country: string;
  };
}

export interface RequestParamsGetRecBudget {
  budget: number | string;
}
interface promptData {
  country: string;
  budget: number;
}

export const getBudgetRecommendations = async (
  req: CustomRequestGetRecBudget<
    {
      budget: number;
    },
    {},
    {}
  >,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Fetch budget from req.params
    let budget: number = req.params.budget as number;
    if (!budget) {
      return next(createHttpError(400, 'Budget is required!'));
    }

    // If the budget is a string type, convert it into an integer

    if (isNaN(budget)) {
      return next(createHttpError(400, 'Invalid budget format!'));
    }

    // Redis Key
    const redisKey = `${budget}:${req.user.country as string}`;

    // Check if recommendation exists in Redis
    redis.get(redisKey, async (err, cacheData) => {
      if (err) {
        // console.error('Redis error:', err); //Log for Debugging
        return next(createHttpError(500, 'Internal Redis Server Error!'));
      }

      if (cacheData) {
        // If recommendation is cached, return it
        return res.status(200).json({
          status: 'Success',
          data: JSON.parse(cacheData),
        });
      } else {
        // Generate a prompt
        const data: promptData = {
          budget: budget,
          country: req.user.country,
        };
        const prompt: string = generatePromptForBudget(data);

        // Generate recommendations
        const recommendations: string = (await generateRecommendation(
          prompt
        )) as string;

        const result: string = recommendations
          .replace(/```json|```/g, '')
          .trim();

        // Save the new recommendation in Redis (For 5 min)
        await redis.setex(redisKey, 300, JSON.stringify(result));

        // Return the response
        return res.status(200).json({
          status: 'Success',
          recommendations: JSON.parse(result),
        });
      }
    });
  } catch (error) {
    // console.error('Internal Server Error:', error); // Log the error for debugging
    return next(createHttpError(500, 'Internal Server Error!'));
  }
};
