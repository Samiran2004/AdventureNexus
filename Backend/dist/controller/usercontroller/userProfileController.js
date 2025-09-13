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
const userModel_1 = __importDefault(require("../../Database/models/userModel"));
const http_errors_1 = __importDefault(require("http-errors"));
function userProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield userModel_1.default.findOne({ clerkUserId: req.user.clerkUserId });
            if (!userData) {
                return next((0, http_errors_1.default)(404, 'User not found!'));
            }
            else {
                return res.status(200).send({
                    status: 'Success',
                    userData: {
                        fullname: userData.fullname,
                        firstname: userData.firstName,
                        lastname: userData.lastName,
                        email: userData.email,
                        phonenumber: userData.phonenumber,
                        username: userData.username,
                        gender: userData.gender,
                        profilepicture: userData.profilepicture,
                        preference: userData.preferences,
                        country: userData.country,
                    },
                });
            }
        }
        catch (error) {
            console.error("Error fetching user profile:", error);
            return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
        }
    });
}
exports.default = userProfile;
