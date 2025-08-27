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
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const userModel_1 = __importDefault(require("../../Database/models/userModel"));
const mailService_1 = __importDefault(require("../../service/mailService"));
const http_errors_1 = __importDefault(require("http-errors"));
const emailTemplate_1 = __importDefault(require("../../utils/emailTemplate"));
const userDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const checkUser = yield userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return next((0, http_errors_1.default)(404, 'Not a valid user.'));
        }
        else {
            const profilePictureUrl = checkUser.profilepicture;
            const publicId = (_a = profilePictureUrl
                .split('/')
                .pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            if (publicId) {
                try {
                    yield cloudinaryService_1.default.uploader.destroy(publicId);
                }
                catch (error) {
                    return next((0, http_errors_1.default)(500, 'Error deleting profile picture from Cloudinary'));
                }
            }
            yield userModel_1.default.findByIdAndDelete(req.user._id);
            const emailData = emailTemplate_1.default.deleteUserEmailData(checkUser.fullname, checkUser.email);
            yield (0, mailService_1.default)(emailData, (error) => {
                if (error) {
                    return next((0, http_errors_1.default)(500, 'User deleted, but email sending failed!'));
                }
                return res.status(200).send({
                    status: 'Success',
                    message: 'User deleted.',
                });
            });
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = userDelete;
