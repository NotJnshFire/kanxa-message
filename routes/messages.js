const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/', messageController.getMessages);

router.post('/', auth, messageController.sendMessage);

router.delete('/:messageId', auth, messageController.deleteMessage);

module.exports = router;
