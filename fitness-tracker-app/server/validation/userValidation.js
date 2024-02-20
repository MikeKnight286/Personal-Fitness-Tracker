const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        dateOfBirth: Joi.date().optional(),
        gender: Joi.string().optional(),
        heightCm: Joi.number().optional(),
        weightKg: Joi.number().optional(),
        goal: Joi.string().optional(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
};
