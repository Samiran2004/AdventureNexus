"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userProfileController_1 = __importDefault(require("../controllers/usercontrollers/userProfileController"));
const authClerkTokenMiddleware_1 = require("../middlewares/authClerkTokenMiddleware");
const route = express_1.default.Router();
route.get('/profile', authClerkTokenMiddleware_1.protect, (req, res, next) => {
    (0, userProfileController_1.default)(req, res, next);
});
exports.default = route;
