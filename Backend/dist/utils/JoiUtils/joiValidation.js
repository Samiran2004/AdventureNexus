"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaValidation = void 0;
const Joi = require('joi');
exports.userSchemaValidation = Joi.object({
    fullname: Joi.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z\s]+$/)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    phonenumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    gender: Joi.string()
        .valid('male', 'female', 'other')
        .required(),
    preference: Joi.array()
        .items(Joi.string().valid('adventure', 'relaxation', 'culture', 'nature', 'beach', 'mountains', 'urban'))
        .optional(),
    country: Joi.string()
        .min(3)
        .max(30)
        .required(),
});
