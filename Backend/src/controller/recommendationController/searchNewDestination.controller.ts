import chalk from "chalk"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { groqGeneratedData } from "../../service/groq.service";
import { Request, Response } from "express";
import generateNewSearchDestinationPrompt, { SearchNewDestinationPromptData } from "../../utils/Gemini Utils/generatePromptForSearchNewDestinations";
import winstonLogger from "../../service/winston.service";
import getFullURL from "../../service/getFullURL.service";

const searchNewDestination = async (req: Request, res: Response) => {
    const fullUrl = getFullURL(req);
    try {

        const { to, from, date, travelers, budget, budget_range, activities, travel_style } = req.body;

        // <---------Check required fields exist or not------------>
        if (!to || !from || !date || !travelers || !budget) {
            winstonLogger.error(`URL: ${fullUrl}`);
            winstonLogger.error(`Required fields are not exist.`);
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "Provide all required fields!"
            });
        }

        // <-----Generate prompt using user's data----->
        const promptData: SearchNewDestinationPromptData = {
            to,
            from,
            date,
            travelers,
            budget,
            budget_range,
            activities,
            travel_style
        }
        const prompt = generateNewSearchDestinationPrompt(promptData);

        const generatedData = await groqGeneratedData(prompt);
        const startIndex = generatedData.indexOf('{');
        const endIndex = generatedData.lastIndexOf('}');
        const cleanString = generatedData.substring(startIndex, endIndex + 1);
        const response = JSON.parse(cleanString);

        // <----------Logger for success---------->
        winstonLogger.info(`URL: ${fullUrl}`);
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            message: "Generated",
            data: response
        });
    } catch (error) {
        console.log(chalk.bgRed(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
        console.log(error);

        // <----------Logger for error---------->
        winstonLogger.error(`URL: ${fullUrl}, error_message: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default searchNewDestination;