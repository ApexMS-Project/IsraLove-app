// ThreatIntelligenceSystem.js - Advanced Threat Intelligence & Analysis System

class ThreatIntelligenceSystem {
  constructor() {
    // Threat intelligence database
    this.threatDatabase = {
      knownThreats: new Map(),
      threatPatterns: new Map(),
      threatIndicators: new Map(),
      threatHistory: []
    };
    
    // Real-time threat monitoring
    this.realTimeMonitoring = {
      activeThreats: new Map(),
      threatAlerts: new Map(),
      threatScores: new Map(),
      lastUpdate: null
    };
    
    // Machine learning models (simulated)
    this.mlModels = {
      behaviorAnalysis: null,
      contentAnalysis: null,
      networkAnalysis: null,
      locationAnalysis: null
    };
    
    // Threat categories
    this.threatCategories = {
      bot_activity: {
        name: 'פעילות בוט',
        severity: 'high',
        indicators: ['rapid_actions', 'repetitive_patterns', 'inhuman_timing'],
        mitigation: ['rate_limiting', 'captcha', 'behavior_analysis']
      },
      fraud: {
        name: 'הונאה',
        severity: 'critical',
        indicators: ['fake_photos', 'stolen_identity', 'financial_scams'],
        mitigation: ['photo_verification', 'identity_check', 'fraud_detection']
      },
      harassment: {
        name: 'הטרדה',
        severity: 'high',
        indicators: ['inappropriate_messages', 'threatening_language', 'stalking'],
        mitigation: ['content_filtering', 'user_blocking', 'reporting_system']
      },
      underage: {
        name: 'קטינים',
        severity: 'critical',
        indicators: ['suspicious_age', 'underage_indicators', 'mismatched_photos'],
        mitigation: ['age_verification', 'photo_analysis', 'reporting']
      },
      spam: {
        name: 'ספאם',
        severity: 'medium',
        indicators: ['repetitive_messages', 'suspicious_links', 'commercial_content'],
        mitigation: ['content_filtering', 'rate_limiting', 'spam_detection']
      },
      location_spoofing: {
        name: 'זיוף מיקום',
        severity: 'medium',
        indicators: ['impossible_movement', 'vpn_detection', 'location_mismatch'],
        mitigation: ['location_verification', 'gps_analysis', 'behavior_tracking']
      }
    };
    
    this.initializeThreatIntelligence();
  }

  // Initialize threat intelligence system
  initializeThreatIntelligence() {
    this.loadThreatDatabase();
    this.initializeMLModels();
    this.startRealTimeMonitoring();
    this.setupThreatAlerts();
  }

  // Load threat database
  loadThreatDatabase() {
    // Load known threats from localStorage
    const knownThreats = JSON.parse(localStorage.getItem('knownThreats') || '[]');
    knownThreats.forEach(threat => {
      this.threatDatabase.knownThreats.set(threat.id, threat);
    });
    
    // Load threat patterns
    const threatPatterns = JSON.parse(localStorage.getItem('threatPatterns') || '[]');
    threatPatterns.forEach(pattern => {
      this.threatDatabase.threatPatterns.set(pattern.id, pattern);
    });
    
    // Load threat indicators
    const threatIndicators = JSON.parse(localStorage.getItem('threatIndicators') || '[]');
    threatIndicators.forEach(indicator => {
      this.threatDatabase.threatIndicators.set(indicator.id, indicator);
    });
  }

  // Initialize machine learning models
  initializeMLModels() {
    // Simulate ML model initialization
    this.mlModels.behaviorAnalysis = {
      model: 'behavior_analysis_v1.0',
      accuracy: 0.95,
      lastTrained: Date.now()
    };
    
    this.mlModels.contentAnalysis = {
      model: 'content_analysis_v1.0',
      accuracy: 0.92,
      lastTrained: Date.now()
    };
    
    this.mlModels.networkAnalysis = {
      model: 'network_analysis_v1.0',
      accuracy: 0.88,
      lastTrained: Date.now()
    };
    
    this.mlModels.locationAnalysis = {
      model: 'location_analysis_v1.0',
      accuracy: 0.90,
      lastTrained: Date.now()
    };
  }

