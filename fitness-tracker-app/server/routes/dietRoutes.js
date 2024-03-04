const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const dietController = require('../controllers/dietController');

// Route to get all diet logs for a specific user
router.get('/user-diets/:userId', verifyToken, dietController.getUserDiets);

// Route to add a new diet entry for a user
router.post('/user-diets', verifyToken, dietController.addDietEntry);

// Route to update a diet entry for a user
router.put('/user-diets/:dietId', verifyToken, dietController.updateDietEntry);

// Route to delete a diet entry for a user
router.delete('/user-diets/:dietId', verifyToken, dietController.deleteDietEntry);

module.exports = router;
