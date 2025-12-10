import chalk from "chalk"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { groqGeneratedData } from "../../service/groq.service";

const searchNewDestination = async (req, res) => {
    try {

        const response = await groqGeneratedData("Give me the destination details for Tokyo for a trip for 2 peoples 3 days with 50k midbudget.");
        return res.status(StatusCodes.OK).json({
            status: 'Ok',
            message: "Generated",
            data: response
        });
    } catch (error) {
        console.log(chalk.bgRed(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default searchNewDestination;