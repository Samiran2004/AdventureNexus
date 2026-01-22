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
exports.deleteSubscriber = exports.getSubscribers = exports.updateSystemSetting = exports.getSystemSettings = void 0;
const http_status_codes_1 = require("http-status-codes");
const settingsModel_1 = __importDefault(require("../../../shared/database/models/settingsModel"));
const subscribeMail_model_1 = __importDefault(require("../../../shared/database/models/subscribeMail.model"));
const auditLogModel_1 = __importDefault(require("../../../shared/database/models/auditLogModel"));
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const getSystemSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield settingsModel_1.default.find();
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: settings });
    }
    catch (error) {
        logger_1.default.error('Error fetching system settings:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getSystemSettings = getSystemSettings;
const updateSystemSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.body;
        const setting = yield settingsModel_1.default.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
        yield auditLogModel_1.default.log({
            action: 'UPDATE_SETTING',
            module: 'SYSTEM_CONTROLS',
            adminId: 'admin',
            targetId: key,
            details: { newValue: value },
            severity: key === 'MAINTENANCE_MODE' && value === true ? 'critical' : 'warning'
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: setting });
    }
    catch (error) {
        logger_1.default.error('Error updating system setting:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.updateSystemSetting = updateSystemSetting;
const getSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield subscribeMail_model_1.default.find().sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', data: subscribers });
    }
    catch (error) {
        logger_1.default.error('Error fetching subscribers:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.getSubscribers = getSubscribers;
const deleteSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield subscribeMail_model_1.default.findByIdAndDelete(req.params.id);
        yield auditLogModel_1.default.log({
            action: 'DELETE_SUBSCRIBER',
            module: 'NEWSLETTER',
            adminId: 'admin',
            targetId: req.params.id,
            severity: 'info'
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'Success', message: 'Subscriber removed' });
    }
    catch (error) {
        logger_1.default.error('Error deleting subscriber:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.deleteSubscriber = deleteSubscriber;
