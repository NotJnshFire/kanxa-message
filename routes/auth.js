const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateEmail, validatePassword, validateUsername, handleValidationErrors } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');

router.post(
  '/signup',
  authLimiter,
  validateUsername(),
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
  authController.signup
);

router.post(
  '/signin',
  authLimiter,
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
  authController.signin
);

router.post('/google', authController.googleAuth);

router.get('/profile', auth, authController.getProfile);

module.exports = router;
