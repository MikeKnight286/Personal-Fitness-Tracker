const pool = require('../config/db.js');

class UserActivity {
    static async findAllByUserId(userId) {
        const { rows } = await pool.query(
            'SELECT ua.*, a.name, a.calories_burned_per_minute FROM user_activities ua JOIN activities a ON ua.activity_id = a.id WHERE ua.user_id = $1',
            [userId]
        );
        return rows;
    }

    static async addActivity(userId, activityId, durationMinutes) {
        // Fetch the activity to get calories burned per minute
        const { rows: activityRows } = await pool.query(
            'SELECT calories_burned_per_minute FROM activities WHERE id = $1',
            [activityId]
        );
        if (activityRows.length === 0) {
            throw new Error('Activity not found');
        }
        const caloriesBurnedPerMinute = activityRows[0].calories_burned_per_minute;

        // Calculate total calories burned
        const caloriesBurned = caloriesBurnedPerMinute * durationMinutes;

        // Insert the user activity record
        const { rows: userActivityRows } = await pool.query(
            'INSERT INTO user_activities (user_id, activity_id, duration_minutes, calories_burned) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, activityId, durationMinutes, caloriesBurned]
        );
        return userActivityRows[0];
    }
}

module.exports = UserActivity;
