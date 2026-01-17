import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { fetchUnsplashImages } from "../../services/unsplash.service";
import winstonLogger from "../../services/winston.service";

const getDestinationImages = async (req: Request, res: Response) => {
    try {
        const { query, count } = req.body;

        if (!query) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Query parameter is required",
            });
        }

        const images = await fetchUnsplashImages(query, count || 12);

        return res.status(StatusCodes.OK).json({
            status: "Ok",
            data: images,
        });
    } catch (error: any) {
        winstonLogger.error(`Error fetching destination images: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Internal Server Error",
        });
    }
};

export default getDestinationImages;
