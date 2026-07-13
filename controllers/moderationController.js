const Ban = require('../models/Ban');
const HiddenUser = require('../models/HiddenUser');
const ProfanityWord = require('../models/ProfanityWord');

const getBans = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const bans = await Ban.find()
      .sort({ bannedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(bans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHiddenUsers = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const hidden = await HiddenUser.find()
      .sort({ hiddenAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(hidden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfanityWords = async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const words = await ProfanityWord.find({ isActive: true })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProfanityWord = async (req, res) => {
  try {
    const { word, severity = 'medium', language = 'en' } = req.body;

    const existing = await ProfanityWord.findOne({ word: word.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Word already exists' });
    }

    const profanityWord = new ProfanityWord({
      word: word.toLowerCase(),
      severity,
      language,
    });

    await profanityWord.save();
    res.status(201).json(profanityWord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeProfanityWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    await ProfanityWord.findByIdAndUpdate(wordId, { isActive: false });
    res.json({ message: 'Word removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBans,
  getHiddenUsers,
  getProfanityWords,
  addProfanityWord,
  removeProfanityWord,
};
