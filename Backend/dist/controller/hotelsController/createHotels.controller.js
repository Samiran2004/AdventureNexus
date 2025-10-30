"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const createHotels_seed_1 = __importDefault(require("../../Database/seeds/hotels/createHotels.seed"));
const createHotelsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(chalk_1.default.blue("Creating Hotels..."));
        yield (0, createHotels_seed_1.default)(req, res);
        console.log(chalk_1.default.green("Hotels Created..."));
    }
    catch (error) {
        console.log(chalk_1.default.red(`Internal Server Error in Create Hotels controller...\nError: ${error.message}`));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
});
exports.default = createHotelsController;
