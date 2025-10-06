import chalk from "chalk";
import { Response } from "express"
import { getReasonPhrase, StatusCodes } from "http-status-codes"

const createHotels = async (req, res: Response) => {
    try {
        console.log("Create Hotels seed...");
    } catch (error) {
        console.log(chalk.red(`Internal Server Error for create hotels...\nError:${error.message}`));
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}
export default createHotels;
