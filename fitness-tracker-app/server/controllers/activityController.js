const Activity = require('../models/Activity');
const UserActivity = require('../models/UserActivity');
const { createActivityValidation, addUserActivityValidation }  = require('../validation/activityValidation')

exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).send('Activity not found');
        }
        res.json(activity);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Only admins can create activity
exports.createActivity = async (req, res) => {

    // Validation
    const { error } = createActivityValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { name, caloriesBurnedPerMinute } = req.body;
        const newActivity = await Activity.create(name, caloriesBurnedPerMinute);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.addUserActivity = async (req, res) => {

    // Validation
    const { error } = addUserActivityValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { userId, activityId, durationMinutes } = req.body;
        const newUserActivity = await UserActivity.addActivity(userId, activityId, durationMinutes);
        res.status(201).json(newUserActivity);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUserActivities = async (req, res) => {
    try {
        const userId = req.params.userId; // Getting user id from url params
        const activities = await UserActivity.findAllByUserId(userId);
        res.json(activities);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
