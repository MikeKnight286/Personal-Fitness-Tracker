const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const dietController = require('../controllers/dietController');

// Route to get all diet logs for a specific user
router.get('/user-diets/:userId', verifyToken, dietController.getUserDiets);

// Route to get all diet logs for a specific user
router.get('/add-user-diet', verifyToken, dietController.addDietEntry);

// Route to get all diet logs for a specific user
router.get('/update-user-diet', verifyToken, dietController.updateDietEntry);

// Route to get all diet logs for a specific user
router.get('/delete-user-diet', verifyToken, dietController.deleteDietEntry);

module.exports = router;