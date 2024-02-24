const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken'); 
const adminCheck = require('../middleware/adminCheck');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User profile routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);

// Route to request a password reset
router.post('/reset-request', authController.requestReset);

// Route to reset the password
router.post('/reset-password', authController.resetPassword);

// Admin-only route
router.get('/admin/all-users', verifyToken, adminCheck, userController.getAllUsers);

module.exports = router;
