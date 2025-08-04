// SecuritySystem.js - Advanced Security & Firewall System
// Based on industry standards from Tinder, OkCupid, and other dating apps

class SecuritySystem {
  constructor() {
    // Security levels
    this.securityLevels = {
      low: { threshold: 1, action: 'warn' },
      medium: { threshold: 3, action: 'restrict' },
      high: { threshold: 5, action: 'block' },
      critical: { threshold: 1, action: 'ban' }
    };

    // Threat detection patterns
    this.threatPatterns = {
      // Bot detection
      botPatterns: [
        'rapid_swiping',
        'repetitive_messages',
        'automated_behavior',
        'suspicious_timing'
      ],

      // Fraud detection
      fraudPatterns: [
        'fake_photos',
        'stolen_identity',
        'financial_scams',
        'romance_scams',
        'catfishing'
      ],

      // Harassment detection
      harassmentPatterns: [
        'inappropriate_messages',
        'threatening_language',
        'stalking_behavior',
        'unsolicited_content'
      ],

      // Age verification
      ageVerificationPatterns: [
        'underage_indicators',
        'suspicious_age',
        'mismatched_photos'
      ],

      // Location spoofing
      locationSpoofingPatterns: [
        'impossible_location_changes',
        'gps_spoofing',
        'vpn_detection'
      ]
    };

    // Rate limiting
    this.rateLimits = {
      likes: { max: 50, window: 3600000 }, // 50 likes per hour
      messages: { max: 20, window: 3600000 }, // 20 messages per hour
      reports: { max: 5, window: 86400000 }, // 5 reports per day
      photo_uploads: { max: 10, window: 3600000 }, // 10 photos per hour
      login_attempts: { max: 5, window: 900000 } // 5 login attempts per 15 minutes
    };

    // Encryption keys (in production, these would be server-side)
    this.encryptionKeys = {
      userData: 'isralove_user_encryption_key_2024',
      messages: 'isralove_messages_encryption_key_2024',
      photos: 'isralove_photos_encryption_key_2024'
    };

    // Security monitoring
    this.securityEvents = [];
    this.blockedIPs = new Set();
    this.suspiciousUsers = new Map();
    this.threatScores = new Map();

    this.initializeSecurity();
  }

  // Initialize security system
  initializeSecurity() {
    this.setupEventListeners();
    this.startSecurityMonitoring();
    this.loadSecurityData();
  }

  // Setup security event listeners
  setupEventListeners() {
    // Monitor user interactions
    document.addEventListener('click', (e) => this.monitorUserInteraction(e));
    document.addEventListener('keypress', (e) => this.monitorUserInteraction(e));
    
    // Monitor network requests
    this.interceptNetworkRequests();
    
    // Monitor storage access
    this.monitorStorageAccess();
  }

  // Monitor user interactions for suspicious behavior
  monitorUserInteraction(event) {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const interaction = {
      type: event.type,
      target: event.target.tagName,
      timestamp: Date.now(),
      userId: userId
    };

    this.analyzeUserBehavior(interaction);
  }

  // Analyze user behavior for threats
  analyzeUserBehavior(interaction) {
    const userId = interaction.userId;
    const userScore = this.threatScores.get(userId) || 0;

    // Check for rapid interactions (bot behavior)
    const recentInteractions = this.getRecentInteractions(userId, 1000); // Last 1 second
    if (recentInteractions.length > 10) {
      this.addThreatScore(userId, 'rapid_interactions', 2);
    }

    // Check for repetitive patterns
    if (this.detectRepetitivePatterns(userId)) {
      this.addThreatScore(userId, 'repetitive_patterns', 3);
    }

    // Update threat score
    this.threatScores.set(userId, userScore);
  }

  // Detect repetitive patterns
  detectRepetitivePatterns(userId) {
    const recentActions = this.getRecentActions(userId, 60000); // Last minute
    const actionCounts = {};
    
    recentActions.forEach(action => {
      actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
    });

    // If same action repeated more than 5 times in a minute
    return Object.values(actionCounts).some(count => count > 5);
  }

