const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');
const adminAuth = require('../middleware/adminAuth');

router.get('/bans', moderationController.getBans);

router.get('/hidden-users', moderationController.getHiddenUsers);

router.get('/profanity-words', moderationController.getProfanityWords);

router.post('/profanity-words', adminAuth, moderationController.addProfanityWord);

router.delete('/profanity-words/:wordId', adminAuth, moderationController.removeProfanityWord);

module.exports = router;
