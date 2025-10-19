import chalk from "chalk";
import { Response } from "express"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { generateHotelSearchPrompt } from "../../../utils/Gemini Utils/createHotelsPrompt";
import generateRecommendation from "../../../utils/Gemini Utils/generateRecommendation";
import { generateHotelImage } from "../../../utils/Gemini Utils/generateHotelsImagePrompt";

const createHotels = async (req, res: Response) => {
    try {
        console.log("Create Hotels seed...");

        // Fetch request body...
        const {
            destination,
            duration,
            budget,
            currency_code
        } = req.body;

        if (!destination || !duration || !budget || !currency_code) {
            console.log(chalk.red("All fields are required..."));
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.BAD_REQUEST)
            });
        }

        // Create payload...
        const dataPayload = {
            destination,
            duration,
            budget,
            currency_code
        }

        // Generate Prompt...
        let prompt = await generateHotelSearchPrompt(dataPayload);
        // console.log(chalk.bgGreen(prompt));

        // Generate Data...
        const generatedData = await generateRecommendation(prompt);

        const data = JSON.parse(generatedData.replace(/```json|```/g, '').trim());

        // Create payload for generating hotel's image..
        const imagePayload = {
            hotelName: data[0].hotel_name,
            location: data[0].location_description
        }

        // Generate prompt for hotel's image...
        prompt = await generateHotelImage(imagePayload);

        const hotelImageData = await generateRecommendation(prompt);
        const imageData = JSON.parse(hotelImageData.replace(/```json|```/g, '').trim());

        for (const d of data) {
            d.image = imageData
        }

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
