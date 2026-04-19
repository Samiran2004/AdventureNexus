import { getReasonPhrase, StatusCodes } from "http-status-codes";
import createHotels from "../../../shared/database/seeds/hotels/createHotels.seed";
import logger from "../../../shared/utils/logger";

/**
 * Controller to trigger the Hotel Seeding process.
 * Calls the 'createHotels' seed script to populate the database.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
const createHotelsController = async (req, res) => {
    try {
        logger.info("Creating Hotels...");

        // Call Seed Function
        await createHotels(req, res);

        logger.info("Hotels Created...");
    } catch (error) {
        logger.error(`Internal Server Error in Create Hotels controller...\nError: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default createHotelsController;
