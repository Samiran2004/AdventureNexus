const Joi = require('joi');

// Define the validation schema for travel recommendations
const recommendationValidation = Joi.object({
    day: Joi.number()
        .integer() // Ensures the number is an integer
        .positive() // Ensures the number is positive
        .required(), // day is required

    budget: Joi.number()
        .positive() // Ensures the budget is a positive number
        .required(), // budget is required

    destination: Joi.string()
        .min(1) // Ensures at least one character
        .required(), // destination is required

    date: Joi.string()
        .isoDate() // Validates that the string is an ISO 8601 date format (YYYY-MM-DD)
        .required(), // date is required

    totalPeople: Joi.number()
        .integer() // Ensures the number is an integer
        .positive() // Ensures the number is positive
        .required() // totalPeople is required
});

// Export the validation schema
module.exports = recommendationValidation;
