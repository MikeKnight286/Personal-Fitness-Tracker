// server/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route to add an activity for a user
router.post('/user/:userId/add_activity', activityController.addUserActivity);

// Route to get activities for a user
router.get('/user/:userId/activities', activityController.getUserActivities);

module.exports = router;
