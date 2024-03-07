const Joi = require('joi');

// Validation for creating a new workout plan
const createWorkoutPlanValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().allow('', null),
    target_goal: Joi.string().required(),
    difficulty_level: Joi.string().required(),
    duration_weeks: Joi.number().integer().min(1).required(),
    sessions_per_week: Joi.number().integer().min(1).max(7).required(),
    premium_only: Joi.boolean(),
    video_url: Joi.string().uri().allow('', null),
    prerequisites: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).allow(null),
  });
  return schema.validate(data);
};

// Validation for updating a workout plan
const updateWorkoutPlanValidation = createWorkoutPlanValidation; // Reuse the creation schema for updates

// Validation for adding a user to a workout plan
const addUserWorkoutPlanValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    planId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    status: Joi.string().required(),
    currentWeek: Joi.number().integer(),
  });
  return schema.validate(data);
};

// Validation for updating a user's workout plan progress
const updateUserWorkoutPlanProgressValidation = (data) => {
  const schema = Joi.object({
    progress: Joi.object().allow(null),
    status: Joi.string().required(),
    currentWeek: Joi.number().integer(),
    feedback: Joi.object().allow(null),
    adjustments: Joi.object().allow(null),
    progressPercentage: Joi.number().integer(),
    lastActivity: Joi.date(),
    userRating: Joi.number().integer().min(1).max(5).allow(null),
  });
  return schema.validate(data);
};

module.exports = {
  createWorkoutPlanValidation,
  updateWorkoutPlanValidation,
  addUserWorkoutPlanValidation,
  updateUserWorkoutPlanProgressValidation,
};
