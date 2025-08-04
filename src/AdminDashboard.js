import React, { useState, useEffect } from 'react';
import AdminSystem from './AdminSystem';
import './AdminDashboard.css';

const AdminDashboard = ({ onClose, showNotification }) => {
  const [adminSystem] = useState(new AdminSystem());
  const [currentView, setCurrentView] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [systemStats, setSystemStats] = useState({});
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  
  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [userFilters, setUserFilters] = useState({
    subscriptionType: 'all',
    isVerified: undefined,
    minAge: '',
    maxAge: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Check if admin is already authenticated
    if (adminSystem.isAdminAuthenticated()) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, [adminSystem]);

  useEffect(() => {
    // Auto-refresh data every 30 seconds when authenticated
    if (isAuthenticated) {
      const interval = setInterval(() => {
        loadDashboardData();
        adminSystem.refreshSession();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, adminSystem]);

  const loadDashboardData = async () => {
    try {
      // Update system stats
      adminSystem.updateSystemStats();
      setSystemStats(adminSystem.systemStats);

      // Load users
      const usersResult = adminSystem.getAllUsers();
      if (usersResult.success) {
        setUsers(usersResult.users);
      }

      // Load reports
      const reportsResult = adminSystem.getAllReports();
      if (reportsResult.success) {
        setReports(reportsResult.reports);
      }

      // Load activity logs
      const logsResult = adminSystem.getActivityLogs(50);
      if (logsResult.success) {
        setActivityLogs(logsResult.logs);
      }

      // Load system settings
      const settingsResult = adminSystem.getSystemSettings();
      if (settingsResult.success) {
        setSystemSettings(settingsResult.settings);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showNotification('שגיאה בטעינת נתוני הדשבורד', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = adminSystem.authenticateAdmin(loginForm.username, loginForm.password);
      
      if (result.success) {
        setIsAuthenticated(true);
        showNotification('התחברת בהצלחה לדשבורד המנהלים', 'success');
        await loadDashboardData();
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('שגיאה בהתחברות', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminSystem.logoutAdmin();
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    showNotification('התנתקת בהצלחה', 'info');
  };

  const handleUserSearch = () => {
    const result = adminSystem.searchUsers(userSearch, userFilters);
    if (result.success) {
      setUsers(result.users);
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      const reason = prompt('נא להכניס סיבה למחיקה:');
      const result = adminSystem.deleteUser(userId, reason);
      
      if (result.success) {
        showNotification('המשתמש נמחק בהצלחה', 'success');
        loadDashboardData();
      } else {
        showNotification(result.error, 'error');
      }
    }
  };

  const handleUpdateReportStatus = (reportId, status) => {
    const adminNotes = prompt('הערות מנהל (אופציונלי):');
    const result = adminSystem.updateReportStatus(reportId, status, adminNotes);
    
    if (result.success) {
      showNotification('סטטוס הדיווח עודכן בהצלחה', 'success');
      loadDashboardData();
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleExportData = (format) => {
    const result = adminSystem.exportUserData(format);
    
    if (result.success) {
      const dataStr = format === 'csv' ? result.data : JSON.stringify(result.data, null, 2);
      const dataBlob = new Blob([dataStr], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `IsraLove-Data-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      
      URL.revokeObjectURL(url);
      showNotification(`נתונים יוצאו בהצלחה כ-${format.toUpperCase()}`, 'success');
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleUpdateSettings = (newSettings) => {
    const result = adminSystem.updateSystemSettings(newSettings);
    
    if (result.success) {
      setSystemSettings(newSettings);
      showNotification('הגדרות המערכת עודכנו בהצלחה', 'success');
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-overlay">
        <div className="admin-login-container">
          <button className="admin-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>דשבורד מנהלים</h2>
            <p>הכנס פרטי התחברות למנהל</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>שם משתמש</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="form-input"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>סיסמה</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  מתחבר...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  התחבר
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>גישה מורשית בלבד</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="admin-overlay">
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="admin-header-left">
            <div className="admin-logo">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="admin-title">
              <h1>דשבורד מנהלים</h1>
              <p>ברוך הבא, {adminSystem.currentAdmin?.username}</p>
            </div>
          </div>
          
          <div className="admin-header-right">
            <div className="admin-stats-mini">
              <div className="stat-mini">
                <i className="fas fa-users"></i>
                <span>{systemStats.totalUsers || 0}</span>
                משתמשים
              </div>
              <div className="stat-mini">
                <i className="fas fa-crown"></i>
                <span>{systemStats.premiumUsers || 0}</span>
                פרימיום
              </div>
              <div className="stat-mini">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{reports.filter(r => r.status === 'pending').length}</span>
                דיווחים
              </div>
            </div>
            
            <button className="admin-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              התנתק
            </button>
            <button className="admin-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <button 
                className={`admin-nav-item ${currentView === 'overview' ? 'active' : ''}`}
                onClick={() => setCurrentView('overview')}
              >
                <i className="fas fa-home"></i>
                סקירה כללית
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'users' ? 'active' : ''}`}
                onClick={() => setCurrentView('users')}
              >
                <i className="fas fa-users"></i>
                ניהול משתמשים
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'reports' ? 'active' : ''}`}
                onClick={() => setCurrentView('reports')}
              >
                <i className="fas fa-flag"></i>
                דיווחים ({reports.filter(r => r.status === 'pending').length})
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => setCurrentView('analytics')}
              >
                <i className="fas fa-chart-bar"></i>
                אנליטיקס
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'logs' ? 'active' : ''}`}
                onClick={() => setCurrentView('logs')}
              >
                <i className="fas fa-list-alt"></i>
                לוגי פעילות
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentView('settings')}
              >
                <i className="fas fa-cog"></i>
                הגדרות מערכת
              </button>
              <button 
                className={`admin-nav-item ${currentView === 'export' ? 'active' : ''}`}
                onClick={() => setCurrentView('export')}
              >
                <i className="fas fa-download"></i>
                ייצוא נתונים
              </button>
            </nav>
          </div>

          <div className="admin-main">
            {currentView === 'overview' && (
              <div className="admin-overview">
                <h2>סקירה כללית</h2>
                
                <div className="stats-grid">
                  <div className="stat-card users">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.totalUsers || 0}</h3>
                      <p>סך המשתמשים</p>
                      <small>{systemStats.dailySignups || 0} נרשמו היום</small>
                    </div>
                  </div>
                  
                  <div className="stat-card active">
                    <div className="stat-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.activeUsers || 0}</h3>
                      <p>משתמשים פעילים</p>
                      <small>בשבוע האחרון</small>
                    </div>
                  </div>
                  
                  <div className="stat-card premium">
                    <div className="stat-icon">
                      <i className="fas fa-crown"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.premiumUsers || 0}</h3>
                      <p>מנויי פרימיום</p>
                      <small>₪{systemStats.monthlyRevenue || 0} הכנסה חודשית</small>
                    </div>
                  </div>
                  
                  <div className="stat-card matches">
                    <div className="stat-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.totalMatches || 0}</h3>
                      <p>סך ההתאמות</p>
                      <small>כל הזמנים</small>
                    </div>
                  </div>
                  
                  <div className="stat-card messages">
                    <div className="stat-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.totalMessages || 0}</h3>
                      <p>סך ההודעות</p>
                      <small>נשלחו</small>
                    </div>
                  </div>
                  
                  <div className="stat-card reports">
                    <div className="stat-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{systemStats.reportedUsers || 0}</h3>
                      <p>דיווחים פתוחים</p>
                      <small>דורש טיפול</small>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>פעילות אחרונה</h3>
                  <div className="activity-list">
                    {activityLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="activity-item">
                        <div className="activity-icon">
                          <i className={getActivityIcon(log.action)}></i>
                        </div>
                        <div className="activity-content">
                          <p>{log.description}</p>
                          <small>{new Date(log.timestamp).toLocaleString('he-IL')}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'users' && (
              <div className="admin-users">
                <div className="users-header">
                  <h2>ניהול משתמשים</h2>
                  
                  <div className="users-controls">
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="חפש לפי מייל, שם או ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="search-input"
                      />
                      <button onClick={handleUserSearch} className="search-btn">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                    
                    <div className="filters">
                      <select
                        value={userFilters.subscriptionType}
                        onChange={(e) => setUserFilters({...userFilters, subscriptionType: e.target.value})}
                        className="filter-select"
                      >
                        <option value="all">כל המנויים</option>
                        <option value="free">חינם</option>
                        <option value="basic">בסיסי</option>
                        <option value="premium">פרימיום</option>
                        <option value="vip">VIP</option>
                      </select>
                      
                      <select
                        value={userFilters.isVerified === undefined ? 'all' : userFilters.isVerified.toString()}
                        onChange={(e) => setUserFilters({
                          ...userFilters, 
                          isVerified: e.target.value === 'all' ? undefined : e.target.value === 'true'
                        })}
                        className="filter-select"
                      >
                        <option value="all">כל הסטטוסים</option>
                        <option value="true">מאומת</option>
                        <option value="false">לא מאומת</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="users-table">
                  <div className="table-header">
                    <div className="table-cell">ID</div>
                    <div className="table-cell">משתמש</div>
                    <div className="table-cell">גיל</div>
                    <div className="table-cell">מנוי</div>
                    <div className="table-cell">מאומת</div>
                    <div className="table-cell">תמונות</div>
                    <div className="table-cell">ציון בטיחות</div>
                    <div className="table-cell">פעולות</div>
                  </div>
                  
                  {users.map(user => (
                    <div key={user.id} className="table-row">
                      <div className="table-cell">{user.id}</div>
                      <div className="table-cell">
                        <div className="user-info">
                          <strong>{user.firstName} {user.lastName}</strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                      <div className="table-cell">{user.age}</div>
                      <div className="table-cell">
                        <span className={`subscription-badge ${user.subscriptionType}`}>
                          {user.subscriptionType}
                        </span>
                      </div>
                      <div className="table-cell">
                        <span className={`verification-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                          <i className={`fas ${user.isVerified ? 'fa-check' : 'fa-times'}`}></i>
                        </span>
                      </div>
                      <div className="table-cell">{user.photos}</div>
                      <div className="table-cell">
                        <span className={`safety-score ${getSafetyScoreClass(user.safetyScore)}`}>
                          {user.safetyScore}
                        </span>
                      </div>
                      <div className="table-cell">
                        <button 
                          className="action-btn view"
                          onClick={() => setSelectedUser(user)}
                          title="צפה בפרטים"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="מחק משתמש"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'reports' && (
              <div className="admin-reports">
                <h2>ניהול דיווחים</h2>
                
                <div className="reports-stats">
                  <div className="report-stat pending">
                    <span>{reports.filter(r => r.status === 'pending').length}</span>
                    ממתינים
                  </div>
                  <div className="report-stat resolved">
                    <span>{reports.filter(r => r.status === 'resolved').length}</span>
                    טופלו
                  </div>
                  <div className="report-stat rejected">
                    <span>{reports.filter(r => r.status === 'rejected').length}</span>
                    נדחו
                  </div>
                </div>

                <div className="reports-list">
                  {reports.map(report => (
                    <div key={report.id} className={`report-card ${report.status}`}>
                      <div className="report-header">
                        <div className="report-category">
                          <i className={getReportIcon(report.category)}></i>
                          {getReportCategoryName(report.category)}
                        </div>
                        <div className="report-date">
                          {new Date(report.timestamp).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                      
                      <div className="report-content">
                        <p><strong>נדווח:</strong> משתמש #{report.reportedUserId}</p>
                        <p><strong>מדווח:</strong> משתמש #{report.reporterId}</p>
                        <p><strong>תיאור:</strong> {report.description}</p>
                        {report.adminNotes && (
                          <p><strong>הערות מנהל:</strong> {report.adminNotes}</p>
                        )}
                      </div>
                      
                      <div className="report-actions">
                        <span className={`status-badge ${report.status}`}>
                          {getStatusText(report.status)}
                        </span>
                        
                        {report.status === 'pending' && (
                          <div className="action-buttons">
                            <button 
                              className="btn-resolve"
                              onClick={() => handleUpdateReportStatus(report.id, 'resolved')}
                            >
                              <i className="fas fa-check"></i>
                              פתור
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => handleUpdateReportStatus(report.id, 'rejected')}
                            >
                              <i className="fas fa-times"></i>
                              דחה
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'analytics' && (
              <div className="admin-analytics">
                <h2>אנליטיקס ונתונים</h2>
                
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>התפלגות גילאים</h3>
                    <div className="age-distribution">
                      {getAgeDistribution(users).map(range => (
                        <div key={range.label} className="age-bar">
                          <span className="age-label">{range.label}</span>
                          <div className="age-progress">
                            <div 
                              className="age-fill" 
                              style={{ width: `${range.percentage}%` }}
                            ></div>
                          </div>
                          <span className="age-count">{range.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h3>התפלגות מנויים</h3>
                    <div className="subscription-chart">
                      {getSubscriptionDistribution(users).map(sub => (
                        <div key={sub.type} className={`subscription-slice ${sub.type}`}>
                          <div className="subscription-info">
                            <span className="subscription-label">{sub.label}</span>
                            <span className="subscription-count">{sub.count}</span>
                            <span className="subscription-percentage">{sub.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h3>פעילות דיווחים</h3>
                    <div className="reports-chart">
                      {getReportsDistribution(reports).map(category => (
                        <div key={category.type} className="report-category-bar">
                          <span className="category-label">{category.label}</span>
                          <div className="category-progress">
                            <div 
                              className="category-fill" 
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="category-count">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'logs' && (
              <div className="admin-logs">
                <h2>לוגי פעילות</h2>
                
                <div className="logs-list">
                  {activityLogs.map(log => (
                    <div key={log.id} className={`log-item ${log.action}`}>
                      <div className="log-icon">
                        <i className={getActivityIcon(log.action)}></i>
                      </div>
                      <div className="log-content">
                        <div className="log-description">{log.description}</div>
                        <div className="log-meta">
                          <span>מנהל: {log.adminUser}</span>
                          <span>תאריך: {new Date(log.timestamp).toLocaleString('he-IL')}</span>
                          {log.userId && <span>משתמש: #{log.userId}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'settings' && (
              <div className="admin-settings">
                <h2>הגדרות מערכת</h2>
                
                <div className="settings-form">
                  <div className="setting-group">
                    <label>שם האתר</label>
                    <input
                      type="text"
                      value={systemSettings.siteName || ''}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      className="setting-input"
                    />
                  </div>
                  
                  <div className="setting-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode || false}
                        onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                      />
                      מצב תחזוקה
                    </label>
                  </div>
                  
                  <div className="setting-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={systemSettings.registrationEnabled !== false}
                        onChange={(e) => setSystemSettings({...systemSettings, registrationEnabled: e.target.checked})}
                      />
                      הרשמה מופעלת
                    </label>
                  </div>
                  
                  <div className="setting-group">
                    <label>מספר תמונות מקסימלי למשתמש</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={systemSettings.maxPhotosPerUser || 5}
                      onChange={(e) => setSystemSettings({...systemSettings, maxPhotosPerUser: parseInt(e.target.value)})}
                      className="setting-input"
                    />
                  </div>
                  
                  <div className="setting-group">
                    <label>גיל מינימלי</label>
                    <input
                      type="number"
                      min="16"
                      max="25"
                      value={systemSettings.minAge || 18}
                      onChange={(e) => setSystemSettings({...systemSettings, minAge: parseInt(e.target.value)})}
                      className="setting-input"
                    />
                  </div>
                  
                  <button 
                    className="save-settings-btn"
                    onClick={() => handleUpdateSettings(systemSettings)}
                  >
                    <i className="fas fa-save"></i>
                    שמור הגדרות
                  </button>
                </div>
              </div>
            )}

            {currentView === 'export' && (
              <div className="admin-export">
                <h2>ייצוא נתונים</h2>
                
                <div className="export-options">
                  <div className="export-card">
                    <div className="export-icon">
                      <i className="fas fa-file-csv"></i>
                    </div>
                    <h3>ייצוא לCSV</h3>
                    <p>ייצא את כל נתוני המשתמשים לקובץ CSV לפתיחה באקסל</p>
                    <button 
                      className="export-btn csv"
                      onClick={() => handleExportData('csv')}
                    >
                      <i className="fas fa-download"></i>
                      ייצא CSV
                    </button>
                  </div>
                  
                  <div className="export-card">
                    <div className="export-icon">
                      <i className="fas fa-file-code"></i>
                    </div>
                    <h3>ייצוא לJSON</h3>
                    <p>ייצא את כל הנתונים בפורמט JSON למעבדים</p>
                    <button 
                      className="export-btn json"
                      onClick={() => handleExportData('json')}
                    >
                      <i className="fas fa-download"></i>
                      ייצא JSON
                    </button>
                  </div>
                  
                  <div className="export-card">
                    <div className="export-icon">
                      <i className="fas fa-broom"></i>
                    </div>
                    <h3>ניקוי נתונים</h3>
                    <p>נקה נתונים ישנים ולוגים מעל 30 יום</p>
                    <button 
                      className="export-btn cleanup"
                      onClick={() => {
                        if (window.confirm('האם אתה בטוח? פעולה זו לא ניתנת לביטול.')) {
                          const result = adminSystem.cleanupOldData();
                          if (result.success) {
                            showNotification(result.message, 'success');
                            loadDashboardData();
                          } else {
                            showNotification(result.error, 'error');
                          }
                        }
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                      נקה נתונים
                    </button>
                  </div>
                </div>
                
                <div className="export-summary">
                  <h3>סיכום נתונים לייצוא</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">סך המשתמשים:</span>
                      <span className="summary-value">{users.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">דיווחים:</span>
                      <span className="summary-value">{reports.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">לוגי פעילות:</span>
                      <span className="summary-value">{activityLogs.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">הכנסה חודשית:</span>
                      <span className="summary-value">₪{systemStats.monthlyRevenue || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>פרטי משתמש #{selectedUser.id}</h3>
                <button onClick={() => setSelectedUser(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="user-details-grid">
                  <div className="detail-item">
                    <label>שם מלא:</label>
                    <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label>אימייל:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>גיל:</label>
                    <span>{selectedUser.age}</span>
                  </div>
                  <div className="detail-item">
                    <label>תאריך הרשמה:</label>
                    <span>{new Date(selectedUser.registrationDate).toLocaleDateString('he-IL')}</span>
                  </div>
                  <div className="detail-item">
                    <label>סוג מנוי:</label>
                    <span className={`subscription-badge ${selectedUser.subscriptionType}`}>
                      {selectedUser.subscriptionType}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>מאומת:</label>
                    <span className={`verification-badge ${selectedUser.isVerified ? 'verified' : 'unverified'}`}>
                      <i className={`fas ${selectedUser.isVerified ? 'fa-check' : 'fa-times'}`}></i>
                      {selectedUser.isVerified ? 'מאומת' : 'לא מאומת'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>מספר תמונות:</label>
                    <span>{selectedUser.photos}</span>
                  </div>
                  <div className="detail-item">
                    <label>שאלות שנענו:</label>
                    <span>{selectedUser.questionsAnswered}/25</span>
                  </div>
                  <div className="detail-item">
                    <label>ציון בטיחות:</label>
                    <span className={`safety-score ${getSafetyScoreClass(selectedUser.safetyScore)}`}>
                      {selectedUser.safetyScore}/100
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>פעילות אחרונה:</label>
                    <span>{selectedUser.lastActive}</span>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button 
                    className="btn-danger"
                    onClick={() => {
                      handleDeleteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    מחק משתמש
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper functions
  function getActivityIcon(action) {
    const icons = {
      admin_login: 'fas fa-sign-in-alt',
      admin_logout: 'fas fa-sign-out-alt',
      view_user: 'fas fa-eye',
      update_user: 'fas fa-edit',
      delete_user: 'fas fa-trash',
      update_report: 'fas fa-flag',
      export_data: 'fas fa-download',
      update_settings: 'fas fa-cog',
      cleanup_data: 'fas fa-broom'
    };
    return icons[action] || 'fas fa-info-circle';
  }

  function getReportIcon(category) {
    const icons = {
      inappropriate_content: 'fas fa-exclamation-triangle',
      harassment: 'fas fa-user-times',
      fake_profile: 'fas fa-mask',
      spam: 'fas fa-ban',
      underage: 'fas fa-child',
      scam: 'fas fa-skull-crossbones'
    };
    return icons[category] || 'fas fa-flag';
  }

  function getReportCategoryName(category) {
    const names = {
      inappropriate_content: 'תוכן לא הולם',
      harassment: 'הטרדה',
      fake_profile: 'פרופיל מזויף',
      spam: 'ספאם',
      underage: 'קטין',
      scam: 'הונאה'
    };
    return names[category] || category;
  }

  function getStatusText(status) {
    const texts = {
      pending: 'ממתין',
      resolved: 'טופל',
      rejected: 'נדחה'
    };
    return texts[status] || status;
  }

  function getSafetyScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  function getAgeDistribution(users) {
    const ranges = [
      { label: '18-25', min: 18, max: 25 },
      { label: '26-35', min: 26, max: 35 },
      { label: '36-45', min: 36, max: 45 },
      { label: '46-55', min: 46, max: 55 },
      { label: '56+', min: 56, max: 100 }
    ];

    return ranges.map(range => {
      const count = users.filter(user => user.age >= range.min && user.age <= range.max).length;
      const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      return { ...range, count, percentage };
    });
  }

  function getSubscriptionDistribution(users) {
    const types = ['free', 'basic', 'premium', 'vip'];
    const labels = { free: 'חינם', basic: 'בסיסי', premium: 'פרימיום', vip: 'VIP' };

    return types.map(type => {
      const count = users.filter(user => user.subscriptionType === type).length;
      const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      return { type, label: labels[type], count, percentage };
    });
  }

  function getReportsDistribution(reports) {
    const categories = [
      'inappropriate_content',
      'harassment', 
      'fake_profile',
      'spam',
      'underage',
      'scam'
    ];

    return categories.map(category => {
      const count = reports.filter(report => report.category === category).length;
      const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
      return { 
        type: category, 
        label: getReportCategoryName(category), 
        count, 
        percentage 
      };
    });
  }
};

export default AdminDashboard;