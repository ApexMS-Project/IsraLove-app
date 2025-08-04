// AdminSystem.js - Advanced Admin Management System

class AdminSystem {
  constructor() {
    // Master admin credentials (encrypted)
    this.masterAdmin = {
      username: 'yossidanilovv@gmail.com',
      // Password hash for '69A07m41' - in real app use bcrypt
      passwordHash: this.hashPassword('69A07m41'),
      role: 'super_admin',
      permissions: [
        'view_all_users',
        'edit_users',
        'delete_users',
        'view_analytics',
        'manage_reports',
        'manage_subscriptions',
        'system_settings',
        'export_data',
        'view_logs',
        'manage_admins'
      ]
    };

    // Current admin session
    this.currentAdmin = null;
    this.sessionToken = null;
    this.sessionExpiry = null;

    // System statistics
    this.systemStats = {
      totalUsers: 0,
      activeUsers: 0,
      premiumUsers: 0,
      totalMatches: 0,
      totalMessages: 0,
      reportedUsers: 0,
      blockedUsers: 0,
      dailySignups: 0,
      monthlyRevenue: 0
    };

    // Activity logs
    this.activityLogs = [];
    this.maxLogEntries = 1000;

    // Load saved data
    this.loadAdminData();
  }

  // Password hashing (simplified - in production use bcrypt)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Generate secure session token
  generateSessionToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // Admin Authentication
  authenticateAdmin(username, password) {
    const passwordHash = this.hashPassword(password);
    
    if (username === this.masterAdmin.username && passwordHash === this.masterAdmin.passwordHash) {
      this.currentAdmin = { ...this.masterAdmin };
      this.sessionToken = this.generateSessionToken();
      this.sessionExpiry = Date.now() + (8 * 60 * 60 * 1000); // 8 hours
      
      // Save session
      localStorage.setItem('adminSession', JSON.stringify({
        token: this.sessionToken,
        expiry: this.sessionExpiry,
        admin: this.currentAdmin
      }));

      this.logActivity('admin_login', `Admin ${username} logged in`);
      return { success: true, admin: this.currentAdmin };
    }

    this.logActivity('admin_login_failed', `Failed login attempt for ${username}`);
    return { success: false, error: 'שם משתמש או סיסמה שגויים' };
  }

  // Session Management
  isAdminAuthenticated() {
    if (!this.sessionToken || !this.sessionExpiry) {
      return false;
    }

    if (Date.now() > this.sessionExpiry) {
      this.logoutAdmin();
      return false;
    }

    return true;
  }

  refreshSession() {
    if (this.isAdminAuthenticated()) {
      this.sessionExpiry = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem('adminSession', JSON.stringify({
        token: this.sessionToken,
        expiry: this.sessionExpiry,
        admin: this.currentAdmin
      }));
    }
  }

  logoutAdmin() {
    if (this.currentAdmin) {
      this.logActivity('admin_logout', `Admin ${this.currentAdmin.username} logged out`);
    }
    
    this.currentAdmin = null;
    this.sessionToken = null;
    this.sessionExpiry = null;
    localStorage.removeItem('adminSession');
  }

  // Load admin session from localStorage
  loadAdminData() {
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiry > Date.now()) {
          this.currentAdmin = session.admin;
          this.sessionToken = session.token;
          this.sessionExpiry = session.expiry;
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error('Error loading admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }

    // Load system stats
    const savedStats = localStorage.getItem('systemStats');
    if (savedStats) {
      try {
        this.systemStats = { ...this.systemStats, ...JSON.parse(savedStats) };
      } catch (error) {
        console.error('Error loading system stats:', error);
      }
    }

    // Load activity logs
    const savedLogs = localStorage.getItem('activityLogs');
    if (savedLogs) {
      try {
        this.activityLogs = JSON.parse(savedLogs);
      } catch (error) {
        console.error('Error loading activity logs:', error);
      }
    }
  }

  // Activity Logging
  logActivity(action, description, userId = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action,
      description,
      userId,
      adminUser: this.currentAdmin ? this.currentAdmin.username : 'system',
      ip: 'localhost', // In production, get real IP
      userAgent: navigator.userAgent
    };

    this.activityLogs.unshift(logEntry);

    // Keep only last 1000 entries
    if (this.activityLogs.length > this.maxLogEntries) {
      this.activityLogs = this.activityLogs.slice(0, this.maxLogEntries);
    }

    // Save to localStorage
    localStorage.setItem('activityLogs', JSON.stringify(this.activityLogs));
  }

