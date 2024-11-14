"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaValidation = void 0;
const Joi = require('joi');
// Define the validation schema for user registration
exports.userSchemaValidation = Joi.object({
    fullname: Joi.string()
        .min(3) // Minimum length of 3 characters
        .max(20) // Maximum length of 20 characters
        .regex(/^[a-zA-Z\s]+$/) // Allows only alphabetic characters and spaces
        .required(), // fullname is required
    email: Joi.string()
        .email() // Validates that the string is an email format
        .required(), // email is required
    password: Joi.string()
        .min(6) // Minimum length of 6 characters
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Allows only alphanumeric characters between 3 and 30
        .required(), // password is required
    phonenumber: Joi.string()
        .length(10) // Must be exactly 10 characters long
        .pattern(/^[0-9]+$/) // Allows only numeric characters
        .required(), // phonenumber is required
    gender: Joi.string()
        .valid('male', 'female', 'other') // Valid values for gender
        .required(), // gender is required
    preference: Joi.array()
        .items(Joi.string().valid('adventure', 'relaxation', 'culture', 'nature', 'beach', 'mountains', 'urban') // Valid preferences
    )
        .optional(), // preference is optional
    country: Joi.string()
        .min(3) // Minimum length of 3 characters
        .max(30) // Maximum length of 30 characters
        .required(), // country is required
});
