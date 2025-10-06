import chalk from "chalk";
import { Response } from "express"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { generateHotelSearchPrompt } from "../../../utils/Gemini Utils/createHotelsPrompt";
import generateRecommendation from "../../../utils/Gemini Utils/generateRecommendation";

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
        const prompt = await generateHotelSearchPrompt(dataPayload);
        // console.log(chalk.bgGreen(prompt));

        // Generate Data...
        const generatedData = await generateRecommendation(prompt);

        const data = JSON.parse(generatedData.replace(/```json|```/g, '').trim());

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
