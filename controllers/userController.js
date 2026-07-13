const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, avatar },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username: newUsername },
      { new: true }
    ).select('-password');

    res.json({ message: 'Username changed', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true })
      .select('_id username avatar status')
      .limit(50);

    res.json(onlineUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  changeUsername,
  getOnlineUsers,
};
