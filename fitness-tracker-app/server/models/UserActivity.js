const pool = require('../config/db.js');

class UserActivity {
    static async findAllByUserId(userId) {
        const { rows } = await pool.query(
            `SELECT 
                a.name AS "activityName", 
                ua.duration_minutes AS "durationMinutes", 
                ua.calories_burned AS "caloriesBurned", 
                ua.activity_date AS "activityDate" 
             FROM user_activities ua 
             JOIN activities a ON ua.activity_id = a.id 
             WHERE ua.user_id = $1
             ORDER BY ua.activity_date DESC`, // Optionally order by activity_date or any other column
            [userId]
        );
        return rows.map(row => ({
            activityName: row.activityName,
            durationMinutes: row.durationMinutes,
            caloriesBurned: row.caloriesBurned,
            activityDate: row.activityDate
        }));
    }

    static async addActivity(userId, activityId, durationMinutes, activityDate) {
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
            'INSERT INTO user_activities (user_id, activity_id, duration_minutes, calories_burned, activity_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, activityId, durationMinutes, caloriesBurned, activityDate]
        );
        return userActivityRows[0];
    }
}

module.exports = UserActivity;
