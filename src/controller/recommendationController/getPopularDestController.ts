import { NextFunction, Request, Response } from 'express';
import generatePromptForPopularDest from '../../utils/Gemini Utils/generatePromptForPopularDest';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import createHttpError from 'http-errors';

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        country: string;
        currency: string;
    }
}

interface DestinationPromptData {
    country: string;
    currency: string;
}

export const getPopularDestinations = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { country, currency } = req.user; // Extracting country and currency from the authenticated user's information

        if (!country || !currency) {
            return next(createHttpError(400, "Country or Currency information is missing from user data!"));
        }

        // Create a valid object for the prompt function
        const promptData: DestinationPromptData = { country, currency };

        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt: string = generatePromptForPopularDest(promptData);
        const generatePopularDest = await generateRecommendation(prompt);
        if (typeof generatePopularDest !== 'string') {
            return next(createHttpError(500, "Internal Server Error!"));
        }

        let destinations;
        try {
            const result: string = generatePopularDest.replace(/```json|```/g, "").trim();
            destinations = JSON.parse(result);
        } catch (parseError) {
            // console.error('Error parsing AI response:', parseError);  //Log for Debugging
            return next(createHttpError(500, "Error parsing popular destinations response."))
        }

        // Return successful response with popular destinations
        return res.status(200).json({
            status: 'Success',
            data: destinations
        });
    } catch (error) {
        // console.error(error); // Log the error for debugging
        return next(createHttpError(500, "Internal Server Error!"));
    }
};