"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const splitCost = async (req, res, next) => {
    try {
        const { planId, totalExpense, currency } = req.body;
        console.log(req.body);
        return res.status(200).send({
            status: 'success',
            data: req.body,
        });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = splitCost;
