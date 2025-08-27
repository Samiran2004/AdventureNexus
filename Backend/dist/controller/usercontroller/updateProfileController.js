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
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const fs_1 = __importDefault(require("fs"));
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const checkUser = yield userModel_1.default.findById(req.user._id);
        if (!checkUser)
            return next((0, http_errors_1.default)(404, 'User not found.'));
        const { fullname, gender, preference, country, password } = req.body;
        if (!fullname &&
            !gender &&
            !preference &&
            !country &&
            !password &&
            !((_a = req.file) === null || _a === void 0 ? void 0 : _a.path)) {
            return next((0, http_errors_1.default)(400, 'Please provide at least one field to update.'));
        }
        if (fullname && fullname != checkUser.fullname) {
            checkUser.fullname = fullname;
            try {
                checkUser.username = (yield (0, generateRandomUserName_1.default)(fullname));
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, 'Error generating username.'));
            }
        }
        if (gender)
            checkUser.gender = gender;
        if (preference)
            checkUser.preferences = preference;
        if (country)
            checkUser.country = country;
        if (password) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            checkUser.password = yield bcryptjs_1.default.hash(password, salt);
        }
        let uploadImageUrl;
        if ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) {
            try {
                uploadImageUrl = yield cloudinaryService_1.default.uploader.upload(req.file.path);
                fs_1.default.unlinkSync(req.file.path);
                const previousProfilePictureUrl = checkUser.profilepicture;
                checkUser.profilepicture = uploadImageUrl.url;
                if (previousProfilePictureUrl) {
                    const publicId = (_c = previousProfilePictureUrl
                        .split('/')
                        .pop()) === null || _c === void 0 ? void 0 : _c.split('.')[0];
                    if (publicId) {
                        try {
                            yield cloudinaryService_1.default.uploader.destroy(publicId);
                        }
                        catch (error) {
                            console.error('Error deleting previous profile picture:', error);
                            return next((0, http_errors_1.default)(500, 'Profile picture update failed.'));
                        }
                    }
                }
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, 'Profile picture upload failed.'));
            }
        }
        yield checkUser.save();
        return res.status(200).send({
            status: 'Success',
            message: 'User updated.',
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                profilepicture: checkUser.profilepicture,
                _id: checkUser._id,
            },
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = updateProfile;
