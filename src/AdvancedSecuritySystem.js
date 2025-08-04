// AdvancedSecuritySystem.js - Comprehensive Security & Protection System
// Integrates all security components with advanced threat detection

import SecuritySystem from './SecuritySystem.js';
import SafetySystem from './SafetySystem.js';
import ContentModeration from './ContentModeration.js';

class AdvancedSecuritySystem {
  constructor() {
    // Initialize all security subsystems
    this.securitySystem = new SecuritySystem();
    this.safetySystem = new SafetySystem();
    this.contentModerator = new ContentModeration();
    
    // Advanced threat detection
    this.threatIntelligence = {
      knownMaliciousIPs: new Set(),
      suspiciousUserPatterns: new Map(),
      realTimeThreats: new Map(),
      threatHistory: []
    };
    
    // AI-powered detection
    this.aiDetection = {
      behaviorAnalysis: new Map(),
      conversationAnalysis: new Map(),
      photoAnalysis: new Map(),
      locationAnalysis: new Map()
    };
    
    // Emergency response system
    this.emergencySystem = {
      activeAlerts: new Map(),
      emergencyContacts: new Map(),
      panicMode: false,
      lastEmergencyCheck: null
    };
    
    // Privacy protection
    this.privacyProtection = {
      dataEncryption: true,
      locationMasking: true,
      photoWatermarking: true,
      messageEncryption: true
    };
    
    this.initializeAdvancedSecurity();
  }

  // Initialize advanced security system
  initializeAdvancedSecurity() {
    this.setupAdvancedMonitoring();
    this.initializeAI();
    this.setupEmergencyProtocols();
    this.startRealTimeProtection();
  }

  // Setup advanced monitoring
  setupAdvancedMonitoring() {
    // Monitor all user interactions
    document.addEventListener('click', (e) => this.analyzeInteraction(e));
    document.addEventListener('keypress', (e) => this.analyzeInteraction(e));
    document.addEventListener('scroll', (e) => this.analyzeInteraction(e));
    
    // Monitor network activity
    this.interceptNetworkActivity();
    
    // Monitor storage access
    this.monitorDataAccess();
    
    // Monitor location changes
    this.monitorLocationChanges();
  }

  // Analyze user interaction for threats
  analyzeInteraction(event) {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const interaction = {
      type: event.type,
      target: event.target.tagName,
      timestamp: Date.now(),
      userId: userId,
      location: this.getCurrentLocation(),
      sessionData: this.getSessionData()
    };

    // Real-time threat analysis
    this.performRealTimeAnalysis(interaction);
  }

  // Perform real-time threat analysis
  performRealTimeAnalysis(interaction) {
    const threats = [];
    
    // Check for bot-like behavior
    if (this.detectBotBehavior(interaction)) {
      threats.push({ type: 'bot_behavior', severity: 'high' });
    }
    
    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(interaction)) {
      threats.push({ type: 'suspicious_pattern', severity: 'medium' });
    }
    
    // Check for rapid actions
    if (this.detectRapidActions(interaction)) {
      threats.push({ type: 'rapid_actions', severity: 'medium' });
    }
    
