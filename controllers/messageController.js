const Message = require('../models/Message');
const profanityFilter = require('../services/profanityFilter');

const getMessages = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const messages = await Message.find({ isDeleted: false })
      .populate('senderId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, type = 'text', fileUrl, fileName, replyTo } = req.body;
    const { userId } = req;

    const user = await require('../models/User').findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { hasProfanity, severity } = profanityFilter.check(content);

    const message = new Message({
      senderId: userId,
      senderUsername: user.username,
      content,
      type,
      fileUrl,
      fileName,
      replyTo,
      containsProfanity: hasProfanity,
      profanityLevel: hasProfanity ? severity : null,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );

    res.json({ message: 'Message deleted', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
};
