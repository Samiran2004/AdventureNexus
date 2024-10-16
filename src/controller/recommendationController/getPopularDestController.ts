import { Request, Response } from 'express';
import generatePromptForPopularDest from '../../utils/Gemini Utils/generatePromptForPopularDest';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';

export const getPopularDestinations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const country = req.user.country; // Extracting country from the authenticated user's information

        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt = generatePromptForPopularDest(country);
        const generatePopularDest = await generateRecommendation(prompt);

        // Clean and parse the received data
        const result = generatePopularDest.replace(/```json|```/g, "").trim();
        const destinations = JSON.parse(result);

        // Return successful response with popular destinations
        return res.status(200).json({
            status: 'Success',
            data: destinations
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            status: 'Failed',
            message: 'Internal Server Error.'
        });
    }
};