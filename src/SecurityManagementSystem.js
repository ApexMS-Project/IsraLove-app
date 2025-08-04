// SecurityManagementSystem.js - Comprehensive Security Management & Admin System

import SecuritySystem from './SecuritySystem.js';
import SafetySystem from './SafetySystem.js';
import ContentModeration from './ContentModeration.js';
import AdvancedSecuritySystem from './AdvancedSecuritySystem.js';
import ThreatIntelligenceSystem from './ThreatIntelligenceSystem.js';

class SecurityManagementSystem {
  constructor() {
    // Initialize all security subsystems
    this.securitySystem = new SecuritySystem();
    this.safetySystem = new SafetySystem();
    this.contentModerator = new ContentModeration();
    this.advancedSecurity = new AdvancedSecuritySystem();
    this.threatIntelligence = new ThreatIntelligenceSystem();
    
    // Admin management
    this.adminControls = {
      moderators: new Map(),
      permissions: new Map(),
      auditLog: [],
      securityPolicies: new Map()
    };
    
    // Security dashboard data
    this.dashboardData = {
      realTimeStats: {},
      threatMetrics: {},
      userActivity: {},
      systemHealth: {}
    };
    
    // Security policies
    this.securityPolicies = {
      contentFiltering: {
        enabled: true,
        strictness: 'medium',
        autoModeration: true,
        humanReview: false
      },
      userVerification: {
        enabled: true,
        photoVerification: true,
        ageVerification: true,
        identityCheck: false
      },
      rateLimiting: {
        enabled: true,
        strictMode: false,
        customLimits: {}
      },
      threatDetection: {
        enabled: true,
        aiEnabled: true,
        realTimeMonitoring: true,
        alertThreshold: 0.7
      },
      privacyProtection: {
        enabled: true,
        dataEncryption: true,
        locationMasking: true,
        photoWatermarking: true
      }
    };
    
    this.initializeSecurityManagement();
  }

  // Initialize security management system
  initializeSecurityManagement() {
    this.setupAdminControls();
    this.initializeDashboard();
    this.loadSecurityPolicies();
    this.startRealTimeMonitoring();
  }

  // Setup admin controls
  setupAdminControls() {
    // Setup moderator permissions
    this.setupModeratorPermissions();
    
    // Setup audit logging
    this.setupAuditLogging();
    
    // Setup security policies
    this.setupSecurityPolicies();
  }

  // Setup moderator permissions
  setupModeratorPermissions() {
    const moderatorRoles = {
      'super_admin': {
        name: 'מנהל ראשי',
        permissions: ['all'],
        description: 'גישה מלאה לכל המערכות'
      },
      'security_admin': {
        name: 'מנהל אבטחה',
        permissions: ['security_management', 'threat_monitoring', 'user_management'],
        description: 'ניהול אבטחה ומעקב אחרי איומים'
      },
      'content_moderator': {
        name: 'מנחה תוכן',
        permissions: ['content_moderation', 'user_reports', 'basic_management'],
        description: 'ניהול תוכן ודיווחים'
      },
      'safety_specialist': {
        name: 'מומחה בטיחות',
        permissions: ['safety_management', 'emergency_response', 'user_support'],
        description: 'ניהול בטיחות ותגובה למצבי חירום'
      }
    };
    
    Object.entries(moderatorRoles).forEach(([role, data]) => {
      this.adminControls.permissions.set(role, data);
    });
  }

  // Setup audit logging
  setupAuditLogging() {
    // Monitor all admin actions
    this.monitorAdminActions();
    
    // Monitor security events
    this.monitorSecurityEvents();
    
    // Monitor system changes
    this.monitorSystemChanges();
  }

  // Monitor admin actions
  monitorAdminActions() {
    // In real app, this would monitor actual admin actions
    console.log('Admin action monitoring enabled');
  }

  // Monitor security events
  monitorSecurityEvents() {
    // In real app, this would monitor security events
    console.log('Security event monitoring enabled');
  }

  // Monitor system changes
  monitorSystemChanges() {
    // In real app, this would monitor system changes
    console.log('System change monitoring enabled');
  }

  // Setup security policies
  setupSecurityPolicies() {
    // Load policies from localStorage
    const savedPolicies = JSON.parse(localStorage.getItem('securityPolicies') || '{}');
    Object.assign(this.securityPolicies, savedPolicies);
    
    // Apply policies
    this.applySecurityPolicies();
  }

