const joi = require('joi');

module.exports = userschemavalidation = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})