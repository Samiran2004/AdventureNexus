import chalk from "chalk"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { groqGeneratedData } from "../../service/groq.service";
import { Request, Response } from "express";
import generateNewSearchDestinationPrompt, { SearchNewDestinationPromptData } from "../../utils/Gemini Utils/generatePromptForSearchNewDestinations";
import winstonLogger from "../../service/winston.service";

const searchNewDestination = async (req: Request, res: Response) => {
    try {

        const { to, from, date, travelers, budget, budget_range, activities, travel_style } = req.body;

        // <---------Check required fields exist or not------------>
        if (!to || !from || !date || !travelers || !budget) {
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
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        winstonLogger.info(`Success: ${fullUrl}`);
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            message: "Generated",
            data: response
        });
    } catch (error) {
        console.log(chalk.bgRed(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
        console.log(error);

        // <----------Logger for error---------->
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        winstonLogger.error(`Error: ${fullUrl}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default searchNewDestination;