  // Add threat score
  addThreatScore(userId, reason, score) {
    const currentScore = this.threatScores.get(userId) || 0;
    const newScore = currentScore + score;
    this.threatScores.set(userId, newScore);

    // Log security event
    this.logSecurityEvent({
      type: 'threat_detected',
      userId: userId,
      reason: reason,
      score: score,
      totalScore: newScore,
      timestamp: Date.now()
    });

    // Take action based on score
    this.takeSecurityAction(userId, newScore);
  }

  // Take security action based on threat score
  takeSecurityAction(userId, score) {
    if (score >= this.securityLevels.critical.threshold) {
      this.banUser(userId, 'Critical threat score reached');
    } else if (score >= this.securityLevels.high.threshold) {
      this.blockUser(userId, 'High threat score reached');
    } else if (score >= this.securityLevels.medium.threshold) {
      this.restrictUser(userId, 'Medium threat score reached');
    } else if (score >= this.securityLevels.low.threshold) {
      this.warnUser(userId, 'Low threat score reached');
    }
  }

  // Rate limiting
  checkRateLimit(action, userId) {
    const limit = this.rateLimits[action];
    if (!limit) return true;

    const now = Date.now();
    const userActions = this.getUserActions(userId, action, now - limit.window);
    
    if (userActions.length >= limit.max) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        userId: userId,
        action: action,
        timestamp: now
      });
      return false;
    }

    // Record action
    this.recordUserAction(userId, action, now);
    return true;
  }

  // Encrypt sensitive data
  encryptData(data, type = 'userData') {
    try {
      const key = this.encryptionKeys[type];
      const dataString = JSON.stringify(data);
      
      // Simple encryption (in production, use proper encryption)
      let encrypted = '';
      for (let i = 0; i < dataString.length; i++) {
        encrypted += String.fromCharCode(dataString.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  // Decrypt sensitive data
  decryptData(encryptedData, type = 'userData') {
    try {
      const key = this.encryptionKeys[type];
      const decoded = atob(encryptedData);
      
      // Simple decryption (in production, use proper decryption)
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Photo verification system
  verifyPhoto(photoFile) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Check for signs of manipulation
        const manipulationScore = this.detectPhotoManipulation(data);
        
        // Check for inappropriate content
        const inappropriateScore = this.detectInappropriateContent(data);
        
        const verificationResult = {
          isVerified: manipulationScore < 0.7 && inappropriateScore < 0.8,
          manipulationScore: manipulationScore,
          inappropriateScore: inappropriateScore,
          confidence: Math.min(manipulationScore, inappropriateScore)
        };
        
        resolve(verificationResult);
      };
      
      img.src = URL.createObjectURL(photoFile);
    });
  }

  // Detect photo manipulation
  detectPhotoManipulation(imageData) {
    // Simple edge detection for manipulation detection
    let edgeCount = 0;
    let totalPixels = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Simple edge detection
      if (Math.abs(r - g) > 50 || Math.abs(r - b) > 50 || Math.abs(g - b) > 50) {
        edgeCount++;
      }
    }
    
    return edgeCount / totalPixels;
  }

  // Detect inappropriate content
  detectInappropriateContent(imageData) {
    // Simple skin tone detection (basic inappropriate content detection)
    let skinToneCount = 0;
    let totalPixels = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Simple skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinToneCount++;
      }
    }
    
    return skinToneCount / totalPixels;
  }

  // Message content analysis
  analyzeMessageContent(message) {
    const threats = [];
    
    // Check for inappropriate words
    const inappropriateWords = [
      'spam', 'scam', 'money', 'bitcoin', 'investment',
      'urgent', 'help', 'emergency', 'bank', 'transfer'
    ];
    
    inappropriateWords.forEach(word => {
      if (message.toLowerCase().includes(word)) {
        threats.push({ type: 'inappropriate_word', word: word, severity: 'medium' });
      }
    });
    
    // Check for suspicious patterns
    if (message.includes('http') || message.includes('www')) {
      threats.push({ type: 'suspicious_link', severity: 'high' });
    }
    
    if (message.length > 500) {
      threats.push({ type: 'message_too_long', severity: 'low' });
    }
    
    return {
      isSafe: threats.length === 0,
      threats: threats,
      riskScore: threats.reduce((score, threat) => {
        if (threat.severity === 'high') return score + 3;
        if (threat.severity === 'medium') return score + 2;
        return score + 1;
      }, 0)
    };
  }

  // Location verification
  verifyLocation(lat, lng) {
    // Check for impossible location changes
    const lastLocation = this.getLastUserLocation();
    if (lastLocation) {
      const distance = this.calculateDistance(
        lastLocation.lat, lastLocation.lng, lat, lng
      );
      
      // If user moved more than 1000km in 1 hour, suspicious
      const timeDiff = Date.now() - lastLocation.timestamp;
      if (distance > 1000 && timeDiff < 3600000) {
        return { isVerified: false, reason: 'impossible_location_change' };
      }
    }
    
    return { isVerified: true };
  }

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // User blocking system
  blockUser(userId, reason) {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    if (!blockedUsers.includes(userId)) {
      blockedUsers.push({
        userId: userId,
        reason: reason,
        timestamp: Date.now(),
        blockedBy: this.getCurrentUserId()
      });
      localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    }
  }

  // User banning system
  banUser(userId, reason) {
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    if (!bannedUsers.includes(userId)) {
      bannedUsers.push({
        userId: userId,
        reason: reason,
        timestamp: Date.now(),
        bannedBy: 'security_system'
      });
      localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
    }
  }

  // User restriction system
  restrictUser(userId, reason) {
    const restrictedUsers = JSON.parse(localStorage.getItem('restrictedUsers') || '[]');
    if (!restrictedUsers.includes(userId)) {
      restrictedUsers.push({
        userId: userId,
        reason: reason,
        timestamp: Date.now(),
        restrictions: ['limited_messaging', 'limited_likes']
      });
      localStorage.setItem('restrictedUsers', JSON.stringify(restrictedUsers));
    }
  }

  // User warning system
  warnUser(userId, reason) {
    const warnings = JSON.parse(localStorage.getItem('userWarnings') || '[]');
    warnings.push({
      userId: userId,
      reason: reason,
      timestamp: Date.now()
    });
    localStorage.setItem('userWarnings', JSON.stringify(warnings));
  }

  // Check if user is blocked/banned
  isUserBlocked(userId) {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    
    return blockedUsers.some(user => user.userId === userId) ||
           bannedUsers.some(user => user.userId === userId);
  }

  // Log security events
  logSecurityEvent(event) {
    this.securityEvents.push(event);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
    
    // Save to localStorage
    localStorage.setItem('securityEvents', JSON.stringify(this.securityEvents));
  }

  // Get security statistics
  getSecurityStats() {
    const now = Date.now();
    const last24h = now - 86400000;
    
    const recentEvents = this.securityEvents.filter(event => event.timestamp > last24h);
    
    return {
      totalEvents: this.securityEvents.length,
      events24h: recentEvents.length,
      blockedUsers: JSON.parse(localStorage.getItem('blockedUsers') || '[]').length,
      bannedUsers: JSON.parse(localStorage.getItem('bannedUsers') || '[]').length,
      threatScores: this.threatScores.size,
      averageThreatScore: Array.from(this.threatScores.values()).reduce((a, b) => a + b, 0) / this.threatScores.size || 0
    };
  }

  // Start security monitoring
  startSecurityMonitoring() {
    setInterval(() => {
      this.performSecurityScan();
    }, 300000); // Every 5 minutes
  }

  // Perform security scan
  performSecurityScan() {
    // Scan for suspicious patterns
    this.scanForSuspiciousPatterns();
    
    // Clean up old data
    this.cleanupOldData();
    
    // Update security stats
    this.updateSecurityStats();
  }

  // Scan for suspicious patterns
  scanForSuspiciousPatterns() {
    const users = this.getAllUsers();
    users.forEach(user => {
      const score = this.calculateUserThreatScore(user);
      if (score > 5) {
        this.addThreatScore(user.id, 'suspicious_pattern_detected', score);
      }
    });
  }

  // Calculate user threat score
  calculateUserThreatScore(user) {
    let score = 0;
    
    // Check for suspicious behavior
    const recentActions = this.getRecentActions(user.id, 3600000); // Last hour
    if (recentActions.length > 100) score += 3;
    
    // Check for inappropriate content
    if (user.bio && this.analyzeMessageContent(user.bio).riskScore > 5) score += 2;
    
    // Check for fake photos
    if (user.photos && user.photos.length > 0) {
      // This would be implemented with actual photo analysis
      score += 1;
    }
    
    return score;
  }

  // Get current user ID
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id;
  }

  // Get all users
  getAllUsers() {
    // This would be implemented with actual user data
    return [];
  }

  // Get recent actions
  getRecentActions(userId, timeWindow) {
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    const now = Date.now();
    return actions.filter(action => 
      action.userId === userId && 
      action.timestamp > now - timeWindow
    );
  }

  // Get recent interactions
  getRecentInteractions(userId, timeWindow) {
    const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    const now = Date.now();
    return interactions.filter(interaction => 
      interaction.userId === userId && 
      interaction.timestamp > now - timeWindow
    );
  }

  // Record user action
  recordUserAction(userId, action, timestamp) {
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    actions.push({ userId, action, timestamp });
    localStorage.setItem('userActions', JSON.stringify(actions));
  }

  // Get user actions
  getUserActions(userId, action, timeWindow) {
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    const now = Date.now();
    return actions.filter(a => 
      a.userId === userId && 
      a.action === action && 
      a.timestamp > now - timeWindow
    );
  }

  // Get last user location
  getLastUserLocation() {
    return JSON.parse(localStorage.getItem('lastUserLocation') || 'null');
  }

  // Intercept network requests
  interceptNetworkRequests() {
    // This would be implemented with actual network monitoring
    console.log('Network monitoring enabled');
  }

  // Monitor storage access
  monitorStorageAccess() {
    // This would be implemented with actual storage monitoring
    console.log('Storage monitoring enabled');
  }

  // Load security data
  loadSecurityData() {
    this.securityEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    this.threatScores = new Map(JSON.parse(localStorage.getItem('threatScores') || '[]'));
  }

  // Cleanup old data
  cleanupOldData() {
    const now = Date.now();
    const oneWeekAgo = now - 604800000;
    
    // Clean old security events
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > oneWeekAgo);
    localStorage.setItem('securityEvents', JSON.stringify(this.securityEvents));
    
    // Clean old user actions
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    const recentActions = actions.filter(action => action.timestamp > oneWeekAgo);
    localStorage.setItem('userActions', JSON.stringify(recentActions));
  }

  // Update security stats
  updateSecurityStats() {
    const stats = this.getSecurityStats();
    localStorage.setItem('securityStats', JSON.stringify(stats));
  }
}

// Export security system
export const createSecuritySystem = () => new SecuritySystem();

// Export security functions
export const encryptUserData = (data) => {
  const security = new SecuritySystem();
  return security.encryptData(data, 'userData');
};

export const decryptUserData = (encryptedData) => {
  const security = new SecuritySystem();
  return security.decryptData(encryptedData, 'userData');
};

export const analyzeMessage = (message) => {
  const security = new SecuritySystem();
  return security.analyzeMessageContent(message);
};

export const verifyUserPhoto = (photoFile) => {
  const security = new SecuritySystem();
  return security.verifyPhoto(photoFile);
};

export const checkRateLimit = (action, userId) => {
  const security = new SecuritySystem();
  return security.checkRateLimit(action, userId);
}; 