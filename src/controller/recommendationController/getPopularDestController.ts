import {json, NextFunction, Request, Response} from 'express';
import generatePromptForPopularDest from '../../utils/Gemini Utils/generatePromptForPopularDest';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import createHttpError from 'http-errors';
import redis from "../../redis/client";

export interface CustomRequestGetPopularDest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        country: string;
        currency_code: string;
    }
}

interface DestinationPromptData {
    country: string;
    currency_code: string;
}

export const getPopularDestinations = async (
    req: CustomRequestGetPopularDest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { country, currency_code } = req.user;
        if (!country || !currency_code) {
            return next(createHttpError(400, "Country or Currency information is missing from user data!"));
        }

        const redisKey: string = `${country}:${currency_code}`;

        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                return next(createHttpError(500, "Internal Redis Server Error!"));
            }

            let generatePopularDest: string;
            if (cacheData) {
                generatePopularDest = JSON.parse(cacheData);
            } else {
                const promptData: DestinationPromptData = { country, currency_code };
                const prompt: string = generatePromptForPopularDest(promptData);

                try {
                    generatePopularDest = await generateRecommendation(prompt) as string;

                    await redis.set(redisKey, JSON.stringify(generatePopularDest), 'EX', 86400); // Cache with expiry
                } catch (error) {
                    return next(createHttpError(500, "Error generating recommendation data."));
                }
            }

            // Clean and parse the response
            try {
                const result: string = generatePopularDest.replace(/```json|```/g, "")
                    .replace(/\n/g, "")
                    .trim();

                // Return successful response with popular destinations
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.stringify(result)
                });
            } catch (parseError) {
                console.error("Parsing error:", parseError); // Log the exact error
                // console.error("Response data received:", generatePopularDest); // Log the raw data
                return next(createHttpError(500, "Error parsing popular destinations response."));
            }
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return next(createHttpError(500, "Internal Server Error!"));
    }
};