"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import path based on your project structure
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const currency_codes_1 = __importDefault(require("currency-codes"));
const joiLoginValidation_1 = require("../../utils/JoiUtils/joiLoginValidation");
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const mailService_1 = __importDefault(require("../../service/mailService"));
const fs_1 = __importDefault(require("fs"));
const emailTemplate_1 = __importDefault(require("../../utils/emailTemplate"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const create_new_user = async (req, res) => {
    let { fullname, email, password, phonenumber, gender, preference, country } = req.body;
    try {
        // Check for required fields
        if (!fullname || !email || !password || !phonenumber || !gender || !country) {
            return res.status(400).send({
                status: 'failed',
                message: 'All fields are required',
            });
        }
        // Validate input data
        const { error } = joiLoginValidation_1.userSchemaValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'failed',
                message: error.details[0].message,
            });
        }
        // Check if the user already exists
        const checkUserExist = await userModel_1.default.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }],
        });
        if (checkUserExist) {
            return res.status(409).send({
                status: 'failed',
                message: 'User already exists',
            });
        }
        // Hash the password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Generate a random username
        const username = await (0, generateRandomUserName_1.default)(fullname);
        // Upload profile image to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinaryService_1.default.uploader.upload(req.file.path);
            fs_1.default.unlinkSync(req.file.path); // Remove file from local storage
        }
        catch (uploadError) {
            if (uploadError instanceof Error) {
                return res.status(500).send({
                    status: 'failed',
                    message: 'Error uploading profile picture',
                    error: uploadError.message,
                });
            }
            else {
                return res.status(500).send({
                    status: 'failed',
                    message: 'Error uploading profile picture',
                    error: 'Unknown error',
                });
            }
        }
        // Create Currency code
        country = country.toLowerCase();
        const cCode = currency_codes_1.default.country(country);
        if (!cCode || cCode.length === 0) {
            return res.status(400).send({
                status: 'failed',
                message: 'Currency code not found for the specified country',
            });
        }
        // Create the new user
        const newUser = new userModel_1.default({
            fullname: fullname,
            email: email,
            phonenumber: phonenumber,
            password: hashedPassword,
            username: username,
            gender: gender,
            preferences: preference,
            country: country,
            profilepicture: uploadImageUrl.url,
            currency_code: cCode[0].code,
        });
        await newUser.save();
        // Email data
        const { registerEmailData } = emailTemplate_1.default;
        const emailData = registerEmailData(fullname, email);
        // Send welcome email
        (0, mailService_1.default)(emailData, (mailError, response) => {
            if (mailError) {
                return res.status(500).send({
                    status: 'failed',
                    message: 'User created, but email sending failed',
                });
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
                    currency_code: newUser.currency_code, // Adjusted this line
                },
            });
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'failed',
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error', // Type check for error
        });
    }
};
exports.default = create_new_user;
