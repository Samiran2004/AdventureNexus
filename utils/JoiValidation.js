const joi = require('joi');

module.exports = userSchemaValidation = joi.object({
    fullname: joi.string().min(3).max(20).regex(/^[a-zA-Z\s]+$/).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phonenumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    gender: joi.string().valid('male', 'female', 'other').required(),
    preference: joi.array().items(joi.string().valid('adventure', 'relaxation', 'culture', 'nature', 'beach', 'mountains', 'urban')).optional(),
    country: joi.string().min(3).max(30).required()
});