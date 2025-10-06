import chalk from "chalk"
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import createHotels from "../../Database/seeds/hotels/createHotels.seed";

const createHotelsController = async (req, res) => {
    try {
        console.log(chalk.blue("Creating Hotels..."));

        await createHotels(req, res);

        console.log(chalk.green("Hotels Created..."));
    } catch (error) {
        console.log(chalk.red(`Internal Server Error in Create Hotels controller...\nError: ${error.message}`));
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default createHotelsController;
