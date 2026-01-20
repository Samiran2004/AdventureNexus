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
exports.getPlanById = void 0;
const planModel_1 = __importDefault(require("../../database/models/planModel"));
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = __importDefault(require("../../utils/logger"));
const getPlanById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const redisKey = `${id}`;
        client_1.default.get(redisKey, (err, cacheData) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }
            try {
                const plan = yield planModel_1.default.findById(id);
                if (plan) {
                    client_1.default.setex(redisKey, 60, JSON.stringify(plan));
                    return res.status(200).json({
                        status: 'Success',
                        data: plan,
                    });
                }
                return next((0, http_errors_1.default)(404, 'Plan Not Found or The id is Invalid.'));
            }
            catch (_a) {
                return next((0, http_errors_1.default)(400, 'Plan Not Found or The ID is Invalid.'));
            }
        }));
    }
    catch (_a) {
        logger_1.default.error(`Error in getPlanByIdController: ${error}`);
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.getPlanById = getPlanById;
