"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFullURL = (req) => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};
exports.default = getFullURL;