  // User Management
  getAllUsers() {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    // Get all users from localStorage
    const users = [];
    const userKeys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    
    userKeys.forEach(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key));
        users.push({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          age: userData.age,
          registrationDate: userData.registrationDate,
          lastActive: userData.lastActive || 'אף פעם',
          subscriptionType: userData.subscriptionType || 'free',
          isVerified: userData.isVerified || false,
          photos: userData.photos ? userData.photos.length : 0,
          questionsAnswered: userData.questionsAnswered || 0,
          safetyScore: userData.safetyScore || 85
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    });

    return { success: true, users };
  }

  searchUsers(query, filters = {}) {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    const allUsers = this.getAllUsers();
    if (!allUsers.success) return allUsers;

    let filteredUsers = allUsers.users;

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.id.toString().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.subscriptionType && filters.subscriptionType !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.subscriptionType === filters.subscriptionType);
    }

    if (filters.isVerified !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isVerified === filters.isVerified);
    }

    if (filters.minAge) {
      filteredUsers = filteredUsers.filter(user => user.age >= filters.minAge);
    }

    if (filters.maxAge) {
      filteredUsers = filteredUsers.filter(user => user.age <= filters.maxAge);
    }

    return { success: true, users: filteredUsers };
  }

  getUserDetails(userId) {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      const userData = localStorage.getItem(`user_${userId}`);
      if (!userData) {
        return { success: false, error: 'משתמש לא נמצא' };
      }

      const user = JSON.parse(userData);
      this.logActivity('view_user', `Viewed user details: ${user.email}`, userId);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'שגיאה בטעינת נתוני משתמש' };
    }
  }

  updateUser(userId, updates) {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      const userData = localStorage.getItem(`user_${userId}`);
      if (!userData) {
        return { success: false, error: 'משתמש לא נמצא' };
      }

      const user = JSON.parse(userData);
      const updatedUser = { ...user, ...updates };
      
      localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));
      
      this.logActivity('update_user', `Updated user: ${user.email}`, userId);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'שגיאה בעדכון משתמש' };
    }
  }

  deleteUser(userId, reason = '') {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      const userData = localStorage.getItem(`user_${userId}`);
      if (!userData) {
        return { success: false, error: 'משתמש לא נמצא' };
      }

      const user = JSON.parse(userData);
      
      // Remove user data
      localStorage.removeItem(`user_${userId}`);
      
      // Update current user if it's the deleted user
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const current = JSON.parse(currentUser);
        if (current.id === userId) {
          localStorage.removeItem('currentUser');
        }
      }

      this.logActivity('delete_user', `Deleted user: ${user.email}. Reason: ${reason}`, userId);
      this.updateSystemStats();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'שגיאה במחיקת משתמש' };
    }
  }

  // System Statistics
  updateSystemStats() {
    const allUsers = this.getAllUsers();
    if (!allUsers.success) return;

    const users = allUsers.users;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    this.systemStats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => {
        const lastActive = new Date(user.lastActive);
        return (now - lastActive) < (7 * 24 * 60 * 60 * 1000); // Active in last 7 days
      }).length,
      premiumUsers: users.filter(user => user.subscriptionType !== 'free').length,
      totalMatches: this.calculateTotalMatches(),
      totalMessages: this.calculateTotalMessages(),
      reportedUsers: this.getReportedUsersCount(),
      blockedUsers: this.getBlockedUsersCount(),
      dailySignups: users.filter(user => {
        const regDate = new Date(user.registrationDate);
        return regDate.getTime() >= todayStart;
      }).length,
      monthlyRevenue: this.calculateMonthlyRevenue(users)
    };

    localStorage.setItem('systemStats', JSON.stringify(this.systemStats));
  }

  calculateTotalMatches() {
    // Simulate match counting - in real app this would come from match data
    return Math.floor(Math.random() * 1000) + 500;
  }

  calculateTotalMessages() {
    // Simulate message counting - in real app this would come from message data
    return Math.floor(Math.random() * 10000) + 5000;
  }

  getReportedUsersCount() {
    // Get count from safety system
    try {
      const reports = localStorage.getItem('userReports');
      if (reports) {
        const reportData = JSON.parse(reports);
        return Object.keys(reportData).length;
      }
    } catch (error) {
      console.error('Error getting reported users count:', error);
    }
    return 0;
  }

  getBlockedUsersCount() {
    // Get count from safety system
    try {
      const blocks = localStorage.getItem('blockedUsers');
      if (blocks) {
        const blockData = JSON.parse(blocks);
        return Object.keys(blockData).length;
      }
    } catch (error) {
      console.error('Error getting blocked users count:', error);
    }
    return 0;
  }

  calculateMonthlyRevenue(users) {
    const subscriptionPrices = {
      basic: 19.90,
      premium: 39.90,
      vip: 79.90
    };

    return users.reduce((total, user) => {
      if (user.subscriptionType !== 'free') {
        return total + (subscriptionPrices[user.subscriptionType] || 0);
      }
      return total;
    }, 0);
  }

  // Reports Management
  getAllReports() {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      const reports = localStorage.getItem('userReports');
      if (!reports) {
        return { success: true, reports: [] };
      }

      const reportData = JSON.parse(reports);
      const reportList = [];

      Object.entries(reportData).forEach(([userId, userReports]) => {
        userReports.forEach(report => {
          reportList.push({
            id: report.id,
            reportedUserId: userId,
            reporterId: report.reporterId,
            category: report.category,
            description: report.description,
            timestamp: report.timestamp,
            status: report.status || 'pending',
            adminNotes: report.adminNotes || ''
          });
        });
      });

      // Sort by timestamp (newest first)
      reportList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return { success: true, reports: reportList };
    } catch (error) {
      return { success: false, error: 'שגיאה בטעינת דיווחים' };
    }
  }

  updateReportStatus(reportId, status, adminNotes = '') {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      const reports = localStorage.getItem('userReports');
      if (!reports) {
        return { success: false, error: 'דיווח לא נמצא' };
      }

      const reportData = JSON.parse(reports);
      let updated = false;

      Object.keys(reportData).forEach(userId => {
        reportData[userId].forEach(report => {
          if (report.id === reportId) {
            report.status = status;
            report.adminNotes = adminNotes;
            report.reviewedBy = this.currentAdmin.username;
            report.reviewedAt = new Date().toISOString();
            updated = true;
          }
        });
      });

      if (updated) {
        localStorage.setItem('userReports', JSON.stringify(reportData));
        this.logActivity('update_report', `Updated report ${reportId} status to ${status}`);
        return { success: true };
      }

      return { success: false, error: 'דיווח לא נמצא' };
    } catch (error) {
      return { success: false, error: 'שגיאה בעדכון דיווח' };
    }
  }

  // Data Export
  exportUserData(format = 'json') {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    const allUsers = this.getAllUsers();
    if (!allUsers.success) return allUsers;

    const exportData = {
      exportDate: new Date().toISOString(),
      totalUsers: allUsers.users.length,
      users: allUsers.users,
      systemStats: this.systemStats
    };

    this.logActivity('export_data', `Exported user data in ${format} format`);

    if (format === 'csv') {
      return this.convertToCSV(allUsers.users);
    }

    return { success: true, data: exportData };
  }

  convertToCSV(users) {
    const headers = ['ID', 'Email', 'First Name', 'Last Name', 'Age', 'Registration Date', 'Subscription Type', 'Verified', 'Photos', 'Safety Score'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.age,
        user.registrationDate,
        user.subscriptionType,
        user.isVerified,
        user.photos,
        user.safetyScore
      ].join(','))
    ].join('\n');

    return { success: true, data: csvContent, type: 'csv' };
  }

  // System Settings
  getSystemSettings() {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    const defaultSettings = {
      siteName: 'IsraLove',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxPhotosPerUser: 5,
      minAge: 18,
      maxAge: 99,
      defaultSafetyScore: 85,
      autoModeration: true,
      premiumFeaturesEnabled: true
    };

    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        return { success: true, settings: { ...defaultSettings, ...JSON.parse(savedSettings) } };
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    }

    return { success: true, settings: defaultSettings };
  }

  updateSystemSettings(settings) {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    try {
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      this.logActivity('update_settings', 'Updated system settings');
      return { success: true, settings };
    } catch (error) {
      return { success: false, error: 'שגיאה בעדכון הגדרות' };
    }
  }

  // Get activity logs
  getActivityLogs(limit = 100, filter = '') {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    let filteredLogs = this.activityLogs;

    if (filter) {
      const filterTerm = filter.toLowerCase();
      filteredLogs = this.activityLogs.filter(log =>
        log.action.toLowerCase().includes(filterTerm) ||
        log.description.toLowerCase().includes(filterTerm) ||
        log.adminUser.toLowerCase().includes(filterTerm)
      );
    }

    return {
      success: true,
      logs: filteredLogs.slice(0, limit)
    };
  }

  // Cleanup old data
  cleanupOldData() {
    if (!this.isAdminAuthenticated()) {
      return { success: false, error: 'לא מורשה' };
    }

    // Keep only last 30 days of logs
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.activityLogs = this.activityLogs.filter(log =>
      new Date(log.timestamp).getTime() > thirtyDaysAgo
    );

    localStorage.setItem('activityLogs', JSON.stringify(this.activityLogs));
    this.logActivity('cleanup_data', 'Cleaned up old activity logs');

    return { success: true, message: 'נתונים ישנים נוקו בהצלחה' };
  }
}

export default AdminSystem;