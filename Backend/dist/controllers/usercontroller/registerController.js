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
const userModel_1 = __importDefault(require("../../database/models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const currency_codes_1 = __importDefault(require("currency-codes"));
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const cloudinaryService_1 = __importDefault(require("../../services/cloudinaryService"));
const mailService_1 = __importDefault(require("../../services/mailService"));
const fs_1 = __importDefault(require("fs"));
const email_templates_1 = __importDefault(require("../../utils/email-templates"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_errors_1 = __importDefault(require("http-errors"));
const joiValidation_1 = require("../../utils/validators/joiValidation");
dotenv_1.default.config();
const create_new_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, phonenumber, gender, preference, country, } = req.body;
    try {
        if (!fullname ||
            !email ||
            !password ||
            !phonenumber ||
            !gender ||
            !country) {
            return next((0, http_errors_1.default)(400, 'All fields are required!'));
        }
        const { error } = joiValidation_1.userSchemaValidation.validate(req.body);
        if (error) {
            return next((0, http_errors_1.default)(400, error === null || error === void 0 ? void 0 : error.details[0].message));
        }
        const checkUserExist = yield userModel_1.default.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }],
        });
        if (checkUserExist) {
            return next((0, http_errors_1.default)(409, 'User already exist!'));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const username = yield (0, generateRandomUserName_1.default)(fullname);
        let uploadImageUrl;
        try {
            uploadImageUrl = yield cloudinaryService_1.default.uploader.upload(req.file.path);
            fs_1.default.unlinkSync(req.file.path);
        }
        catch (_a) {
            return next((0, http_errors_1.default)(500, 'Error uploading file!'));
        }
        const countryLower = country.toLowerCase();
        const cCode = currency_codes_1.default.country(countryLower);
        if (!cCode || cCode.length === 0) {
            return next((0, http_errors_1.default)(400, 'Currency code not found for the specified country!'));
        }
        const newUser = new userModel_1.default({
            fullname: fullname,
            email: email,
            phonenumber: phonenumber,
            password: hashedPassword,
            username: username,
            gender: gender,
            preferences: preference,
            country: countryLower,
            profilepicture: uploadImageUrl.url,
            currency_code: cCode[0].code,
        });
        yield newUser.save();
        const { registerEmailData } = email_templates_1.default;
        const emailData = registerEmailData(fullname, email);
        yield (0, mailService_1.default)(emailData, (mailError) => {
            if (mailError) {
                return next((0, http_errors_1.default)(500, 'User created, but email sending failed!'));
            }
            return res.status(201).send({
                status: 'success',
                message: 'User created successfully',
                userdata: {
                    fullname: newUser.fullname,
                    email: newUser.email,
                    phonenumber: newUser.phonenumber,
                    username: newUser.username,
                    gender: newUser.gender,
                    preference: newUser.preferences,
                    country: newUser.country,
                    profilepicture: newUser.profilepicture,
                    currency_code: newUser.currency_code,
                },
            });
        });
    }
    catch (_b) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = create_new_user;
