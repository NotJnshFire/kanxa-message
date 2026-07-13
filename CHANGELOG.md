# Changelog

## [1.0.0] - 2026-07-13

### Initial Release

#### Features Added
- Real-time messaging with Socket.io
- User authentication (Email/Password and Google OAuth)
- JWT token-based authorization
- Message management (send, delete, reply)
- Admin panel with dashboard
- User ban/unban functionality
- User hide/unhide functionality
- Profanity filtering and detection
- Admin activity logging
- Rate limiting on all endpoints
- CORS protection
- File upload support
- Online/offline status tracking
- Message search functionality

#### Security
- Password hashing with bcryptjs
- JWT authentication with 7-day expiry
- Rate limiting (100 requests/15 minutes)
- Admin authentication with password protection
- Validation and sanitization middleware
- CORS configuration
- Activity logging

#### Documentation
- README with quick start
- API documentation
- Installation guide
- Security policy
- Contributing guidelines

#### Project Structure
- Express.js server setup
- MongoDB integration with Mongoose
- Socket.io real-time events
- Modular controller architecture
- Middleware for authentication and validation
- Service layer for business logic

---

## Upcoming Features

- [ ] Frontend application (React/Vue/Angular)
- [ ] Mobile application (React Native/Flutter)
- [ ] Video and audio calling
- [ ] End-to-end encryption
- [ ] Message reactions and emojis
- [ ] User roles and permissions system
- [ ] Advanced search with filters
- [ ] User analytics dashboard
- [ ] Admin dashboard UI
- [ ] Multi-language support

---

## Version History

### Development Timeline
- 2026-07-13: v1.0.0 - Initial release

---

## Bug Fixes & Updates

Bug reports and feature requests should be submitted via GitHub Issues.

For security vulnerabilities, please follow the responsible disclosure process outlined in SECURITY.md.
