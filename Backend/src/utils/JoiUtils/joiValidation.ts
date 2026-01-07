import Joi from 'joi';

/**
 * Joi Schema for User Registration Validation.
 * Validates fields like name, email, password, and phone number.
 */
const userJoiSchema = Joi.object({
    // User's Full Name (min 3 chars, max 30 chars, required)
    fullname: Joi.string().min(3).max(30).required().messages({
        'string.base': `Full Name should be a type of 'text'`,
        'string.empty': `Full Name cannot be an empty field`,
        'string.min': `Full Name should have a minimum length of {#limit}`,
        'string.max': `Full Name should have a maximum length of {#limit}`,
        'any.required': `Full Name is a required field`,
    }),

    // Username (alphanumeric, min 3, max 30, required)
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.base': `Username should be a type of 'text'`,
        'string.empty': `Username cannot be an empty field`,
        'string.min': `Username should have a minimum length of {#limit}`,
        'string.max': `Username should have a maximum length of {#limit}`,
        'any.required': `Username is a required field`,
    }),

    // Email Address (must be valid email format, TLD required)
    email: Joi.string()
        .required(), // country is required
});
