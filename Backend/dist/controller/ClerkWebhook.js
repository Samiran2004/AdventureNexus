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
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../Database/models/userModel"));
const svix_1 = require("svix");
const cleckWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const whook = new svix_1.Webhook(process.env.CLERK_WEBHOOK_KEY);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        yield whook.verify(JSON.stringify(req.body), headers);
        const { data, type } = req.body;
        const userData = {
            _id: data.id,
            email: ((_b = (_a = data.email_addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.email_address) || null,
            username: data.username || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            imageUrl: data.image_url || null,
        };
        switch (type) {
            case "user.created": {
                yield userModel_1.default.create(userData);
                break;
            }
            case "user.updated": {
                yield userModel_1.default.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                yield userModel_1.default.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Webhook Recieved"
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});
exports.default = cleckWebhook;