    // Take immediate action if threats detected
    if (threats.length > 0) {
      this.handleImmediateThreats(interaction.userId, threats);
    }
  }

  // Detect bot-like behavior
  detectBotBehavior(interaction) {
    const recentInteractions = this.getRecentInteractions(interaction.userId, 1000);
    
    // Check for too many interactions in short time
    if (recentInteractions.length > 20) return true;
    
    // Check for repetitive patterns
    const patterns = this.analyzeInteractionPatterns(recentInteractions);
    if (patterns.repetitiveScore > 0.8) return true;
    
    // Check for inhuman timing
    if (this.detectInhumanTiming(recentInteractions)) return true;
    
    return false;
  }

  // Detect suspicious patterns
  detectSuspiciousPatterns(interaction) {
    // Check for attempts to access sensitive areas
    const sensitiveElements = ['admin', 'settings', 'security', 'data'];
    const targetText = interaction.target?.toLowerCase() || '';
    
    if (sensitiveElements.some(element => targetText.includes(element))) {
      return true;
    }
    
    // Check for unusual navigation patterns
    if (this.detectUnusualNavigation(interaction)) {
      return true;
    }
    
    return false;
  }

  // Detect rapid actions
  detectRapidActions(interaction) {
    const recentActions = this.getRecentActions(interaction.userId, 5000); // 5 seconds
    return recentActions.length > 10;
  }

  // Handle immediate threats
  handleImmediateThreats(userId, threats) {
    const totalSeverity = threats.reduce((sum, threat) => {
      if (threat.severity === 'high') return sum + 3;
      if (threat.severity === 'medium') return sum + 2;
      return sum + 1;
    }, 0);
    
    if (totalSeverity >= 5) {
      this.activateEmergencyMode(userId, threats);
    } else if (totalSeverity >= 3) {
      this.issueWarning(userId, threats);
    }
  }

  // Activate emergency mode
  activateEmergencyMode(userId, threats) {
    this.emergencySystem.panicMode = true;
    
    // Log emergency
    this.logEmergencyEvent({
      userId: userId,
      threats: threats,
      timestamp: Date.now(),
      action: 'emergency_mode_activated'
    });
    
    // Notify security team (in real app)
    this.notifySecurityTeam(userId, threats);
    
    // Restrict user access
    this.restrictUserAccess(userId);
  }

  // Issue warning to user
  issueWarning(userId, threats) {
    const warning = {
      userId: userId,
      threats: threats,
      timestamp: Date.now(),
      message: 'זוהתה פעילות חשודה - אנא המשך להתנהג כראוי'
    };
    
    this.addSecurityWarning(warning);
  }

  // Initialize AI detection
  initializeAI() {
    // Initialize behavior analysis
    this.aiDetection.behaviorAnalysis = new Map();
    
    // Initialize conversation analysis
    this.aiDetection.conversationAnalysis = new Map();
    
    // Initialize photo analysis
    this.aiDetection.photoAnalysis = new Map();
    
    // Start AI monitoring
    this.startAIMonitoring();
  }

  // Start AI monitoring
  startAIMonitoring() {
    setInterval(() => {
      this.performAIAnalysis();
    }, 30000); // Every 30 seconds
  }

  // Perform AI analysis
  performAIAnalysis() {
    // Analyze user behavior patterns
    this.analyzeBehaviorPatterns();
    
    // Analyze conversation patterns
    this.analyzeConversationPatterns();
    
    // Analyze photo patterns
    this.analyzePhotoPatterns();
    
    // Update threat intelligence
    this.updateThreatIntelligence();
  }

  // Analyze behavior patterns
  analyzeBehaviorPatterns() {
    const users = this.getAllActiveUsers();
    
    users.forEach(user => {
      const behaviorScore = this.calculateBehaviorScore(user);
      this.aiDetection.behaviorAnalysis.set(user.id, behaviorScore);
      
      if (behaviorScore > 0.7) {
        this.flagSuspiciousUser(user.id, 'suspicious_behavior');
      }
    });
  }

  // Calculate behavior score
  calculateBehaviorScore(user) {
    let score = 0;
    
    // Check login patterns
    const loginPatterns = this.getUserLoginPatterns(user.id);
    if (this.isUnusualLoginPattern(loginPatterns)) score += 0.3;
    
    // Check interaction patterns
    const interactionPatterns = this.getUserInteractionPatterns(user.id);
    if (this.isUnusualInteractionPattern(interactionPatterns)) score += 0.3;
    
    // Check location patterns
    const locationPatterns = this.getUserLocationPatterns(user.id);
    if (this.isUnusualLocationPattern(locationPatterns)) score += 0.4;
    
    return Math.min(1, score);
  }

  // Setup emergency protocols
  setupEmergencyProtocols() {
    // Setup emergency contact system
    this.setupEmergencyContacts();
    
    // Setup panic button
    this.setupPanicButton();
    
    // Setup automatic emergency detection
    this.setupAutomaticEmergencyDetection();
  }

  // Setup emergency contacts
  setupEmergencyContacts() {
    const currentUser = this.getCurrentUser();
    if (currentUser.emergencyContacts) {
      currentUser.emergencyContacts.forEach(contact => {
        this.emergencySystem.emergencyContacts.set(contact.id, contact);
      });
    }
  }

  // Setup panic button
  setupPanicButton() {
    // Create panic button if it doesn't exist
    if (!document.getElementById('panic-button')) {
      const panicButton = document.createElement('button');
      panicButton.id = 'panic-button';
      panicButton.innerHTML = '🚨 מצב חירום';
      panicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 15px 25px;
        font-size: 16px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      
      panicButton.addEventListener('click', () => this.activatePanicMode());
      document.body.appendChild(panicButton);
    }
  }

  // Setup automatic emergency detection
  setupAutomaticEmergencyDetection() {
    // Monitor for emergency keywords in messages
    this.monitorEmergencyKeywords();
    
    // Monitor for unusual user behavior
    this.monitorUnusualBehavior();
    
    // Monitor for location-based emergencies
    this.monitorLocationEmergencies();
  }

  // Start real-time protection
  startRealTimeProtection() {
    // Real-time content filtering
    this.startRealTimeContentFiltering();
    
    // Real-time threat detection
    this.startRealTimeThreatDetection();
    
    // Real-time privacy protection
    this.startRealTimePrivacyProtection();
  }

  // Start real-time content filtering
  startRealTimeContentFiltering() {
    // Monitor all text inputs
    document.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.filterContentInRealTime(e.target);
      }
    });
  }

  // Filter content in real-time
  filterContentInRealTime(element) {
    const originalValue = element.value;
    const filteredValue = this.contentModerator.moderateText(originalValue);
    
    if (!filteredValue.isAppropriate) {
      element.style.borderColor = '#dc3545';
      element.style.backgroundColor = '#fff5f5';
      
      // Show warning
      this.showContentWarning(element, filteredValue.reason);
    } else {
      element.style.borderColor = '';
      element.style.backgroundColor = '';
    }
  }

  // Show content warning
  showContentWarning(element, reason) {
    // Remove existing warning
    const existingWarning = element.parentNode.querySelector('.content-warning');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    // Create warning element
    const warning = document.createElement('div');
    warning.className = 'content-warning';
    warning.style.cssText = `
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      padding: 5px;
      background: #fff5f5;
      border-radius: 4px;
    `;
    warning.textContent = `אזהרה: ${reason}`;
    
    element.parentNode.appendChild(warning);
  }

  // Start real-time threat detection
  startRealTimeThreatDetection() {
    setInterval(() => {
      this.performRealTimeThreatScan();
    }, 10000); // Every 10 seconds
  }

  // Perform real-time threat scan
  performRealTimeThreatScan() {
    const currentUser = this.getCurrentUserId();
    if (!currentUser) return;
    
    // Check for new threats
    const threats = this.detectNewThreats(currentUser);
    
    if (threats.length > 0) {
      this.handleNewThreats(currentUser, threats);
    }
  }

  // Start real-time privacy protection
  startRealTimePrivacyProtection() {
    // Encrypt sensitive data
    this.encryptSensitiveData();
    
    // Mask location data
    this.maskLocationData();
    
    // Protect user photos
    this.protectUserPhotos();
  }

  // Encrypt sensitive data
  encryptSensitiveData() {
    const sensitiveFields = ['phone', 'email', 'address', 'id'];
    
    sensitiveFields.forEach(field => {
      const elements = document.querySelectorAll(`[data-field="${field}"]`);
      elements.forEach(element => {
        if (element.textContent && !element.classList.contains('encrypted')) {
          element.textContent = this.encryptText(element.textContent);
          element.classList.add('encrypted');
        }
      });
    });
  }

  // Mask location data
  maskLocationData() {
    // In real app, this would mask precise location
    const locationElements = document.querySelectorAll('[data-location]');
    locationElements.forEach(element => {
      if (element.textContent && !element.classList.contains('masked')) {
        element.textContent = this.maskLocation(element.textContent);
        element.classList.add('masked');
      }
    });
  }

  // Protect user photos
  protectUserPhotos() {
    const photoElements = document.querySelectorAll('img[data-user-photo]');
    photoElements.forEach(img => {
      if (!img.classList.contains('protected')) {
        this.addPhotoProtection(img);
        img.classList.add('protected');
      }
    });
  }

  // Add photo protection
  addPhotoProtection(img) {
    // Add watermark
    this.addWatermark(img);
    
    // Prevent right-click
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Prevent drag
    img.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // Add watermark to image
  addWatermark(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      // Add watermark text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '20px Arial';
      ctx.fillText('IsraLove', 10, 30);
      
      img.src = canvas.toDataURL();
    };
  }

  // Utility functions
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  getCurrentLocation() {
    // In real app, this would get actual location
    return { lat: 0, lng: 0 };
  }

  getSessionData() {
    return {
      sessionId: sessionStorage.getItem('sessionId'),
      loginTime: sessionStorage.getItem('loginTime'),
      lastActivity: Date.now()
    };
  }

  getRecentInteractions(userId, timeWindow) {
    const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    const now = Date.now();
    return interactions.filter(interaction => 
      interaction.userId === userId && 
      interaction.timestamp > now - timeWindow
    );
  }

  getRecentActions(userId, timeWindow) {
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    const now = Date.now();
    return actions.filter(action => 
      action.userId === userId && 
      action.timestamp > now - timeWindow
    );
  }

  getAllActiveUsers() {
    // In real app, this would get actual users
    return [];
  }

  encryptText(text) {
    // Simple encryption for demo
    return btoa(text);
  }

  maskLocation(location) {
    // Mask precise location
    return location.replace(/\d+\.\d+/g, '***');
  }

  logEmergencyEvent(event) {
    const emergencyEvents = JSON.parse(localStorage.getItem('emergencyEvents') || '[]');
    emergencyEvents.push(event);
    localStorage.setItem('emergencyEvents', JSON.stringify(emergencyEvents));
  }

  addSecurityWarning(warning) {
    const warnings = JSON.parse(localStorage.getItem('securityWarnings') || '[]');
    warnings.push(warning);
    localStorage.setItem('securityWarnings', JSON.stringify(warnings));
  }

  flagSuspiciousUser(userId, reason) {
    const suspiciousUsers = JSON.parse(localStorage.getItem('suspiciousUsers') || '[]');
    if (!suspiciousUsers.find(user => user.userId === userId)) {
      suspiciousUsers.push({
        userId: userId,
        reason: reason,
        timestamp: Date.now()
      });
      localStorage.setItem('suspiciousUsers', JSON.stringify(suspiciousUsers));
    }
  }

  notifySecurityTeam(userId, threats) {
    // In real app, this would notify actual security team
    console.log('Security team notified:', { userId, threats });
  }

  restrictUserAccess(userId) {
    // In real app, this would restrict user access
    console.log('User access restricted:', userId);
  }

  activatePanicMode() {
    const result = this.safetySystem.activatePanicMode();
    alert('מצב חירום הופעל! הצוות שלנו קיבל התראה.');
    return result;
  }
}

// Export the AdvancedSecuritySystem
export default AdvancedSecuritySystem;

// Export utility functions
export const createAdvancedSecuritySystem = () => new AdvancedSecuritySystem();

export const getSecurityStatus = () => {
  const security = new AdvancedSecuritySystem();
  return {
    isActive: true,
    threatLevel: 'low',
    lastScan: Date.now(),
    protectedUsers: 0,
    blockedThreats: 0
  };
}; 