"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchNewDestination_controller_1 = __importDefault(require("../controller/recommendationController/searchNewDestination.controller"));
const route = express_1.default.Router();
route.post("/search/destination", searchNewDestination_controller_1.default);
exports.default = route;