  // Apply security policies
  applySecurityPolicies() {
    // Apply content filtering policy
    if (this.securityPolicies.contentFiltering.enabled) {
      this.enableContentFiltering();
    }
    
    // Apply user verification policy
    if (this.securityPolicies.userVerification.enabled) {
      this.enableUserVerification();
    }
    
    // Apply rate limiting policy
    if (this.securityPolicies.rateLimiting.enabled) {
      this.enableRateLimiting();
    }
    
    // Apply threat detection policy
    if (this.securityPolicies.threatDetection.enabled) {
      this.enableThreatDetection();
    }
    
    // Apply privacy protection policy
    if (this.securityPolicies.privacyProtection.enabled) {
      this.enablePrivacyProtection();
    }
  }

  // Initialize dashboard
  initializeDashboard() {
    this.updateDashboardData();
    
    // Update dashboard every 30 seconds
    setInterval(() => {
      this.updateDashboardData();
    }, 30000);
  }

  // Update dashboard data
  updateDashboardData() {
    // Real-time statistics
    this.dashboardData.realTimeStats = this.getRealTimeStats();
    
    // Threat metrics
    this.dashboardData.threatMetrics = this.getThreatMetrics();
    
    // User activity
    this.dashboardData.userActivity = this.getUserActivity();
    
    // System health
    this.dashboardData.systemHealth = this.getSystemHealth();
  }

  // Get real-time statistics
  getRealTimeStats() {
    return {
      activeUsers: this.getActiveUserCount(),
      onlineModerators: this.getOnlineModeratorCount(),
      pendingReports: this.getPendingReportCount(),
      activeThreats: this.getActiveThreatCount(),
      systemUptime: this.getSystemUptime(),
      lastUpdate: Date.now()
    };
  }

  // Get threat metrics
  getThreatMetrics() {
    return {
      totalThreats: this.getTotalThreatCount(),
      threatsByType: this.getThreatsByType(),
      threatTrends: this.getThreatTrends(),
      blockedUsers: this.getBlockedUserCount(),
      suspiciousUsers: this.getSuspiciousUserCount(),
      lastScan: Date.now()
    };
  }

  // Get user activity
  getUserActivity() {
    return {
      newUsers: this.getNewUserCount(),
      activeSessions: this.getActiveSessionCount(),
      messageCount: this.getMessageCount(),
      photoUploads: this.getPhotoUploadCount(),
      verificationRequests: this.getVerificationRequestCount(),
      lastUpdate: Date.now()
    };
  }

  // Get system health
  getSystemHealth() {
    return {
      securityLevel: this.getSecurityLevel(),
      systemPerformance: this.getSystemPerformance(),
      errorRate: this.getErrorRate(),
      responseTime: this.getResponseTime(),
      lastCheck: Date.now()
    };
  }

  // Start real-time monitoring
  startRealTimeMonitoring() {
    // Monitor system performance
    setInterval(() => {
      this.monitorSystemPerformance();
    }, 10000); // Every 10 seconds
    
    // Monitor security events
    setInterval(() => {
      this.monitorSecurityEvents();
    }, 5000); // Every 5 seconds
    
    // Monitor user activity
    setInterval(() => {
      this.monitorUserActivity();
    }, 15000); // Every 15 seconds
  }

  // Monitor system performance
  monitorSystemPerformance() {
    const performance = {
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      networkLatency: this.getNetworkLatency(),
      responseTime: this.getResponseTime()
    };
    
    // Alert if performance is poor
    if (performance.cpuUsage > 80 || performance.memoryUsage > 85) {
      this.alertSystemPerformance(performance);
    }
  }

  // Monitor security events
  monitorSecurityEvents() {
    const securityEvents = this.getRecentSecurityEvents();
    
    // Process critical events
    const criticalEvents = securityEvents.filter(event => event.severity === 'critical');
    if (criticalEvents.length > 0) {
      this.handleCriticalSecurityEvents(criticalEvents);
    }
  }

  // Monitor user activity
  monitorUserActivity() {
    const userActivity = this.getUserActivityMetrics();
    
    // Check for unusual activity patterns
    if (this.detectUnusualActivity(userActivity)) {
      this.alertUnusualActivity(userActivity);
    }
  }

  // Admin functions
  addModerator(userId, role, permissions = []) {
    const moderator = {
      userId: userId,
      role: role,
      permissions: permissions,
      addedAt: Date.now(),
      addedBy: this.getCurrentAdminId(),
      status: 'active'
    };
    
    this.adminControls.moderators.set(userId, moderator);
    this.logAdminAction('add_moderator', { userId, role, permissions });
    
    return {
      success: true,
      message: 'מנחה נוסף בהצלחה',
      moderator: moderator
    };
  }

  removeModerator(userId) {
    const moderator = this.adminControls.moderators.get(userId);
    if (!moderator) {
      return { success: false, error: 'מנחה לא נמצא' };
    }
    
    this.adminControls.moderators.delete(userId);
    this.logAdminAction('remove_moderator', { userId, role: moderator.role });
    
    return {
      success: true,
      message: 'מנחה הוסר בהצלחה'
    };
  }