  // Start real-time monitoring
  startRealTimeMonitoring() {
    setInterval(() => {
      this.performThreatScan();
    }, 15000); // Every 15 seconds
    
    setInterval(() => {
      this.updateThreatIntelligence();
    }, 60000); // Every minute
  }

  // Perform threat scan
  performThreatScan() {
    const currentUser = this.getCurrentUserId();
    if (!currentUser) return;
    
    // Scan for different types of threats
    const threats = [];
    
    // Check for bot activity
    const botThreats = this.detectBotActivity(currentUser);
    threats.push(...botThreats);
    
    // Check for fraud
    const fraudThreats = this.detectFraud(currentUser);
    threats.push(...fraudThreats);
    
    // Check for harassment
    const harassmentThreats = this.detectHarassment(currentUser);
    threats.push(...harassmentThreats);
    
    // Check for underage activity
    const underageThreats = this.detectUnderageActivity(currentUser);
    threats.push(...underageThreats);
    
    // Check for spam
    const spamThreats = this.detectSpam(currentUser);
    threats.push(...spamThreats);
    
    // Check for location spoofing
    const locationThreats = this.detectLocationSpoofing(currentUser);
    threats.push(...locationThreats);
    
    // Process detected threats
    if (threats.length > 0) {
      this.processThreats(currentUser, threats);
    }
  }

  // Detect bot activity
  detectBotActivity(userId) {
    const threats = [];
    const recentActions = this.getRecentActions(userId, 60000); // Last minute
    
    // Check for rapid actions
    if (recentActions.length > 50) {
      threats.push({
        type: 'bot_activity',
        subtype: 'rapid_actions',
        severity: 'high',
        confidence: 0.85,
        evidence: { actionCount: recentActions.length }
      });
    }
    
    // Check for repetitive patterns
    const patterns = this.analyzeActionPatterns(recentActions);
    if (patterns.repetitiveScore > 0.8) {
      threats.push({
        type: 'bot_activity',
        subtype: 'repetitive_patterns',
        severity: 'medium',
        confidence: 0.75,
        evidence: { repetitiveScore: patterns.repetitiveScore }
      });
    }
    
    // Check for inhuman timing
    if (this.detectInhumanTiming(recentActions)) {
      threats.push({
        type: 'bot_activity',
        subtype: 'inhuman_timing',
        severity: 'high',
        confidence: 0.90,
        evidence: { timingAnalysis: 'inhuman_patterns_detected' }
      });
    }
    
    return threats;
  }

  // Detect fraud
  detectFraud(userId) {
    const threats = [];
    const userData = this.getUserData(userId);
    
    // Check for fake photos
    if (userData.photos) {
      const photoAnalysis = this.analyzePhotos(userData.photos);
      if (photoAnalysis.fakePhotoScore > 0.7) {
        threats.push({
          type: 'fraud',
          subtype: 'fake_photos',
          severity: 'high',
          confidence: photoAnalysis.fakePhotoScore,
          evidence: { photoAnalysis }
        });
      }
    }
    
    // Check for stolen identity
    if (this.detectStolenIdentity(userData)) {
      threats.push({
        type: 'fraud',
        subtype: 'stolen_identity',
        severity: 'critical',
        confidence: 0.85,
        evidence: { identityCheck: 'suspicious_patterns' }
      });
    }
    
    // Check for financial scams
    const messages = this.getUserMessages(userId);
    const scamIndicators = this.detectScamIndicators(messages);
    if (scamIndicators.length > 0) {
      threats.push({
        type: 'fraud',
        subtype: 'financial_scams',
        severity: 'critical',
        confidence: 0.80,
        evidence: { scamIndicators }
      });
    }
    
    return threats;
  }

