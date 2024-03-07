const express = require('express');
const router = express.Router();
const userWorkoutPlansController = require('../controllers/userworkoutplansController');
const verifyToken = require('../middleware/verifyToken'); // Assuming you have authentication middleware

// Route to add a new user workout plan
router.post('/', verifyToken, userWorkoutPlansController.addUserWorkoutPlan);

// Route to get all workout plans for a specific user
router.get('/', verifyToken, userWorkoutPlansController.getUserWorkoutPlans);

// Route to update a user's workout plan progress
router.put('/:planId/progress', verifyToken, userWorkoutPlansController.updateUserWorkoutPlanProgress);

// Route to remove a workout plan from a user
router.delete('/:planId', verifyToken, userWorkoutPlansController.removeUserWorkoutPlan);

module.exports = router;
