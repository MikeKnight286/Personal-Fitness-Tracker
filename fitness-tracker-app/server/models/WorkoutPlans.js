const pool = require('../config/db');

class WorkoutPlans {
  // Fetch all workout plans, possibly with a filter for premium content
  static async findAll({ premiumOnly = false } = {}) {
    const premiumOnlyValue = premiumOnly === true; 
    const query = {
      text: `SELECT * FROM workout_plans WHERE premium_only <= $1 ORDER BY created_at DESC`,
      values: [premiumOnlyValue],
    };

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      throw new Error(err.message);
    }
}

  // Fetch a single workout plan by ID
  static async findById(id) {
    const query = {
      text: `SELECT * FROM workout_plans WHERE id = $1`,
      values: [id],
    };

    try {
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null; 
      }
      return rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Create a new workout plan
  static async create({ name, description, targetGoal, difficultyLevel, durationWeeks, sessionsPerWeek, premiumOnly, videoUrl, prerequisites, tags }) {
    const query = {
      text: `INSERT INTO workout_plans (name, description, target_goal, difficulty_level, duration_weeks, sessions_per_week, premium_only, video_url, prerequisites, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      values: [name, description, targetGoal, difficultyLevel, durationWeeks, sessionsPerWeek, premiumOnly, videoUrl, prerequisites, tags],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Update an existing workout plan
  static async update(id, { name, description, targetGoal, difficultyLevel, durationWeeks, sessionsPerWeek, premiumOnly, videoUrl, prerequisites, tags }) {
    const query = {
      text: `UPDATE workout_plans SET name = $2, description = $3, target_goal = $4, difficulty_level = $5, duration_weeks = $6, sessions_per_week = $7, premium_only = $8, video_url = $9, prerequisites = $10, tags = $11, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values: [id, name, description, targetGoal, difficultyLevel, durationWeeks, sessionsPerWeek, premiumOnly, videoUrl, prerequisites, tags],
    };

    try {
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null; // Or a more specific error/message
      }
      return rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Delete a workout plan 
  static async delete(id) {
    const query = {
      text: `DELETE FROM workout_plans WHERE id = $1 RETURNING *`, // Returns deleted plan
      values: [id],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0]; // will be undefined if nothing was deleted
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = WorkoutPlans;
