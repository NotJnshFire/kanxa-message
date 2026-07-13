// App constants
export const CONSTANTS = {
  // Ban duration: 7 days in milliseconds
  BAN_DURATION: 7 * 24 * 60 * 60 * 1000,
  
  // Admin lockout: 2 days in milliseconds
  ADMIN_LOCKOUT_DURATION: 2 * 24 * 60 * 60 * 1000,
  
  // Admin max attempts
  ADMIN_MAX_ATTEMPTS: 3,
  
  // Username change cooldown: 5 months in milliseconds
  USERNAME_CHANGE_COOLDOWN: 5 * 30 * 24 * 60 * 60 * 1000,
  
  // Message limits
  MAX_MESSAGE_LENGTH: 5000,
  MAX_FILE_SIZE: 52428800, // 50MB
  
  // Allowed file types
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  ALLOWED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'],
  
  // Profanity languages
  PROFANITY_LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt'],
  
  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },
  
  // Ban reasons
  BAN_REASONS: {
    PROFANITY: 'Abusive language detected',
    SPAM: 'Spam content',
    HARASSMENT: 'User harassment',
    MANUAL: 'Manual ban by admin'
  },
  
  // Message types
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    REPLY: 'reply'
  }
};

export default CONSTANTS;
