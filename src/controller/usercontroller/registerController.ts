import { Request, Response } from 'express';
import User, { IUser } from '../../models/userModel'; // Adjust the import path based on your project structure
import bcrypt from 'bcryptjs';
import cc from 'currency-codes';
import { userSchemaValidation } from '../../utils/JoiUtils/joiLoginValidation';
import generateRandomUserName from '../../utils/generateRandomUserName';
import cloudinary from '../../service/cloudinaryService';
import sendMail from '../../service/mailService';
import fs from 'fs';
import emailTemplates from '../../utils/emailTemplate';
import dotenv from 'dotenv';
import { Readable } from 'stream';

interface RequestBody {
    fullname: string;
    email: string;
    password: string;
    phonenumber: number;
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

interface CustomRequest<TParams = {}, TQuery = {}, TBody = RequestBody> extends Request<TParams, any, TBody, TQuery> {
    file: MulterFile;
}

dotenv.config();

const create_new_user = async (req: CustomRequest, res: Response) => {
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
        const { error } = userSchemaValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'failed',
                message: error.details[0].message,
            });
        }

        // Check if the user already exists
        const checkUserExist: IUser | null = await User.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }],
        });

        if (checkUserExist) {
            return res.status(409).send({
                status: 'failed',
                message: 'User already exists',
            });
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
        } catch (uploadError) {
            if (uploadError instanceof Error) {
                return res.status(500).send({
                    status: 'failed',
                    message: 'Error uploading profile picture',
                    error: uploadError.message,
                });
            } else {
                return res.status(500).send({
                    status: 'failed',
                    message: 'Error uploading profile picture',
                    error: 'Unknown error',
                });
            }
        }

        // Create Currency code
        country = country.toLowerCase();
        const cCode = cc.country(country);
        if (!cCode || cCode.length === 0) {
            return res.status(400).send({
                status: 'failed',
                message: 'Currency code not found for the specified country',
            });
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
            country: country,
            profilepicture: uploadImageUrl.url,
            currency_code: cCode[0].code,
        });
        await newUser.save();

        // Email data
        const { registerEmailData } = emailTemplates;
        const emailData = registerEmailData(fullname, email);

        // Send welcome email
        sendMail(emailData, (mailError: Error | null, response: any) => {
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
    } catch (error) {
        return res.status(500).send({
            status: 'failed',
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error', // Type check for error
        });
    }
};

export default create_new_user;