  updateSecurityPolicy(policyName, settings) {
    if (!this.securityPolicies[policyName]) {
      return { success: false, error: 'מדיניות לא קיימת' };
    }
    
    // Update policy
    Object.assign(this.securityPolicies[policyName], settings);
    
    // Save to localStorage
    localStorage.setItem('securityPolicies', JSON.stringify(this.securityPolicies));
    
    // Apply updated policy
    this.applySecurityPolicies();
    
    this.logAdminAction('update_security_policy', { policyName, settings });
    
    return {
      success: true,
      message: 'מדיניות האבטחה עודכנה בהצלחה'
    };
  }

  banUser(userId, reason, duration = 'permanent') {
    const banData = {
      userId: userId,
      reason: reason,
      duration: duration,
      bannedAt: Date.now(),
      bannedBy: this.getCurrentAdminId(),
      status: 'active'
    };
    
    // Add to banned users
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    bannedUsers.push(banData);
    localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
    
    this.logAdminAction('ban_user', { userId, reason, duration });
    
    return {
      success: true,
      message: 'משתמש נחסם בהצלחה',
      banData: banData
    };
  }

  unbanUser(userId) {
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const userIndex = bannedUsers.findIndex(user => user.userId === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'משתמש לא נמצא ברשימת החסומים' };
    }
    
    bannedUsers.splice(userIndex, 1);
    localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
    
    this.logAdminAction('unban_user', { userId });
    
