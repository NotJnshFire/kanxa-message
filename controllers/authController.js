import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { SecureSettings } from '../models/SecureSettings.js';

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      username,
      displayName: username
    });

    await user.save();

    // Create secure settings
    const secureSettings = new SecureSettings({ userId: user._id });
    await secureSettings.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if banned
    if (user.isBanned && user.banUntil > new Date()) {
      return res.status(403).json({
        message: 'Your account is banned',
        banReason: user.banReason,
        banUntil: user.banUntil
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Signed in successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { googleId, email, displayName, profilePhoto } = req.body;

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Generate unique username from email
      const baseUsername = email.split('@')[0];
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        googleId,
        email,
        displayName,
        username,
        profilePhoto
      });

      await user.save();

      // Create secure settings
      const secureSettings = new SecureSettings({ userId: user._id });
      await secureSettings.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.displayName = displayName;
      user.profilePhoto = profilePhoto;
      await user.save();
    }

    // Check if banned
    if (user.isBanned && user.banUntil > new Date()) {
      return res.status(403).json({
        message: 'Your account is banned',
        banReason: user.banReason,
        banUntil: user.banUntil
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error with Google authentication', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Update last seen
    await User.findByIdAndUpdate(req.user.userId, {
      isOnline: false,
      lastSeen: new Date()
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};
