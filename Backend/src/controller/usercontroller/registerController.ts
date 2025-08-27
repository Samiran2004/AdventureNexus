import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../Database/models/userModel';
import bcrypt from 'bcryptjs';
import cc from 'currency-codes';
import generateRandomUserName from '../../utils/generateRandomUserName';
import cloudinary from '../../service/cloudinaryService';
import sendMail from '../../service/mailService';
import fs from 'fs';
import emailTemplates from '../../utils/emailTemplate';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import createHttpError from 'http-errors';
import { userSchemaValidation } from '../../utils/JoiUtils/joiValidation';

export interface RequestBodyRegisterController {
    fullname: string;
    email: string;
    password: string;
    phonenumber: string;
    gender: string;
    preference: string[];
    country: string;
}

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: Readable;
}

export interface CustomRequestRegisterController<
    TParams = object,
    TQuery = object,
    TBody = RequestBodyRegisterController,
> extends Request<TParams, unknown, TBody, TQuery> {
    file: MulterFile;
}

dotenv.config();

const create_new_user = async (
    req: CustomRequestRegisterController,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const {
        fullname,
        email,
        password,
        phonenumber,
        gender,
        preference,
        country,
    } = req.body;

    try {
        // Check for required fields
        if (
            !fullname ||
            !email ||
            !password ||
            !phonenumber ||
            !gender ||
            !country
        ) {
            return next(createHttpError(400, 'All fields are required!'));
        }

        // Validate input data
        const { error } = userSchemaValidation.validate(req.body);
        if (error) {
            return next(createHttpError(400, error?.details[0].message));
        }

        // Check if the user already exists
        const checkUserExist: IUser | null = await User.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }],
        });

        if (checkUserExist) {
            return next(createHttpError(409, 'User already exist!'));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a random username
        const username = await generateRandomUserName(fullname);

        // Upload profile image to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path); // Remove file from local storage
        } catch {
            // if (uploadError instanceof Error) {
            //     return res.status(500).send({
            //         status: 'failed',
            //         message: 'Error uploading profile picture',
            //         error: uploadError.message,
            //     });
            // } else {
            //     return res.status(500).send({
            //         status: 'failed',
            //         message: 'Error uploading profile picture',
            //         error: 'Unknown error',
            //     });
            // }
            return next(createHttpError(500, 'Error uploading file!'));
        }

        // Create Currency code
        const countryLower = country.toLowerCase();
        const cCode = cc.country(countryLower);
        if (!cCode || cCode.length === 0) {
            return next(
                createHttpError(
                    400,
                    'Currency code not found for the specified country!'
                )
            );
        }

        // Create the new user
        const newUser = new User({
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
        await newUser.save();

        // Email data
        const { registerEmailData } = emailTemplates;
        const emailData = registerEmailData(fullname, email);

        // Send welcome email
        await sendMail(emailData, (mailError: Error | null) => {
            if (mailError) {
                return next(
                    createHttpError(
                        500,
                        'User created, but email sending failed!'
                    )
                );
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
    } catch {
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

export default create_new_user;
