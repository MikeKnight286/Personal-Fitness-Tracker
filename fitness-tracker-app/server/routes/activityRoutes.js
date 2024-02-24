const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const verifyToken = require('../middleware/verifyToken');
const adminCheck = require('../middleware/adminCheck');

// Route to get all activities
router.get('/all-activities', verifyToken, activityController.getAllActivities);

// Route to get a single activity by ID 
router.get('/activity/:id', verifyToken, activityController.getActivityById);

// Route to create a new activity (Admin-only)
router.post('/create-activity', verifyToken, adminCheck, activityController.createActivity);

// Route for users to add an activity
router.post('/add-user-activity', verifyToken, activityController.addUserActivity);

// Route to get all activities for a specific user
router.get('/user-activities/:userId', verifyToken, activityController.getUserActivities);

module.exports = router;
