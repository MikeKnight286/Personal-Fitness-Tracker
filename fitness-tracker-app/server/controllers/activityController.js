const Activity = require('../models/Activity');
const UserActivity = require('../models/UserActivity');

exports.addUserActivity = async (req, res) => {
    const { userId } = req.params;
    const { activityId, durationMinutes } = req.body;
    
    try {
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).send('Activity not found');
        }

        const caloriesBurned = parseFloat(activity.calories_burned_per_minute) * durationMinutes;
        const userActivity = await UserActivity.addActivity(userId, activityId, durationMinutes, caloriesBurned);

        res.status(201).json(userActivity);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUserActivities = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const activities = await UserActivity.findByUserId(userId);
        res.json(activities);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