    return {
      success: true,
      message: 'החסימה הוסרה בהצלחה'
    };
  }

  reviewReport(reportId, action, notes = '') {
    const allReports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
    const reportIndex = allReports.findIndex(report => report.id === reportId);
    
    if (reportIndex === -1) {
      return { success: false, error: 'דיווח לא נמצא' };
    }
    
    allReports[reportIndex].status = action;
    allReports[reportIndex].reviewedAt = Date.now();
    allReports[reportIndex].reviewedBy = this.getCurrentAdminId();
    allReports[reportIndex].reviewNotes = notes;
    
    localStorage.setItem('safetyReports', JSON.stringify(allReports));
    
    this.logAdminAction('review_report', { reportId, action, notes });
    
    return {
      success: true,
      message: `דיווח ${action === 'approved' ? 'אושר' : 'נדחה'} בהצלחה`
    };
  }

  getSecurityDashboard() {
    return {
      realTimeStats: this.dashboardData.realTimeStats,
      threatMetrics: this.dashboardData.threatMetrics,
      userActivity: this.dashboardData.userActivity,
      systemHealth: this.dashboardData.systemHealth,
      recentEvents: this.getRecentEvents(),
      pendingActions: this.getPendingActions(),
      securityAlerts: this.getSecurityAlerts()
    };
  }

  getModeratorList() {
    return Array.from(this.adminControls.moderators.values());
  }

  getSecurityPolicies() {
    return this.securityPolicies;
  }

  getAuditLog(filters = {}) {
    let auditLog = this.adminControls.auditLog;
    
    // Apply filters
    if (filters.action) {
      auditLog = auditLog.filter(log => log.action === filters.action);
    }
    
    if (filters.adminId) {
      auditLog = auditLog.filter(log => log.adminId === filters.adminId);
    }
    
    if (filters.startDate) {
      auditLog = auditLog.filter(log => log.timestamp >= filters.startDate);
    }
    
    if (filters.endDate) {
      auditLog = auditLog.filter(log => log.timestamp <= filters.endDate);
    }
    
    return auditLog.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Utility functions
  getCurrentAdminId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id;
  }

  logAdminAction(action, details) {
    const logEntry = {
      action: action,
      details: details,
      adminId: this.getCurrentAdminId(),
      timestamp: Date.now(),
      ipAddress: '127.0.0.1', // In real app, get actual IP
      userAgent: navigator.userAgent
    };
    
    this.adminControls.auditLog.push(logEntry);
    
    // Keep only last 10000 entries
    if (this.adminControls.auditLog.length > 10000) {
      this.adminControls.auditLog = this.adminControls.auditLog.slice(-10000);
    }
    
    localStorage.setItem('adminAuditLog', JSON.stringify(this.adminControls.auditLog));
  }

  // Dashboard data functions (simplified for demo)
  getActiveUserCount() {
    return Math.floor(Math.random() * 1000) + 500;
  }

  getOnlineModeratorCount() {
    return this.adminControls.moderators.size;
  }

  getPendingReportCount() {
    const reports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
    return reports.filter(report => report.status === 'pending').length;
  }

  getActiveThreatCount() {
    return Math.floor(Math.random() * 50) + 10;
  }

  getSystemUptime() {
    return Date.now() - (Date.now() - 86400000); // 24 hours
  }

  getTotalThreatCount() {
    return Math.floor(Math.random() * 200) + 50;
  }

  getThreatsByType() {
    return {
      bot_activity: Math.floor(Math.random() * 30) + 10,
      fraud: Math.floor(Math.random() * 20) + 5,
      harassment: Math.floor(Math.random() * 25) + 8,
      underage: Math.floor(Math.random() * 5) + 1,
      spam: Math.floor(Math.random() * 40) + 15,
      location_spoofing: Math.floor(Math.random() * 15) + 3
    };
  }

  getThreatTrends() {
    return {
      daily: Math.floor(Math.random() * 20) + 5,
      weekly: Math.floor(Math.random() * 100) + 30,
      monthly: Math.floor(Math.random() * 500) + 150
    };
  }

  getBlockedUserCount() {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    return blockedUsers.length;
  }

  getSuspiciousUserCount() {
    const suspiciousUsers = JSON.parse(localStorage.getItem('suspiciousUsers') || '[]');
    return suspiciousUsers.length;
  }

  getNewUserCount() {
    return Math.floor(Math.random() * 100) + 20;
  }

  getActiveSessionCount() {
    return Math.floor(Math.random() * 500) + 200;
  }

  getMessageCount() {
    return Math.floor(Math.random() * 5000) + 2000;
  }

  getPhotoUploadCount() {
    return Math.floor(Math.random() * 200) + 50;
  }

  getVerificationRequestCount() {
    return Math.floor(Math.random() * 30) + 5;
  }

  getSecurityLevel() {
    return 'high';
  }

  getSystemPerformance() {
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      network: Math.floor(Math.random() * 20) + 10
    };
  }

  getErrorRate() {
    return Math.random() * 0.05; // 0-5%
  }

  getResponseTime() {
    return Math.floor(Math.random() * 100) + 50; // 50-150ms
  }

  getCPUUsage() {
    return Math.floor(Math.random() * 40) + 20; // 20-60%
  }

  getMemoryUsage() {
    return Math.floor(Math.random() * 30) + 40; // 40-70%
  }

  getNetworkLatency() {
    return Math.floor(Math.random() * 50) + 20; // 20-70ms
  }

  getRecentSecurityEvents() {
    return JSON.parse(localStorage.getItem('securityEvents') || '[]').slice(-10);
  }

  getUserActivityMetrics() {
    return {
      loginAttempts: Math.floor(Math.random() * 100) + 20,
      messageSent: Math.floor(Math.random() * 500) + 100,
      photosUploaded: Math.floor(Math.random() * 50) + 10,
      reportsSubmitted: Math.floor(Math.random() * 20) + 5
    };
  }

  getRecentEvents() {
    return this.adminControls.auditLog.slice(-20);
  }

  getPendingActions() {
    return [
      { type: 'report_review', count: this.getPendingReportCount() },
      { type: 'user_verification', count: this.getVerificationRequestCount() },
      { type: 'threat_investigation', count: Math.floor(Math.random() * 10) + 2 }
    ];
  }

  getSecurityAlerts() {
    return [
      { type: 'high_threat_level', severity: 'medium', count: Math.floor(Math.random() * 5) + 1 },
      { type: 'suspicious_activity', severity: 'low', count: Math.floor(Math.random() * 10) + 3 },
      { type: 'system_performance', severity: 'low', count: Math.floor(Math.random() * 3) + 1 }
    ];
  }

  detectUnusualActivity(activity) {
    // Simplified unusual activity detection
    return activity.loginAttempts > 80 || activity.messageSent > 400;
  }

  alertSystemPerformance(performance) {
    console.log('System performance alert:', performance);
  }

  alertUnusualActivity(activity) {
    console.log('Unusual activity alert:', activity);
  }

  handleCriticalSecurityEvents(events) {
    events.forEach(event => {
      console.log('Critical security event:', event);
      // In real app, this would trigger immediate response
    });
  }

  enableContentFiltering() {
    console.log('Content filtering enabled');
  }

  enableUserVerification() {
    console.log('User verification enabled');
  }

  enableRateLimiting() {
    console.log('Rate limiting enabled');
  }

  enableThreatDetection() {
    console.log('Threat detection enabled');
  }

  enablePrivacyProtection() {
    console.log('Privacy protection enabled');
  }
}

// Export the SecurityManagementSystem
export default SecurityManagementSystem;

// Export utility functions
export const createSecurityManagementSystem = () => new SecurityManagementSystem();

export const getSecurityDashboard = () => {
  const securityManagement = new SecurityManagementSystem();
  return securityManagement.getSecurityDashboard();
}; 