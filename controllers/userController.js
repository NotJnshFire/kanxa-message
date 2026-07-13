import { User } from '../models/User.js';
import { UsernameChange } from '../models/UsernameChange.js';
import { SecureSettings } from '../models/SecureSettings.js';
import { CONSTANTS } from '../config/constants.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secureSettings = await SecureSettings.findOne({ userId: req.user.userId });

    res.json({
      user: user.toJSON(),
      settings: secureSettings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { displayName, profilePhoto } = req.body;
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        displayName,
        profilePhoto,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const changeUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username already exists
    const existing = await User.findOne({ username: newUsername });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Check cooldown
    const lastChange = await UsernameChange.findOne({ userId }).sort({ changedAt: -1 });
    if (lastChange && lastChange.nextAllowedChange > new Date()) {
      const daysRemaining = Math.ceil(
        (lastChange.nextAllowedChange - new Date()) / (1000 * 60 * 60 * 24)
      );
      return res.status(429).json({
        message: `Username can be changed again in ${daysRemaining} days`,
        nextAllowedChange: lastChange.nextAllowedChange
      });
    }

    // Create username change record
    const nextAllowed = new Date(Date.now() + CONSTANTS.USERNAME_CHANGE_COOLDOWN);
    await UsernameChange.create({
      userId,
      oldUsername: user.username,
      newUsername,
      nextAllowedChange: nextAllowed
    });

    // Update user
    user.username = newUsername;
    await user.save();

    res.json({
      message: 'Username changed successfully',
      user: user.toJSON(),
      nextAllowedChange: nextAllowed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error changing username', error: error.message });
  }
};

export const updateSecureSettings = async (req, res) => {
  try {
    const { secureAccountEnabled, twoFactorEnabled, loginNotificationsEnabled } = req.body;
    const userId = req.user.userId;

    const settings = await SecureSettings.findOneAndUpdate(
      { userId },
      {
        secureAccountEnabled,
        twoFactorEnabled,
        loginNotificationsEnabled,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Secure settings updated',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

export const getOnlineStatus = async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true })
      .select('username displayName profilePhoto isOnline lastSeen');

    res.json({ onlineUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online status', error: error.message });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;

    const existing = await User.findOne({ username });
    res.json({
      available: !existing
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking username', error: error.message });
  }
};
