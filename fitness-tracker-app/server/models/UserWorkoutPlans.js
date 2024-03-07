const pool = require('../config/db'); 

class UserWorkoutPlans {
  // Link a user to a workout plan
  static async addUserWorkoutPlan({ userId, planId, startDate, endDate, status, currentWeek }) {
    const query = {
      text: `INSERT INTO user_workout_plans (user_id, plan_id, start_date, end_date, status, current_week) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [userId, planId, startDate, endDate, status, currentWeek],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (err) {
      throw new Error(`Adding user workout plan failed: ${err.message}`);
    }
  }

  // Fetch workout plans linked to a specific user
  static async findByUserId(userId) {
    const query = {
      text: `SELECT * FROM user_workout_plans WHERE user_id = $1`,
      values: [userId],
    };

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      throw new Error(`Fetching user workout plans failed: ${err.message}`);
    }
  }

  // Update a user's workout plan progress
  static async updateProgress(userId, planId, progress, status, currentWeek, feedback, adjustments, progressPercentage, lastActivity, userRating) {
    const query = {
      text: `UPDATE user_workout_plans SET progress = $3, status = $4, current_week = $5, feedback = $6, adjustments = $7, progress_percentage = $8, last_activity = $9, user_rating = $10 WHERE user_id = $1 AND plan_id = $2 RETURNING *`,
      values: [userId, planId, progress, status, currentWeek, feedback, adjustments, progressPercentage, lastActivity, userRating],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (err) {
      throw new Error(`Updating user workout plan progress failed: ${err.message}`);
    }
  }

  // Remove a workout plan from a user
  static async removeUserWorkoutPlan(userId, planId) {
    const query = {
      text: `DELETE FROM user_workout_plans WHERE user_id = $1 AND plan_id = $2 RETURNING *`,
      values: [userId, planId],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0]; // will be undefined if nothing was deleted
    } catch (err) {
      throw new Error(`Removing user workout plan failed: ${err.message}`);
    }
  }
}

module.exports = UserWorkoutPlans;
