// SafetySystem.js - Advanced Safety & Security System

class SafetySystem {
  constructor() {
    // Report categories and their severity levels
    this.reportCategories = {
      inappropriate_content: {
        id: 'inappropriate_content',
        name: 'תוכן לא הולם',
        severity: 'medium',
        icon: 'fas fa-exclamation-triangle',
        color: '#ffc107',
        subcategories: [
          'תמונות לא הולמות',
          'טקסט פוגעני',
          'תוכן מיני מפורש',
          'תוכן אלים'
        ]
      },
      harassment: {
        id: 'harassment',
        name: 'הטרדה',
        severity: 'high',
        icon: 'fas fa-ban',
        color: '#dc3545',
        subcategories: [
          'הטרדה מינית',
          'איומים',
          'רדיפה מתמשכת',
          'בריונות'
        ]
      },
      fake_profile: {
        id: 'fake_profile',
        name: 'פרופיל מזויף',
        severity: 'high',
        icon: 'fas fa-mask',
        color: '#6f42c1',
        subcategories: [
          'זהות בדויה',
          'תמונות גנובות',
          'מידע כוזב',
          'בוט/חשבון אוטומטי'
        ]
      },
      spam: {
        id: 'spam',
        name: 'ספאם',
        severity: 'low',
        icon: 'fas fa-envelope',
        color: '#28a745',
        subcategories: [
          'פרסומות',
          'קישורים חשודים',
          'הודעות חוזרות',
          'מכירת שירותים'
        ]
      },
      underage: {
        id: 'underage',
        name: 'קטין',
        severity: 'critical',
        icon: 'fas fa-child',
        color: '#e74c3c',
        subcategories: [
          'נראה מתחת לגיל 18',
          'טוען שהוא קטין',
          'פרופיל חשוד'
        ]
      },
      financial_scam: {
        id: 'financial_scam',
        name: 'הונאה כלכלית',
        severity: 'critical',
        icon: 'fas fa-dollar-sign',
        color: '#e67e22',
        subcategories: [
          'בקשת כסף',
          'הונאה רומנטית',
          'מכירת שירותים לא חוקיים',
          'פישינג'
        ]
      }
    };

    // Block/Safety actions
    this.safetyActions = {
      block: {
        id: 'block',
        name: 'חסום משתמש',
        description: 'המשתמש לא יוכל ליצור איתך קשר',
        icon: 'fas fa-ban',
        reversible: true
      },
      report: {
        id: 'report',
        name: 'דווח למנהלים',
        description: 'הפרופיל ייבדק על ידי צוות האתר',
        icon: 'fas fa-flag',
        reversible: false
      },
      unmatch: {
        id: 'unmatch',
        name: 'בטל התאמה',
        description: 'הסר את ההתאמה לצמיתות',
        icon: 'fas fa-heart-broken',
        reversible: false
      },
      hide: {
        id: 'hide',
        name: 'הסתר פרופיל',
        description: 'הפרופיל לא יופיע יותר בחיפושים',
        icon: 'fas fa-eye-slash',
        reversible: true
      }
    };

    // Load user safety data
    this.userSafetyData = this.loadUserSafetyData();
  }

