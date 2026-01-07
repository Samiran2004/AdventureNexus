import chalk from "chalk"
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import createHotels from "../../database/seeds/hotels/createHotels.seed";

/**
 * Controller to trigger the Hotel Seeding process.
 * Calls the 'createHotels' seed script to populate the database.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
const createHotelsController = async (req, res) => {
    try {
        console.log(chalk.blue("Creating Hotels..."));

        // Call Seed Function
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
