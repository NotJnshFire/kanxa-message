import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/database.js';
import { setupSocketEvents } from './services/socketService.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import moderationRoutes from './routes/moderation.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/moderation', moderationRoutes);

// Socket.io events
setupSocketEvents(io);

// Error handler
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Kanxa Message server running on port ${PORT}`);
    console.log(`📱 Socket.io ready for real-time messaging`);
    console.log(`🔐 Admin panel protected with password authentication`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

export default { app, server, io };
