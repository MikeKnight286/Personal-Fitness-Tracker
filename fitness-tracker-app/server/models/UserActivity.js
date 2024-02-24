const pool = require('../config/db.js');

class UserActivity {
    static async addActivity(userId, activityId, durationMinutes, caloriesBurned) {
        const { rows } = await pool.query(
            'INSERT INTO user_activities (user_id, activity_id, duration_minutes, calories_burned) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, activityId, durationMinutes, caloriesBurned]
        );
        return rows[0];
    }

    static async findByUserId(userId) {
        const { rows } = await pool.query('SELECT * FROM user_activities WHERE user_id = $1', [userId]);
        return rows;
    }
}
module.exports = UserActivity;
