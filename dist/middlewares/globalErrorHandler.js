"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
// Global error handler
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'Failed',
        message: err.message,
        errorStack: config_1.config.env === 'development' ? err.stack : '',
    });
};
exports.default = errorHandler;
