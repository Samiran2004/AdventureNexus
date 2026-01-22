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
exports.checkMaintenance = void 0;
const http_status_codes_1 = require("http-status-codes");
const settingsModel_1 = __importDefault(require("../database/models/settingsModel"));
const checkMaintenance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.path.startsWith('/api/v1/admin')) {
            return next();
        }
        const maintenanceSetting = yield settingsModel_1.default.findOne({ key: 'MAINTENANCE_MODE' });
        if (maintenanceSetting && maintenanceSetting.value === true) {
            return res.status(http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({
                status: 'Maintenance',
                message: 'AdventureNexus is currently undergoing scheduled maintenance. Please check back later.',
                retryAfter: 3600
            });
        }
        next();
    }
    catch (error) {
        next();
    }
});
exports.checkMaintenance = checkMaintenance;
