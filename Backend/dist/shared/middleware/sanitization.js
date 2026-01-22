"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_html_1 = __importDefault(require("escape-html"));
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = (0, escape_html_1.default)(obj[key]);
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    if (req.body)
        sanitize(req.body);
    if (req.query)
        sanitize(req.query);
    if (req.params)
        sanitize(req.params);
    next();
};
exports.default = sanitizeInput;
