const Joi = require('joi');

// Input validation for creating dietary entry
const addDietEntryValidation = (data) => {
    const schema = Joi.object({
        food_name: Joi.string().min(2).required(),
        calories: Joi.number().positive().required(),
        protein_g: Joi.number().positive().required(),
        carbs_g: Joi.number().positive().required(),
        fats_g: Joi.number().positive().required(),
        fiber_g: Joi.number().positive().allow(null),
        sugar_g: Joi.number().positive().allow(null),
        sodium_mg: Joi.number().positive().allow(null),
        cholesterol_mg: Joi.number().positive().allow(null),
        serving_size: Joi.string().allow('', null), 
        meal_date: Joi.date().required(),
        meal_type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').allow('', null),
        notes: Joi.string().allow('', null),
    });
    return schema.validate(data);
};

// Input validation for updating dietary entry
const updateDietEntryValidation = (data) => {
    // Same as addDietEntryValidation for simplicity;
    return addDietEntryValidation(data);
};
