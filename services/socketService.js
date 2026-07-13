export const setupSocketEvents = (io) => {
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User join
    socket.on('userJoin', async (userData) => {
      const userId = userData.userId;
      activeUsers.set(socket.id, userData);

      // Update user online status
      io.emit('userOnline', {
        userId,
        username: userData.username,
        profilePhoto: userData.profilePhoto
      });

      socket.emit('onlineUsers', Array.from(activeUsers.values()));
    });

    // New message
    socket.on('newMessage', (message) => {
      io.emit('messageReceived', message);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', {
        userId: data.userId,
        username: data.username
      });
    });

    socket.on('stopTyping', (data) => {
      socket.broadcast.emit('userStopTyping', {
        userId: data.userId
      });
    });

    // Message deleted
    socket.on('messageDeleted', (data) => {
      io.emit('messageDeletedNotification', {
        messageId: data.messageId,
        deletedBy: data.deletedBy
      });
    });

    // User banned
    socket.on('userBanned', (data) => {
      io.emit('userBannedNotification', {
        userId: data.userId,
        reason: data.reason
      });
    });

    // User disconnected
    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);

      if (user) {
        io.emit('userOffline', {
          userId: user.userId,
          username: user.username
        });
      }

      console.log(`User disconnected: ${socket.id}`);
    });

    // Reconnect
    socket.on('reconnect', () => {
      console.log(`User reconnected: ${socket.id}`);
    });
  });

  return io;
};
