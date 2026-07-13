const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ban = require('../models/Ban');
const HiddenUser = require('../models/HiddenUser');
const AdminLog = require('../models/AdminLog');
const Message = require('../models/Message');
const constants = require('../config/constants');

const adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    const isValid = await bcrypt.compare(password, adminPasswordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    req.session.adminToken = true;
    res.json({ message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isOnline: true });
    const bannedUsers = await Ban.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.json({
      totalUsers,
      activeUsers,
      bannedUsers,
      totalMessages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const { userId, reason, duration } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

    const ban = new Ban({
      userId,
      username: user.username,
      email: user.email,
      reason,
      expiresAt,
    });

    await ban.save();
    await User.findByIdAndUpdate(userId, { status: 'banned' });

    await AdminLog.create({
      action: 'ban',
      targetUser: { userId, username: user.username, email: user.email },
      reason,
    });

    res.json({ message: 'User banned successfully', ban });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Ban.deleteOne({ userId });
    await User.findByIdAndUpdate(userId, { status: 'active' });

    await AdminLog.create({
      action: 'unban',
      targetUser: { userId, username: user.username, email: user.email },
    });

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const hideUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hidden = new HiddenUser({
      userId,
      username: user.username,
      reason,
    });

    await hidden.save();
    await User.findByIdAndUpdate(userId, { status: 'hidden' });

    res.json({ message: 'User hidden successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unhideUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await HiddenUser.deleteOne({ userId });
    await User.findByIdAndUpdate(userId, { status: 'active' });

    res.json({ message: 'User unhidden successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, status, limit = 50, skip = 0 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const logs = await AdminLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getDashboard,
  banUser,
  unbanUser,
  hideUser,
  unhideUser,
  getUsers,
  getLogs,
};
