const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/profile', auth, userController.getUserProfile);

router.put('/profile', auth, userController.updateProfile);

router.post('/change-username', auth, userController.changeUsername);

router.get('/online-users', userController.getOnlineUsers);

module.exports = router;