  // Load user safety data from localStorage
  loadUserSafetyData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return {
      blockedUsers: currentUser.blockedUsers || [],
      reportedUsers: currentUser.reportedUsers || [],
      hiddenUsers: currentUser.hiddenUsers || [],
      reportsReceived: currentUser.reportsReceived || [],
      safetyScore: currentUser.safetyScore || 100,
      verificationStatus: currentUser.verificationStatus || 'unverified',
      lastSafetyCheck: currentUser.lastSafetyCheck || null
    };
  }

  // Save user safety data to localStorage
  saveUserSafetyData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.blockedUsers = this.userSafetyData.blockedUsers;
    currentUser.reportedUsers = this.userSafetyData.reportedUsers;
    currentUser.hiddenUsers = this.userSafetyData.hiddenUsers;
    currentUser.reportsReceived = this.userSafetyData.reportsReceived;
    currentUser.safetyScore = this.userSafetyData.safetyScore;
    currentUser.verificationStatus = this.userSafetyData.verificationStatus;
    currentUser.lastSafetyCheck = this.userSafetyData.lastSafetyCheck;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Report a user
  reportUser(userId, category, subcategory, description, evidence = []) {
    const report = {
      id: Date.now().toString(),
      reportedUserId: userId,
      reporterUserId: this.getCurrentUserId(),
      category: category,
      subcategory: subcategory,
      description: description,
      evidence: evidence,
      timestamp: new Date().toISOString(),
      status: 'pending',
      severity: this.reportCategories[category]?.severity || 'medium'
    };

    // Add to user's reported list
    if (!this.userSafetyData.reportedUsers.includes(userId)) {
      this.userSafetyData.reportedUsers.push(userId);
    }

    // Save to global reports (in real app, this would go to backend)
    const allReports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
    allReports.push(report);
    localStorage.setItem('safetyReports', JSON.stringify(allReports));

    // Auto-actions based on severity
    this.handleReportAutoActions(userId, category);

    this.saveUserSafetyData();

    return {
      success: true,
      reportId: report.id,
      message: 'הדיווח נשלח בהצלחה וייבדק על ידי הצוות שלנו'
    };
  }

  // Handle automatic actions based on report severity
  handleReportAutoActions(userId, category) {
    const categoryData = this.reportCategories[category];
    
    if (categoryData.severity === 'critical') {
      // Auto-block for critical reports
      this.blockUser(userId, 'auto', `דיווח קריטי: ${categoryData.name}`);
      
      // Notify user of auto-action
      this.addSafetyNotification({
        type: 'auto_block',
        message: `המשתמש נחסם אוטומטית בגלל דיווח על ${categoryData.name}`,
        userId: userId
      });
    }
  }

  // Block a user
  blockUser(userId, reason = 'manual', details = '') {
    if (this.userSafetyData.blockedUsers.find(block => block.userId === userId)) {
      return { success: false, error: 'משתמש כבר חסום' };
    }

    const blockData = {
      userId: userId,
      reason: reason,
      details: details,
      timestamp: new Date().toISOString(),
      blockedBy: this.getCurrentUserId()
    };

    this.userSafetyData.blockedUsers.push(blockData);
    this.saveUserSafetyData();

    return {
      success: true,
      message: 'המשתמש נחסם בהצלחה'
    };
  }

  // Unblock a user
  unblockUser(userId) {
    const initialLength = this.userSafetyData.blockedUsers.length;
    this.userSafetyData.blockedUsers = this.userSafetyData.blockedUsers.filter(
      block => block.userId !== userId
    );

    if (this.userSafetyData.blockedUsers.length === initialLength) {
      return { success: false, error: 'משתמש לא נמצא ברשימת החסומים' };
    }

    this.saveUserSafetyData();

    return {
      success: true,
      message: 'החסימה הוסרה בהצלחה'
    };
  }

  // Hide a user from search results
  hideUser(userId) {
    if (!this.userSafetyData.hiddenUsers.includes(userId)) {
      this.userSafetyData.hiddenUsers.push({
        userId: userId,
        timestamp: new Date().toISOString()
      });
      this.saveUserSafetyData();
    }

    return {
      success: true,
      message: 'המשתמש הוסתר מתוצאות החיפוש'
    };
  }

  // Check if user is blocked
  isUserBlocked(userId) {
    return this.userSafetyData.blockedUsers.some(block => block.userId === userId);
  }

  // Check if user is hidden
  isUserHidden(userId) {
    return this.userSafetyData.hiddenUsers.some(hidden => hidden.userId === userId);
  }

  // Get blocked users list
  getBlockedUsers() {
    return this.userSafetyData.blockedUsers;
  }

  // Photo verification process
  initiatePhotoVerification(selfieFile) {
    return new Promise((resolve) => {
      // Simulate photo verification process
      setTimeout(() => {
        // In real app, this would use AI/ML for face matching
        const verificationResult = Math.random() > 0.1; // 90% success rate for demo
        
        if (verificationResult) {
          this.userSafetyData.verificationStatus = 'verified';
          this.userSafetyData.safetyScore = Math.min(100, this.userSafetyData.safetyScore + 20);
          this.saveUserSafetyData();
          
          resolve({
            success: true,
            message: 'האימות הצליח! הפרופיל שלך מאומת',
            verificationBadge: true
          });
        } else {
          resolve({
            success: false,
            message: 'האימות נכשל. ודא שהתמונה ברורה ומציגה את פניך',
            reason: 'face_not_clear'
          });
        }
      }, 3000);
    });
  }

  // Calculate user safety score
  calculateSafetyScore() {
    let score = 100;
    
    // Deduct points for reports received
    const reportsCount = this.userSafetyData.reportsReceived.length;
    score -= reportsCount * 10;
    
    // Add points for verification
    if (this.userSafetyData.verificationStatus === 'verified') {
      score += 20;
    }
    
    // Add points for account age (assuming newer accounts are less trustworthy)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.createdAt) {
      const accountAge = (new Date() - new Date(currentUser.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge > 30) score += 10; // 30+ days old account
      if (accountAge > 90) score += 10; // 90+ days old account
    }
    
    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));
    
    this.userSafetyData.safetyScore = score;
    return score;
  }

  // Get safety recommendations
  getSafetyRecommendations() {
    const recommendations = [];
    
    if (this.userSafetyData.verificationStatus !== 'verified') {
      recommendations.push({
        type: 'verification',
        icon: 'fas fa-shield-alt',
        title: 'אמת את הפרופיל שלך',
        description: 'הוסף תג אימות כחול ושפר את רמת הביטחון',
        action: 'verify_profile',
        priority: 'high'
      });
    }
    
    if (this.userSafetyData.safetyScore < 80) {
      recommendations.push({
        type: 'improve_score',
        icon: 'fas fa-chart-line',
        title: 'שפר את ציון הבטיחות',
        description: 'ציון בטיחות נמוך עלול להגביל את הנראות שלך',
        action: 'improve_safety',
        priority: 'medium'
      });
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.photos || currentUser.photos.length < 3) {
      recommendations.push({
        type: 'add_photos',
        icon: 'fas fa-camera',
        title: 'הוסף עוד תמונות',
        description: 'פרופילים עם יותר תמונות נראים אמינים יותר',
        action: 'add_photos',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  // Emergency panic button
  activatePanicMode(location = null, additionalInfo = '') {
    const panicReport = {
      id: Date.now().toString(),
      userId: this.getCurrentUserId(),
      timestamp: new Date().toISOString(),
      location: location,
      additionalInfo: additionalInfo,
      status: 'active',
      type: 'panic'
    };

    // Save panic report
    const panicReports = JSON.parse(localStorage.getItem('panicReports') || '[]');
    panicReports.push(panicReport);
    localStorage.setItem('panicReports', JSON.stringify(panicReports));

    // In real app, this would:
    // 1. Notify emergency contacts
    // 2. Send location to safety team
    // 3. Activate emergency protocols

    return {
      success: true,
      emergencyId: panicReport.id,
      message: 'מצב חירום הופעל - הצוות שלנו קיבל התראה',
      instructions: [
        'הישאר במקום בטוח',
        'אל תחלוק מידע אישי',
        'פנה לרשויות אם מרגיש בסכנה'
      ]
    };
  }

  // Safe meeting guidelines
  getSafeMeetingGuidelines() {
    return {
      before_meeting: [
        'תמיד פגוש במקום ציבורי',
        'ספר לחבר איפה אתה הולך',
        'בדוק את הפרופיל ותמונות נוספות',
        'דבר בטלפון לפני הפגישה',
        'קבע פגישה קצרה בהתחלה'
      ],
      during_meeting: [
        'הגע בכלי תחבורה משלך',
        'שמור על יצירת קשר עם חברים',
        'אל תשתה אלכוהול מדי',
        'סמוך על האינטואיציה שלך',
        'אל תלך למקום פרטי בפגישה ראשונה'
      ],
      red_flags: [
        'מתחמק מפגישה במקום ציבורי',
        'לוחץ למפגש מהיר מדי',
        'שואל שאלות אישיות מדי',
        'הפרופיל לא תואם למציאות',
        'מבקש כסף או עזרה כלכלית'
      ]
    };
  }

  // Get current user ID
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id || null;
  }

  // Add safety notification
  addSafetyNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem('safetyNotifications') || '[]');
    notifications.push({
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('safetyNotifications', JSON.stringify(notifications));
  }

  // Get user safety statistics
  getSafetyStats() {
    const safetyScore = this.calculateSafetyScore();
    
    return {
      safetyScore: safetyScore,
      verificationStatus: this.userSafetyData.verificationStatus,
      blockedUsers: this.userSafetyData.blockedUsers.length,
      reportsSubmitted: this.userSafetyData.reportedUsers.length,
      reportsReceived: this.userSafetyData.reportsReceived.length,
      hiddenUsers: this.userSafetyData.hiddenUsers.length,
      lastSafetyCheck: this.userSafetyData.lastSafetyCheck,
      recommendations: this.getSafetyRecommendations()
    };
  }

  // Admin functions (for moderators)
  getReportsForReview() {
    const allReports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
    return allReports.filter(report => report.status === 'pending')
                   .sort((a, b) => {
                     const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                     return severityOrder[b.severity] - severityOrder[a.severity];
                   });
  }

  // Moderate a report (admin function)
  moderateReport(reportId, action, notes = '') {
    const allReports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
    const reportIndex = allReports.findIndex(report => report.id === reportId);
    
    if (reportIndex === -1) {
      return { success: false, error: 'דיווח לא נמצא' };
    }

    allReports[reportIndex].status = action; // 'approved', 'rejected', 'resolved'
    allReports[reportIndex].moderationNotes = notes;
    allReports[reportIndex].moderatedAt = new Date().toISOString();
    allReports[reportIndex].moderatedBy = this.getCurrentUserId();

    localStorage.setItem('safetyReports', JSON.stringify(allReports));

    return {
      success: true,
      message: `דיווח ${reportId} ${action === 'approved' ? 'אושר' : action === 'rejected' ? 'נדחה' : 'נסגר'}`
    };
  }

  // Reset safety data (for testing)
  resetSafetyData() {
    this.userSafetyData = {
      blockedUsers: [],
      reportedUsers: [],
      hiddenUsers: [],
      reportsReceived: [],
      safetyScore: 100,
      verificationStatus: 'unverified',
      lastSafetyCheck: null
    };
    this.saveUserSafetyData();
    
    // Clear global safety data
    localStorage.removeItem('safetyReports');
    localStorage.removeItem('panicReports');
    localStorage.removeItem('safetyNotifications');
  }
}

// Export the SafetySystem class
export default SafetySystem;

// Utility functions
export const createSafetySystem = () => new SafetySystem();

export const checkUserSafety = (userId) => {
  const safetySystem = new SafetySystem();
  return !safetySystem.isUserBlocked(userId) && !safetySystem.isUserHidden(userId);
};