import React, { useState, useEffect } from 'react';
import SafetySystem from './SafetySystem';
import './SafetyUI.css';

const SafetyUI = ({ onClose, showNotification, targetUserId = null, context = 'general' }) => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'report', 'block', 'verify', 'guidelines', 'panic'
  const [safetySystem] = useState(new SafetySystem());
  const [stats, setStats] = useState({});
  const [reportForm, setReportForm] = useState({
    category: '',
    subcategory: '',
    description: '',
    evidence: []
  });
  const [verificationFile, setVerificationFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [panicMode, setPanicMode] = useState(false);

  useEffect(() => {
    loadSafetyData();
    
    // If opened for specific user context
    if (targetUserId && context === 'report') {
      setCurrentView('report');
    }
  }, [targetUserId, context]);

  const loadSafetyData = () => {
    const safetyStats = safetySystem.getSafetyStats();
    setStats(safetyStats);
    setBlockedUsers(safetySystem.getBlockedUsers());
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportForm.category || !reportForm.description.trim()) {
      showNotification('נא למלא את כל השדות הנדרשים');
      return;
    }

    setLoading(true);

    try {
      const result = safetySystem.reportUser(
        targetUserId,
        reportForm.category,
        reportForm.subcategory,
        reportForm.description,
        reportForm.evidence
      );

      if (result.success) {
        showNotification(`✅ ${result.message}`);
        setReportForm({ category: '', subcategory: '', description: '', evidence: [] });
        loadSafetyData();
        
        // Ask if user also wants to block
        if (window.confirm('האם ברצונך גם לחסום את המשתמש?')) {
          handleBlockUser();
        } else {
          setCurrentView('overview');
        }
      }
    } catch (error) {
      showNotification('❌ שגיאה בשליחת הדיווח');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = () => {
    const result = safetySystem.blockUser(targetUserId, 'manual', 'חסימה ידנית');
    
    if (result.success) {
      showNotification(`🛡️ ${result.message}`);
      loadSafetyData();
      onClose();
    } else {
      showNotification(`❌ ${result.error}`);
    }
  };

  const handleUnblockUser = (userId) => {
    const result = safetySystem.unblockUser(userId);
    
    if (result.success) {
      showNotification(`✅ ${result.message}`);
      loadSafetyData();
    } else {
      showNotification(`❌ ${result.error}`);
    }
  };

  const handlePhotoVerification = async () => {
    if (!verificationFile) {
      showNotification('נא לבחור תמונה לאימות');
      return;
    }

    setLoading(true);

    try {
      const result = await safetySystem.initiatePhotoVerification(verificationFile);
      
      if (result.success) {
        showNotification(`🎉 ${result.message}`);
        loadSafetyData();
        setVerificationFile(null);
      } else {
        showNotification(`❌ ${result.message}`);
      }
    } catch (error) {
      showNotification('❌ שגיאה בתהליך האימות');
    } finally {
      setLoading(false);
    }
  };

  const handlePanicButton = () => {
    setPanicMode(true);
    
    // Get user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          const result = safetySystem.activatePanicMode(location, 'מצב חירום מהאתר');
          showNotification(`🚨 ${result.message}`);
          
          // Show emergency instructions
          setCurrentView('panic');
        },
        () => {
          // If location access denied, still activate panic mode
          const result = safetySystem.activatePanicMode(null, 'מצב חירום מהאתר - ללא מיקום');
          showNotification(`🚨 ${result.message}`);
          setCurrentView('panic');
        }
      );
    } else {
      const result = safetySystem.activatePanicMode(null, 'מצב חירום מהאתר');
      showNotification(`🚨 ${result.message}`);
      setCurrentView('panic');
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('קובץ גדול מדי - מקסימום 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        showNotification('רק קבצי תמונה מותרים');
        return;
      }
      
      setVerificationFile(file);
    }
  };

  return (
    <div className="safety-overlay">
      <div className="safety-modal">
        {/* Header */}
        <div className="safety-header">
          <h2>
            <i className="fas fa-shield-alt"></i>
            מרכז בטיחות ואבטחה
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Panic Button - Always Visible */}
        <div className="panic-section">
          <button 
            className={`panic-button ${panicMode ? 'active' : ''}`}
            onClick={handlePanicButton}
            disabled={panicMode}
          >
            <i className="fas fa-exclamation-triangle"></i>
            {panicMode ? 'מצב חירום פעיל' : 'כפתור חירום'}
          </button>
        </div>

        {/* Overview */}
        {currentView === 'overview' && (
          <div className="safety-overview">
            <div className="safety-score-section">
              <h3>ציון הבטיחות שלך</h3>
              <div className="score-circle">
                <div 
                  className="circle-progress" 
                  style={{
                    background: `conic-gradient(${getSafetyScoreColor(stats.safetyScore)} ${stats.safetyScore * 3.6}deg, #e9ecef 0deg)`
                  }}
                >
                  <div className="circle-inner">
                    <span className="score" style={{ color: getSafetyScoreColor(stats.safetyScore) }}>
                      {stats.safetyScore}
                    </span>
                    <small>מתוך 100</small>
                  </div>
                </div>
              </div>
              <div className="verification-status">
                <i className={`fas ${stats.verificationStatus === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                <span>
                  {stats.verificationStatus === 'verified' ? 'פרופיל מאומת' : 'לא מאומת'}
                </span>
              </div>
            </div>

            <div className="safety-stats-grid">
              <div className="stat-card">
                <i className="fas fa-ban"></i>
                <div className="stat-info">
                  <h4>{stats.blockedUsers}</h4>
                  <p>משתמשים חסומים</p>
                </div>
              </div>
              
              <div className="stat-card">
                <i className="fas fa-flag"></i>
                <div className="stat-info">
                  <h4>{stats.reportsSubmitted}</h4>
                  <p>דיווחים שלחת</p>
                </div>
              </div>
              
              <div className="stat-card">
                <i className="fas fa-exclamation-triangle"></i>
                <div className="stat-info">
                  <h4>{stats.reportsReceived}</h4>
                  <p>דיווחים עליך</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {stats.recommendations && stats.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>המלצות לשיפור הבטיחות</h3>
                <div className="recommendations-list">
                  {stats.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-card ${rec.priority}`}>
                      <i className={rec.icon}></i>
                      <div className="rec-content">
                        <h4>{rec.title}</h4>
                        <p>{rec.description}</p>
                      </div>
                      <button 
                        className="rec-action"
                        onClick={() => {
                          if (rec.action === 'verify_profile') setCurrentView('verify');
                          if (rec.action === 'add_photos') onClose();
                        }}
                      >
                        פעולה
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
              <button className="action-btn verify" onClick={() => setCurrentView('verify')}>
                <i className="fas fa-shield-check"></i>
                אמת פרופיל
              </button>
              
              <button className="action-btn guidelines" onClick={() => setCurrentView('guidelines')}>
                <i className="fas fa-book"></i>
                כללי בטיחות
              </button>
              
              {blockedUsers.length > 0 && (
                <button className="action-btn blocked" onClick={() => setCurrentView('block')}>
                  <i className="fas fa-ban"></i>
                  משתמשים חסומים
                </button>
              )}
            </div>
          </div>
        )}

        {/* Report User */}
        {currentView === 'report' && (
          <div className="report-section">
            <h3>דווח על משתמש</h3>
            
            <form onSubmit={handleReportSubmit} className="report-form">
              <div className="form-group">
                <label>סוג הדיווח *</label>
                <select 
                  value={reportForm.category}
                  onChange={(e) => setReportForm({...reportForm, category: e.target.value, subcategory: ''})}
                  className="form-select"
                >
                  <option value="">בחר סוג דיווח</option>
                  {Object.values(safetySystem.reportCategories).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {reportForm.category && (
                <div className="form-group">
                  <label>פירוט</label>
                  <select 
                    value={reportForm.subcategory}
                    onChange={(e) => setReportForm({...reportForm, subcategory: e.target.value})}
                    className="form-select"
                  >
                    <option value="">בחר פירוט (אופציונלי)</option>
                    {safetySystem.reportCategories[reportForm.category]?.subcategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>תיאור המקרה *</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                  className="form-textarea"
                  placeholder="תאר מה קרה..."
                  rows="4"
                  maxLength="1000"
                />
                <small>{reportForm.description.length}/1000</small>
              </div>

              <div className="form-group">
                <label>צירוף ראיות (אופציונלי)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setReportForm({...reportForm, evidence: Array.from(e.target.files)})}
                  className="form-file"
                />
                <small>ניתן לצרף תמונות כראיה</small>
              </div>

              <div className="report-actions">
                <button type="button" className="cancel-btn" onClick={() => setCurrentView('overview')}>
                  ביטול
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || !reportForm.category || !reportForm.description.trim()}
                >
                  {loading ? 'שולח דיווח...' : 'שלח דיווח'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blocked Users */}
        {currentView === 'block' && (
          <div className="blocked-section">
            <h3>משתמשים חסומים ({blockedUsers.length})</h3>
            
            {blockedUsers.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-ban"></i>
                <p>אין משתמשים חסומים</p>
              </div>
            ) : (
              <div className="blocked-list">
                {blockedUsers.map((blocked, index) => (
                  <div key={index} className="blocked-item">
                    <div className="blocked-info">
                      <h4>משתמש #{blocked.userId}</h4>
                      <p>נחסם ב: {new Date(blocked.timestamp).toLocaleDateString('he-IL')}</p>
                      <small>סיבה: {blocked.reason === 'manual' ? 'חסימה ידנית' : blocked.reason}</small>
                    </div>
                    <button 
                      className="unblock-btn"
                      onClick={() => handleUnblockUser(blocked.userId)}
                    >
                      בטל חסימה
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photo Verification */}
        {currentView === 'verify' && (
          <div className="verify-section">
            <h3>אימות פרופיל</h3>
            
            <div className="verify-status">
              <div className={`status-badge ${stats.verificationStatus}`}>
                <i className={`fas ${stats.verificationStatus === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                <span>
                  {stats.verificationStatus === 'verified' ? 'מאומת' : 'לא מאומת'}
                </span>
              </div>
            </div>

            {stats.verificationStatus !== 'verified' && (
              <div className="verify-process">
                <div className="verify-instructions">
                  <h4>איך זה עובד?</h4>
                  <ol>
                    <li>צלם תמונת סלפי ברורה</li>
                    <li>ודא שהפנים שלך נראות בבירור</li>
                    <li>הוריד את התמונה</li>
                    <li>אנחנו נבדוק שהיא תואמת לתמונות הפרופיל</li>
                  </ol>
                </div>

                <div className="verify-upload">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="verification-file"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="verification-file" className="upload-btn">
                    <i className="fas fa-camera"></i>
                    {verificationFile ? verificationFile.name : 'בחר תמונה לאימות'}
                  </label>
                </div>

                {verificationFile && (
                  <div className="verify-actions">
                    <button 
                      className="verify-submit-btn"
                      onClick={handlePhotoVerification}
                      disabled={loading}
                    >
                      {loading ? 'מעבד אימות...' : 'שלח לאימות'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {stats.verificationStatus === 'verified' && (
              <div className="verified-message">
                <i className="fas fa-check-circle"></i>
                <h4>הפרופיל שלך מאומת!</h4>
                <p>יש לך תג אימות כחול שמעיד על האמינות שלך</p>
              </div>
            )}
          </div>
        )}

        {/* Safety Guidelines */}
        {currentView === 'guidelines' && (
          <div className="guidelines-section">
            <h3>כללי בטיחות לפגישות</h3>
            
            <div className="guidelines-tabs">
              <div className="guideline-category">
                <h4>
                  <i className="fas fa-calendar-check"></i>
                  לפני הפגישה
                </h4>
                <ul>
                  {safetySystem.getSafeMeetingGuidelines().before_meeting.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="guideline-category">
                <h4>
                  <i className="fas fa-users"></i>
                  במהלך הפגישה
                </h4>
                <ul>
                  {safetySystem.getSafeMeetingGuidelines().during_meeting.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="guideline-category danger">
                <h4>
                  <i className="fas fa-exclamation-triangle"></i>
                  סימני אזהרה
                </h4>
                <ul>
                  {safetySystem.getSafeMeetingGuidelines().red_flags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Panic Mode */}
        {currentView === 'panic' && (
          <div className="panic-section">
            <div className="panic-active">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>מצב חירום פעיל</h3>
              <p>הצוות שלנו קיבל התראה ויטפל בנושא</p>
            </div>

            <div className="emergency-instructions">
              <h4>הוראות חירום:</h4>
              <ul>
                <li>הישאר במקום בטוח וציבורי</li>
                <li>אל תחלוק מידע אישי נוסף</li>
                <li>צור קשר עם משטרה: 100</li>
                <li>צור קשר עם מד"א: 101</li>
                <li>הודע לחבר או בן משפחה על מיקומך</li>
              </ul>
            </div>

            <div className="emergency-contacts">
              <h4>מספרי חירום:</h4>
              <div className="contact-buttons">
                <a href="tel:100" className="emergency-btn police">
                  <i className="fas fa-shield-alt"></i>
                  משטרה 100
                </a>
                <a href="tel:101" className="emergency-btn ambulance">
                  <i className="fas fa-ambulance"></i>
                  מד"א 101
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentView !== 'panic' && (
          <div className="safety-navigation">
            <button 
              className={`nav-btn ${currentView === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentView('overview')}
            >
              <i className="fas fa-home"></i>
              סקירה
            </button>
            
            <button 
              className={`nav-btn ${currentView === 'verify' ? 'active' : ''}`}
              onClick={() => setCurrentView('verify')}
            >
              <i className="fas fa-shield-check"></i>
              אימות
            </button>
            
            <button 
              className={`nav-btn ${currentView === 'guidelines' ? 'active' : ''}`}
              onClick={() => setCurrentView('guidelines')}
            >
              <i className="fas fa-book"></i>
              כללים
            </button>
            
            {targetUserId && (
              <button 
                className={`nav-btn ${currentView === 'report' ? 'active' : ''}`}
                onClick={() => setCurrentView('report')}
              >
                <i className="fas fa-flag"></i>
                דווח
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyUI;