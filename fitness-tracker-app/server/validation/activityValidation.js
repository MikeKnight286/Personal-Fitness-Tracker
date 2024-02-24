const Joi = require('joi');

// Validation for logging a user activity
const logActivityValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.number().required(),
        activityId: Joi.number().required(),
        duration: Joi.number().min(1).required(),
        date: Joi.date().required(),
    });
    return schema.validate(data);
};

// Validation for adding a new activity (if needed)
const addActivityValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        caloriesBurnedPerMinute: Joi.number().positive().required(),
    });
    return schema.validate(data);
};

module.exports = {
    logActivityValidation,
    addActivityValidation,
};
