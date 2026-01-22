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
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../../../shared/config/config");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const names = [];
const emails = [];
const roles = [];
function dataFormat(req) {
    if (typeof req.params.planId !== 'string') {
        req.params.planId = req.body.planId.toString();
    }
    if (typeof req.body.totalExpense !== 'number') {
        req.body.totalExpense = parseInt(req.body.totalExpense);
    }
    if (typeof req.body.currency !== 'string') {
        req.body.currency = req.body.currency.toString();
    }
    req.body.participants.forEach((participant, index) => {
        names[index] = participant.name;
        emails[index] = participant.email;
        roles[index] = participant.role;
    });
}
const splitCost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        dataFormat(req);
        return res.status(200).send({
            status: 'success',
            data: req.body,
            names,
            emails,
            roles,
        });
    }
    catch (err) {
        if (config_1.config.env == 'development') {
            logger_1.default.error('Error in split cost:', err);
        }
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = splitCost;
