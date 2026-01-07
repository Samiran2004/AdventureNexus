import Joi from 'joi';

/**
 * Joi Schema for Trip Recommendation Search.
 * Validates travel plan parameters like destination, dates, budget, etc.
 */
const recommendationsJoiSchema = Joi.object({
    // Destination (required string)
    to: Joi.string().required(),

    // Origin (required string)
    from: Joi.string().required(),

    // Travel Date (required string, format unspecified here)
    date: Joi.string().required(),

    // Number of Travelers (required number)
    travelers: Joi.number().required(),

    // Budget per person/total (required number)
    budget: Joi.number().required(),

    // Custom Validation Messages
    messages: {
        'string.base': `Field should be a type of 'text'`,
        'string.empty': `Field cannot be an empty field`,
        'any.required': `Field is a required field`,
        'number.base': `Field should be a type of 'number'`,
        'number.empty': `Field cannot be an empty field`,
    }
});

export default recommendationsJoiSchema;
