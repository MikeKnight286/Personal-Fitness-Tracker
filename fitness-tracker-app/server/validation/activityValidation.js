const Joi = require('joi');

// Input validation for creating activity by admin
const createActivityValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        caloriesBurnedPerMinute: Joi.number().positive().required(),
    });
    return schema.validate(data);
};

// Input validation for adding activity by user
const addUserActivityValidation = (data) => {
    const schema = Joi.object({
        activityId: Joi.number().required(),
        durationMinutes: Joi.number().required(),
        activityDate: Joi.date().required()
    });
    return schema.validate(data);
};

module.exports = {
    createActivityValidation,
    addUserActivityValidation
};
