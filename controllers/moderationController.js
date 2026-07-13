import { Ban } from '../models/Ban.js';
import { HiddenUser } from '../models/HiddenUser.js';
import { ProfanityWord } from '../models/ProfanityWord.js';
import { User } from '../models/User.js';
import { AdminLog } from '../models/AdminLog.js';
import { CONSTANTS } from '../config/constants.js';

export const getProfanityWords = async (req, res) => {
  try {
    const { language, limit = 100 } = req.query;

    let query = { isActive: true };
    if (language) {
      query.language = language;
    }

    const words = await ProfanityWord.find(query).limit(parseInt(limit));

    res.json({ words });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profanity words', error: error.message });
  }
};

export const addProfanityWord = async (req, res) => {
  try {
    const { word, language, severity } = req.body;
    const adminId = req.user.userId;

    // Check if word already exists
    const existing = await ProfanityWord.findOne({ word: word.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Word already exists' });
    }

    const profanityWord = new ProfanityWord({
      word: word.toLowerCase(),
      language,
      severity,
      addedBy: adminId
    });

    await profanityWord.save();

    // Log action
    await AdminLog.create({
      adminId,
      adminEmail: (await User.findById(adminId)).email,
      action: 'add_profanity_word',
      details: { word, language, severity },
      status: 'success'
    });

    res.status(201).json({
      message: 'Profanity word added',
      word: profanityWord
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding profanity word', error: error.message });
  }
};

export const removeProfanityWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    const adminId = req.user.userId;

    const word = await ProfanityWord.findByIdAndUpdate(
      wordId,
      { isActive: false },
      { new: true }
    );

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Log action
    await AdminLog.create({
      adminId,
      adminEmail: (await User.findById(adminId)).email,
      action: 'remove_profanity_word',
      details: { word: word.word },
      status: 'success'
    });

    res.json({ message: 'Profanity word removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing profanity word', error: error.message });
  }
};

export const getBans = async (req, res) => {
  try {
    const { search, limit = 50, skip = 0 } = req.query;

    let query = { isActive: true };
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const bans = await Ban.find(query)
      .sort({ banStartDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('bannedBy', 'username email');

    const total = await Ban.countDocuments(query);

    res.json({
      bans,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bans', error: error.message });
  }
};

export const getHiddenUsers = async (req, res) => {
  try {
    const { search, limit = 50, skip = 0 } = req.query;

    let query = { isHidden: true };
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const hidden = await HiddenUser.find(query)
      .sort({ hiddenAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('hiddenBy', 'username email');

    const total = await HiddenUser.countDocuments(query);

    res.json({
      hidden,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hidden users', error: error.message });
  }
};
