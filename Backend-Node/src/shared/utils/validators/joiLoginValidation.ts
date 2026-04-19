import Joi from 'joi';

/**
 * Joi Schema for User Login Validation.
 * Validates only username and password.
 */
const userLoginJoiSchema = Joi.object({
    // Username (required, alphanumeric, min 3, max 30)
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.base': `Username should be a type of 'text'`,
        'string.empty': `Username cannot be an empty field`,
        'string.min': `Username should have a minimum length of {#limit}`,
        'string.max': `Username should have a maximum length of {#limit}`,
        'any.required': `Username is a required field`,
    }),

    // Password (required, min 6 chars)
    password: Joi.string().min(6).required().messages({
        'string.base': `Password should be a type of 'text'`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'any.required': `Password is a required field`,
    }),
});

export default userLoginJoiSchema;
