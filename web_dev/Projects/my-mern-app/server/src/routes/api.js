const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUser);
router.get('/users', userController.getAllUsers);

module.exports = router;