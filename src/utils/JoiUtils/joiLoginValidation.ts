const Joi = require('joi');

// Define the validation schema for user registration
const userSchemaValidation = Joi.object({
    username: Joi.string()
        .min(3) // Minimum length for username
        .max(30) // Maximum length for username
        .required() // Username is required
        .alphanum(), // Only alphanumeric characters are allowed

    email: Joi.string()
        .email() // Must be a valid email format
        .required(), // Email is required

    password: Joi.string()
        .min(6) // Minimum length for password
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Allow only alphanumeric characters
        .required() // Password is required
});

// Export the validation schema
module.exports = userSchemaValidation;
