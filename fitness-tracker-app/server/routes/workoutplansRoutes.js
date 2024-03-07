const express = require('express');
const router = express.Router();
const workoutplansController = require('../controllers/workoutplansController');
const verifyToken = require('../middleware/verifyToken'); 

// Route to get all workout plans
router.get('/', verifyToken, workoutplansController.getAllWorkoutPlans);

// Route to get a specific workout plan by ID
router.get('/:planId', verifyToken, workoutplansController.getWorkoutPlanById);

// Route to create a new workout plan
router.post('/', verifyToken, workoutplansController.createWorkoutPlan);

// Route to update a workout plan
router.put('/:planId', verifyToken, workoutplansController.updateWorkoutPlan)

// Route to remove a workout plan
router.delete('/:planId', verifyToken, workoutplansController.deleteWorkoutPlan);

module.exports = router;
