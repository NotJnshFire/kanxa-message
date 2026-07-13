# Kanxa Message - Secure Real-Time Messaging App

A production-ready real-time messaging application with secure authentication, admin panel, and advanced moderation tools.

## ✨ Features

### Core Messaging
- ✅ Real-time chat using Socket.io
- ✅ Text, image, and file sharing
- ✅ Message replies with quote feature
- ✅ Clickable links detection
- ✅ Emoji support
- ✅ Online/offline status indicators
- ✅ Auto-scroll to latest messages
- ✅ Chat history persistence
- ✅ Message search functionality

### Authentication & Security
- ✅ Google OAuth 2.0 login
- ✅ Email/Password sign-up and sign-in
- ✅ Secure JWT token management (7 days expiry)
- ✅ Password hashing with bcryptjs
- ✅ No password storage/logging
- ✅ Secure account settings

### Admin Panel
- ✅ Secure password-protected access
- ✅ Rate limiting (3 attempts, 2-day lockout)
- ✅ User management (ban/unban/hide/unhide)
- ✅ Advanced search functionality
- ✅ Ban and hidden users lists
- ✅ Comprehensive admin activity logs
- ✅ Dashboard with real-time statistics

### Moderation & Safety
- ✅ Automatic profanity detection (multi-language)
- ✅ Custom blocked words list
- ✅ 7-day auto-ban for high-severity profanity
- ✅ User banning with custom reasons
- ✅ User hiding functionality
- ✅ Ban duration tracking with expiry

## Installation

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 5.0
- NPM or Yarn
- Git

### Quick Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/NotJnshFire/kanxa-message.git
   cd kanxa-message
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Generate admin password hash**
   ```bash
   node -e "require('bcryptjs').hash('your_admin_password', 10, (err, hash) => console.log(hash))"
   ```

5. **Edit .env with your credentials**

6. **Start MongoDB**
   ```bash
   mongod
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Email sign-up
- `POST /signin` - Email sign-in
- `POST /google` - Google OAuth
- `GET /profile` - Get user profile (protected)
- `POST /logout` - Logout (protected)

### Messages (`/api/messages`)
- `GET /` - Get message history
- `POST /` - Send message
- `DELETE /:messageId` - Delete message

### Admin (`/api/admin`)
- `POST /login` - Admin login
- `GET /dashboard` - Admin dashboard
- `POST /ban-user` - Ban user
- `POST /unban-user` - Unban user
- `GET /users` - Get users list
- `GET /logs` - Get admin logs

### Moderation (`/api/moderation`)
- `GET /bans` - Get ban list
- `GET /hidden` - Get hidden users
- `GET /profanity-words` - Get blocked words

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /change-username` - Change username
- `GET /online-status` - Get online users

## Project Structure

```
kanxa-message/
├── server.js
├── config/
│   ├── database.js
│   └── constants.js
├── models/
│   ├── User.js
│   ├── Message.js
│   ├── Ban.js
│   ├── HiddenUser.js
│   ├── AdminLog.js
│   ├── ProfanityWord.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── messages.js
│   ├── admin.js
│   ├── users.js
│   └── moderation.js
├── middleware/
│   ├── auth.js
│   ├── adminAuth.js
│   ├── validation.js
│   ├── errorHandler.js
│   └── rateLimit.js
├── controllers/
│   ├── authController.js
│   ├── messageController.js
│   ├── adminController.js
│   ├── userController.js
│   └── moderationController.js
├── services/
│   ├── profanityFilter.js
│   └── socketService.js
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- JWT authentication with 7-day expiry
- Password hashing with bcryptjs
- Admin panel with 2-day lockout on failed attempts
- Rate limiting (100 requests per 15 min for general API)
- Profanity filter with multi-language support
- Input validation & sanitization
- CORS protection
- Admin activity logging
- User ban/hide functionality

## Socket.io Events

### Server Events
- `userOnline` - User came online
- `userOffline` - User went offline
- `messageReceived` - New message received
- `userTyping` - User is typing
- `messageDeletedNotification` - Message deleted
- `userBannedNotification` - User banned

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Environment Variables

See `.env.example` for all variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `ADMIN_PASSWORD_HASH` - Hashed admin password
- `SOCKET_CORS_ORIGIN` - Socket.io CORS origin

## Deployment

```bash
NODE_ENV=production npm start
```

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Use strong admin password hash
- [ ] Enable HTTPS/SSL
- [ ] Configure proper logging
- [ ] Set up database backups
- [ ] Configure monitoring & alerts

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

**Socket.io Issues**
- Verify SOCKET_CORS_ORIGIN matches frontend
- Check firewall/network restrictions
- Check browser console for errors

**Admin Panel Locked**
- Wait 2 days for lockout to expire
- Or regenerate admin password hash

## Security Best Practices

1. Never commit `.env` file
2. Use strong passwords
3. Always use HTTPS/SSL in production
4. Regular database backups
5. Monitor admin and access logs
6. Keep dependencies updated
7. Only allow trusted CORS origins
8. Comply with privacy regulations

## License

MIT License

## Author

**NotJnshFire**
- GitHub: [@NotJnshFire](https://github.com/NotJnshFire)

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2026-07-13
