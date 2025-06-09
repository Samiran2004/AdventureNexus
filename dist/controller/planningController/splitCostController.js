"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../../config/config");
const planModel_1 = __importDefault(require("../../Database/models/planModel"));
let names = [];
let emails = [];
let roles = [];
function dataFormat(req, res, next) {
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
const splitCost = async (req, res, next) => {
    try {
        const planId = req.params.id;
        //Search the Plan in databse...
        const plan = await planModel_1.default.findById(planId);
        dataFormat(req, res, next);
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
            console.log(err);
        }
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = splitCost;
