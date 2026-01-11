import chalk from "chalk";
import { Response } from "express"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { generateHotelSearchPrompt } from "../../../utils/gemini/createHotelsPrompt";
import { groqGeneratedData } from "../../../services/groq.service";
import { generateHotelImage } from "../../../utils/gemini/generateHotelsImagePrompt";

/**
 * Seed Function to generate and return Hotel Recommendations.
 * Uses AI to search for hotels and generate hotel images based on criteria.
 * Note: This 'seed' seems to behave more like a services/controller function returning data, rather than seeding DB directly?
 */
const createHotels = async (req, res: Response) => {
    try {
        console.log("Create Hotels seed...");

        // 1. Fetch request body parameters
        const {
            destination,
            duration,
            budget,
            currency_code
        } = req.body;

        // 2. Validate Required Fields
        if (!destination || !duration || !budget || !currency_code) {
            console.log(chalk.red("All fields are required..."));
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.BAD_REQUEST)
            });
        }

        // 3. Prepare Payload for AI Prompt
        const dataPayload = {
            destination,
            duration,
            budget,
            currency_code
        }

        // 4. Generate AI Prompt for Hotel Search
        let prompt = await generateHotelSearchPrompt(dataPayload);
        // console.log(chalk.bgGreen(prompt));

        // 5. Call AI Service to get Hotel Data
        const generatedData = await groqGeneratedData(prompt);

        // 6. Clean and Parse AI Response
        const data = JSON.parse(generatedData.replace(/```json|```/g, '').trim());

        // 7. Prepare Payload for Hotel Image Generation (for the first hotel?)
        const imagePayload = {
            hotelName: data[0].hotel_name,
            location: data[0].location_description
        }

        // 8. Generate AI Prompt for Hotel Image
        prompt = await generateHotelImage(imagePayload);

        // 9. Call AI Service to get Image Data
        const hotelImageData = await groqGeneratedData(prompt);
        const imageData = JSON.parse(hotelImageData.replace(/```json|```/g, '').trim());

        // 10. Assign Image to All Hotels (Currently assigning same image to all?)
        for (const d of data) {
            d.image = imageData
        }

        // 11. Return Generated Data
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            data: data
        });


    } catch (error) {
        console.log(chalk.red(`Internal Server Error for create hotels...\nError:${error.message}`));
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
export default createHotels;