  // Detect harassment
  detectHarassment(userId) {
    const threats = [];
    const messages = this.getUserMessages(userId);
    
    // Check for inappropriate messages
    const inappropriateMessages = this.detectInappropriateContent(messages);
    if (inappropriateMessages.length > 0) {
      threats.push({
        type: 'harassment',
        subtype: 'inappropriate_messages',
        severity: 'high',
        confidence: 0.85,
        evidence: { inappropriateMessages }
      });
    }
    
    // Check for threatening language
    const threateningMessages = this.detectThreateningLanguage(messages);
    if (threateningMessages.length > 0) {
      threats.push({
        type: 'harassment',
        subtype: 'threatening_language',
        severity: 'critical',
        confidence: 0.90,
        evidence: { threateningMessages }
      });
    }
    
    // Check for stalking behavior
    if (this.detectStalkingBehavior(userId)) {
      threats.push({
        type: 'harassment',
        subtype: 'stalking_behavior',
        severity: 'high',
        confidence: 0.80,
        evidence: { behaviorAnalysis: 'stalking_patterns' }
      });
    }
    
    return threats;
  }

  // Detect underage activity
  detectUnderageActivity(userId) {
    const threats = [];
    const userData = this.getUserData(userId);
    
    // Check for suspicious age
    if (userData.age && userData.age < 18) {
      threats.push({
        type: 'underage',
        subtype: 'suspicious_age',
        severity: 'critical',
        confidence: 0.95,
        evidence: { age: userData.age }
      });
    }
    
    // Check for underage indicators in photos
    if (userData.photos) {
      const ageAnalysis = this.analyzeAgeInPhotos(userData.photos);
      if (ageAnalysis.underageScore > 0.7) {
        threats.push({
          type: 'underage',
          subtype: 'underage_indicators',
          severity: 'critical',
          confidence: ageAnalysis.underageScore,
          evidence: { ageAnalysis }
        });
      }
    }
    
    return threats;
  }

  // Detect spam
  detectSpam(userId) {
    const threats = [];
    const messages = this.getUserMessages(userId);
    
    // Check for repetitive messages
    const repetitiveMessages = this.detectRepetitiveMessages(messages);
    if (repetitiveMessages.length > 0) {
      threats.push({
        type: 'spam',
        subtype: 'repetitive_messages',
        severity: 'medium',
        confidence: 0.75,
        evidence: { repetitiveMessages }
      });
    }
    
    // Check for suspicious links
    const suspiciousLinks = this.detectSuspiciousLinks(messages);
    if (suspiciousLinks.length > 0) {
      threats.push({
        type: 'spam',
        subtype: 'suspicious_links',
        severity: 'medium',
        confidence: 0.80,
        evidence: { suspiciousLinks }
      });
    }
    
    // Check for commercial content
    const commercialContent = this.detectCommercialContent(messages);
    if (commercialContent.length > 0) {
      threats.push({
        type: 'spam',
        subtype: 'commercial_content',
        severity: 'low',
        confidence: 0.70,
        evidence: { commercialContent }
      });
    }
    
    return threats;
  }

  // Detect location spoofing
  detectLocationSpoofing(userId) {
    const threats = [];
    const locationData = this.getUserLocationData(userId);
    
    // Check for impossible movement
    if (this.detectImpossibleMovement(locationData)) {
      threats.push({
        type: 'location_spoofing',
        subtype: 'impossible_movement',
        severity: 'medium',
        confidence: 0.85,
        evidence: { movementAnalysis: 'impossible_patterns' }
      });
    }
    
    // Check for VPN detection
    if (this.detectVPNUsage(locationData)) {
      threats.push({
        type: 'location_spoofing',
        subtype: 'vpn_detection',
        severity: 'low',
        confidence: 0.70,
        evidence: { vpnDetection: 'suspicious_connection' }
      });
    }
    
    return threats;
  }

