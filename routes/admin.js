const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const { adminLimiter } = require('../middleware/rateLimit');

router.post('/login', adminLimiter, adminController.adminLogin);

router.get('/dashboard', adminAuth, adminController.getDashboard);

router.post('/ban-user', adminAuth, adminController.banUser);

router.post('/unban-user', adminAuth, adminController.unbanUser);

router.post('/hide-user', adminAuth, adminController.hideUser);

router.post('/unhide-user', adminAuth, adminController.unhideUser);

router.get('/users', adminAuth, adminController.getUsers);

router.get('/logs', adminAuth, adminController.getLogs);

module.exports = router;