  // Process detected threats
  processThreats(userId, threats) {
    threats.forEach(threat => {
      // Add to active threats
      this.realTimeMonitoring.activeThreats.set(threat.type, threat);
      
      // Calculate threat score
      const threatScore = this.calculateThreatScore(threat);
      this.realTimeMonitoring.threatScores.set(userId, threatScore);
      
      // Generate alert if needed
      if (threatScore > 0.7) {
        this.generateThreatAlert(userId, threat);
      }
      
      // Log threat
      this.logThreat(userId, threat);
    });
  }

  // Calculate threat score
  calculateThreatScore(threat) {
    let score = 0;
    
    // Base score from severity
    const severityScores = {
      'critical': 1.0,
      'high': 0.8,
      'medium': 0.6,
      'low': 0.4
    };
    
    score += severityScores[threat.severity] || 0.5;
    
    // Add confidence score
    score += threat.confidence * 0.3;
    
    // Add evidence weight
    if (threat.evidence) {
      score += 0.2;
    }
    
    return Math.min(1.0, score);
  }

  // Generate threat alert
  generateThreatAlert(userId, threat) {
    const alert = {
      id: Date.now().toString(),
      userId: userId,
      threat: threat,
      timestamp: Date.now(),
      status: 'active',
      priority: threat.severity === 'critical' ? 'high' : 'medium'
    };
    
    this.realTimeMonitoring.threatAlerts.set(alert.id, alert);
    
    // Notify security system
    this.notifySecuritySystem(alert);
  }

  // Setup threat alerts
  setupThreatAlerts() {
    // Monitor for critical threats
    setInterval(() => {
      this.checkCriticalThreats();
    }, 30000); // Every 30 seconds
  }

  // Check for critical threats
  checkCriticalThreats() {
    const criticalThreats = Array.from(this.realTimeMonitoring.activeThreats.values())
      .filter(threat => threat.severity === 'critical');
    
    if (criticalThreats.length > 0) {
      this.handleCriticalThreats(criticalThreats);
    }
  }

  // Handle critical threats
  handleCriticalThreats(threats) {
    threats.forEach(threat => {
      // Immediate action for critical threats
      this.takeImmediateAction(threat);
      
      // Notify emergency contacts
      this.notifyEmergencyContacts(threat);
      
      // Log critical threat
      this.logCriticalThreat(threat);
    });
  }

  // Take immediate action
  takeImmediateAction(threat) {
    const actions = {
      'fraud': () => this.blockUser(threat.userId, 'Critical fraud detected'),
      'underage': () => this.reportToAuthorities(threat),
      'harassment': () => this.activateEmergencyMode(threat),
      'bot_activity': () => this.rateLimitUser(threat.userId),
      'spam': () => this.warnUser(threat.userId),
      'location_spoofing': () => this.flagSuspiciousUser(threat.userId)
    };
    
    const action = actions[threat.type];
    if (action) {
      action();
    }
  }

  // Update threat intelligence
  updateThreatIntelligence() {
    // Update threat patterns
    this.updateThreatPatterns();
    
    // Update threat indicators
    this.updateThreatIndicators();
    
    // Update ML models
    this.updateMLModels();
    
    // Clean old data
    this.cleanOldThreatData();
  }

  // Update threat patterns
  updateThreatPatterns() {
    const recentThreats = this.threatDatabase.threatHistory
      .filter(threat => threat.timestamp > Date.now() - 86400000); // Last 24 hours
    
    // Analyze patterns in recent threats
    const patterns = this.analyzeThreatPatterns(recentThreats);
    
    // Update pattern database
    patterns.forEach(pattern => {
      this.threatDatabase.threatPatterns.set(pattern.id, pattern);
    });
  }

  // Update threat indicators
  updateThreatIndicators() {
    // Update indicators based on recent threats
    const indicators = this.generateThreatIndicators();
    
    indicators.forEach(indicator => {
      this.threatDatabase.threatIndicators.set(indicator.id, indicator);
    });
  }

  // Update ML models
  updateMLModels() {
    // Simulate ML model updates
    Object.keys(this.mlModels).forEach(modelKey => {
      const model = this.mlModels[modelKey];
      model.lastTrained = Date.now();
      model.accuracy = Math.min(0.99, model.accuracy + 0.001); // Slight improvement
    });
  }

  // Utility functions
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id;
  }

  getRecentActions(userId, timeWindow) {
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    const now = Date.now();
    return actions.filter(action => 
      action.userId === userId && 
      action.timestamp > now - timeWindow
    );
  }

  getUserData(userId) {
    return JSON.parse(localStorage.getItem(`user_${userId}`) || '{}');
  }

  getUserMessages(userId) {
    return JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
  }

  getUserLocationData(userId) {
    return JSON.parse(localStorage.getItem(`location_${userId}`) || '[]');
  }

  logThreat(userId, threat) {
    this.threatDatabase.threatHistory.push({
      userId: userId,
      threat: threat,
      timestamp: Date.now()
    });
    
    // Keep only last 1000 threats
    if (this.threatDatabase.threatHistory.length > 1000) {
      this.threatDatabase.threatHistory = this.threatDatabase.threatHistory.slice(-1000);
    }
    
    localStorage.setItem('threatHistory', JSON.stringify(this.threatDatabase.threatHistory));
  }

  logCriticalThreat(threat) {
    const criticalThreats = JSON.parse(localStorage.getItem('criticalThreats') || '[]');
    criticalThreats.push({
      ...threat,
      timestamp: Date.now()
    });
    localStorage.setItem('criticalThreats', JSON.stringify(criticalThreats));
  }

  notifySecuritySystem(alert) {
    // In real app, this would notify the security system
    console.log('Security alert:', alert);
  }

  notifyEmergencyContacts(threat) {
    // In real app, this would notify emergency contacts
    console.log('Emergency contact notified:', threat);
  }

  blockUser(userId, reason) {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    blockedUsers.push({
      userId: userId,
      reason: reason,
      timestamp: Date.now()
    });
    localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
  }

  reportToAuthorities(threat) {
    // In real app, this would report to authorities
    console.log('Reported to authorities:', threat);
  }

  activateEmergencyMode(threat) {
    // In real app, this would activate emergency mode
    console.log('Emergency mode activated:', threat);
  }

  rateLimitUser(userId) {
    // In real app, this would rate limit the user
    console.log('User rate limited:', userId);
  }

  warnUser(userId) {
    // In real app, this would warn the user
    console.log('User warned:', userId);
  }

  flagSuspiciousUser(userId) {
    const suspiciousUsers = JSON.parse(localStorage.getItem('suspiciousUsers') || '[]');
    suspiciousUsers.push({
      userId: userId,
      timestamp: Date.now(),
      reason: 'location_spoofing'
    });
    localStorage.setItem('suspiciousUsers', JSON.stringify(suspiciousUsers));
  }

  cleanOldThreatData() {
    const oneWeekAgo = Date.now() - 604800000;
    
    // Clean old threat history
    this.threatDatabase.threatHistory = this.threatDatabase.threatHistory
      .filter(threat => threat.timestamp > oneWeekAgo);
    
    // Clean old alerts
    const alerts = Array.from(this.realTimeMonitoring.threatAlerts.values());
    const recentAlerts = alerts.filter(alert => alert.timestamp > oneWeekAgo);
    this.realTimeMonitoring.threatAlerts.clear();
    recentAlerts.forEach(alert => {
      this.realTimeMonitoring.threatAlerts.set(alert.id, alert);
    });
  }

  // Analysis helper functions (simplified for demo)
  analyzeActionPatterns(actions) {
    // Simplified pattern analysis
    const actionTypes = actions.map(a => a.type);
    const uniqueTypes = new Set(actionTypes);
    
    return {
      repetitiveScore: 1 - (uniqueTypes.size / actionTypes.length),
      patternType: uniqueTypes.size < actionTypes.length * 0.3 ? 'repetitive' : 'normal'
    };
  }

  detectInhumanTiming(actions) {
    // Simplified inhuman timing detection
    if (actions.length < 3) return false;
    
    const timings = actions.map((a, i) => {
      if (i === 0) return 0;
      return a.timestamp - actions[i-1].timestamp;
    }).slice(1);
    
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    return avgTiming < 100; // Less than 100ms between actions
  }

  analyzePhotos(photos) {
    // Simplified photo analysis
    return {
      fakePhotoScore: Math.random() * 0.3, // 0-30% chance of fake
      qualityScore: 0.8,
      ageEstimate: 25
    };
  }

  detectStolenIdentity(userData) {
    // Simplified identity theft detection
    return Math.random() < 0.1; // 10% chance
  }

  detectScamIndicators(messages) {
    const scamKeywords = ['money', 'bitcoin', 'investment', 'urgent', 'help'];
    return messages.filter(msg => 
      scamKeywords.some(keyword => msg.text.toLowerCase().includes(keyword))
    );
  }

  detectInappropriateContent(messages) {
    const inappropriateKeywords = ['spam', 'inappropriate', 'offensive'];
    return messages.filter(msg => 
      inappropriateKeywords.some(keyword => msg.text.toLowerCase().includes(keyword))
    );
  }

  detectThreateningLanguage(messages) {
    const threateningKeywords = ['threat', 'kill', 'hurt', 'danger'];
    return messages.filter(msg => 
      threateningKeywords.some(keyword => msg.text.toLowerCase().includes(keyword))
    );
  }

  detectStalkingBehavior(userId) {
    // Simplified stalking detection
    return Math.random() < 0.05; // 5% chance
  }

  analyzeAgeInPhotos(photos) {
    // Simplified age analysis
    return {
      underageScore: Math.random() * 0.2, // 0-20% chance
      ageEstimate: 22
    };
  }

  detectRepetitiveMessages(messages) {
    // Simplified repetitive message detection
    const messageTexts = messages.map(m => m.text);
    const uniqueTexts = new Set(messageTexts);
    return messageTexts.length > uniqueTexts.size * 2;
  }

  detectSuspiciousLinks(messages) {
    const linkPattern = /https?:\/\/[^\s]+/g;
    return messages.filter(msg => linkPattern.test(msg.text));
  }

  detectCommercialContent(messages) {
    const commercialKeywords = ['buy', 'sell', 'offer', 'deal', 'discount'];
    return messages.filter(msg => 
      commercialKeywords.some(keyword => msg.text.toLowerCase().includes(keyword))
    );
  }

  detectImpossibleMovement(locationData) {
    // Simplified impossible movement detection
    return Math.random() < 0.1; // 10% chance
  }

  detectVPNUsage(locationData) {
    // Simplified VPN detection
    return Math.random() < 0.15; // 15% chance
  }

  analyzeThreatPatterns(threats) {
    // Simplified pattern analysis
    return threats.map(threat => ({
      id: `pattern_${Date.now()}`,
      type: threat.threat.type,
      frequency: 1,
      severity: threat.threat.severity
    }));
  }

  generateThreatIndicators() {
    // Simplified indicator generation
    return [
      {
        id: `indicator_${Date.now()}`,
        type: 'behavior',
        pattern: 'rapid_actions',
        confidence: 0.8
      }
    ];
  }
}

// Export the ThreatIntelligenceSystem
export default ThreatIntelligenceSystem;

// Export utility functions
export const createThreatIntelligenceSystem = () => new ThreatIntelligenceSystem();

export const getThreatLevel = () => {
  const threatSystem = new ThreatIntelligenceSystem();
  return {
    level: 'low',
    activeThreats: 0,
    lastScan: Date.now(),
    confidence: 0.95
  };
}; 