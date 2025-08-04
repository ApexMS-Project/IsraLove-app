import React, { useState, useEffect } from 'react';
import UIEnhancements from './UIEnhancements';
import './ThemeSelector.css';

const ThemeSelector = ({ onClose, showNotification }) => {
  const [uiEnhancements] = useState(new UIEnhancements());
  const [currentView, setCurrentView] = useState('themes'); // 'themes', 'animations', 'accessibility', 'notifications'
  const [selectedTheme, setSelectedTheme] = useState(uiEnhancements.getCurrentTheme().id);
  const [settings, setSettings] = useState({
    // Animation settings
    enableAnimations: localStorage.getItem('enableAnimations') !== 'false',
    animationSpeed: localStorage.getItem('animationSpeed') || 'normal',
    enableParticles: localStorage.getItem('enableParticles') !== 'false',
    enableRipples: localStorage.getItem('enableRipples') !== 'false',
    
    // Accessibility settings
    highContrast: localStorage.getItem('highContrast') === 'true',
    largeText: localStorage.getItem('largeText') === 'true',
    reducedMotion: localStorage.getItem('reducedMotion') === 'true',
    screenReaderMode: localStorage.getItem('screenReaderMode') === 'true',
    
    // Notification settings
    notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
    notificationSound: localStorage.getItem('notificationSound') !== 'false',
    notificationDuration: parseInt(localStorage.getItem('notificationDuration')) || 4000,
    maxNotifications: parseInt(localStorage.getItem('maxNotifications')) || 5,
    
    // Performance settings
    enableBlur: localStorage.getItem('enableBlur') !== 'false',
    enableShadows: localStorage.getItem('enableShadows') !== 'false',
    enableGradients: localStorage.getItem('enableGradients') !== 'false'
  });

  useEffect(() => {
    // Apply current settings on component mount
    applySettings();
  }, []);

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    const success = uiEnhancements.applyTheme(themeId);
    
    if (success) {
      showNotification(
        `ערכת הנושא שונתה ל${uiEnhancements.getCurrentTheme().name}`,
        'success'
      );
      
      // Add particle effect
      if (settings.enableParticles) {
        const themeButton = document.querySelector(`[data-theme="${themeId}"]`);
        if (themeButton) {
          uiEnhancements.addParticleEffect(themeButton, 15);
        }
      }
    }
  };

  const handleSettingChange = (settingKey, value) => {
    const newSettings = { ...settings, [settingKey]: value };
    setSettings(newSettings);
    localStorage.setItem(settingKey, value.toString());
    
    // Apply setting immediately
    applySingleSetting(settingKey, value);
    
    showNotification(
      `הגדרה עודכנה: ${getSettingLabel(settingKey)}`,
      'info'
    );
  };

  const applySingleSetting = (settingKey, value) => {
    const root = document.documentElement;
    
    switch (settingKey) {
      case 'enableAnimations':
        root.style.setProperty('--transition-fast', value ? '0.2s ease' : '0s');
        root.style.setProperty('--transition-normal', value ? '0.3s ease' : '0s');
        root.style.setProperty('--transition-slow', value ? '0.5s ease' : '0s');
        break;
        
      case 'animationSpeed':
        const speedMultipliers = { slow: 1.5, normal: 1, fast: 0.7 };
        const multiplier = speedMultipliers[value] || 1;
        root.style.setProperty('--transition-fast', `${0.2 * multiplier}s ease`);
        root.style.setProperty('--transition-normal', `${0.3 * multiplier}s ease`);
        root.style.setProperty('--transition-slow', `${0.5 * multiplier}s ease`);
        break;
        
      case 'highContrast':
        document.body.classList.toggle('high-contrast', value);
        break;
        
      case 'largeText':
        document.body.classList.toggle('large-text', value);
        break;
        
      case 'reducedMotion':
        document.body.classList.toggle('reduced-motion', value);
        break;
        
      case 'enableBlur':
        root.style.setProperty('--blur-enabled', value ? 'blur(10px)' : 'none');
        break;
        
      case 'enableShadows':
        if (!value) {
          root.style.setProperty('--shadow-light', 'none');
          root.style.setProperty('--shadow-medium', 'none');
          root.style.setProperty('--shadow-heavy', 'none');
        } else {
          root.style.setProperty('--shadow-light', '0 2px 10px rgba(0, 0, 0, 0.1)');
          root.style.setProperty('--shadow-medium', '0 5px 20px rgba(0, 0, 0, 0.15)');
          root.style.setProperty('--shadow-heavy', '0 10px 40px rgba(0, 0, 0, 0.2)');
        }
        break;
    }
  };

  const applySettings = () => {
    Object.entries(settings).forEach(([key, value]) => {
      applySingleSetting(key, value);
    });
  };

  const getSettingLabel = (settingKey) => {
    const labels = {
      enableAnimations: 'אנימציות',
      animationSpeed: 'מהירות אנימציות',
      enableParticles: 'אפקט חלקיקים',
      enableRipples: 'אפקט ריפל',
      highContrast: 'ניגודיות גבוהה',
      largeText: 'טקסט גדול',
      reducedMotion: 'צמצום תנועה',
      screenReaderMode: 'מצב קורא מסך',
      notificationsEnabled: 'התראות',
      notificationSound: 'צלילי התראה',
      enableBlur: 'אפקט טשטוש',
      enableShadows: 'צללים',
      enableGradients: 'גרדיינטים'
    };
    return labels[settingKey] || settingKey;
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      enableAnimations: true,
      animationSpeed: 'normal',
      enableParticles: true,
      enableRipples: true,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderMode: false,
      notificationsEnabled: true,
      notificationSound: false,
      notificationDuration: 4000,
      maxNotifications: 5,
      enableBlur: true,
      enableShadows: true,
      enableGradients: true
    };
    
    setSettings(defaultSettings);
    
    // Clear localStorage
    Object.keys(defaultSettings).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Apply default settings
    Object.entries(defaultSettings).forEach(([key, value]) => {
      applySingleSetting(key, value);
    });
    
    // Reset to light theme
    handleThemeChange('light');
    
    showNotification('הגדרות אופסו לברירת מחדל', 'success');
  };

  const exportSettings = () => {
    const exportData = {
      theme: selectedTheme,
      settings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `IsraLove-Settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('הגדרות יוצאו בהצלחה', 'success');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.theme) {
          handleThemeChange(importedData.theme);
        }
        
        if (importedData.settings) {
          setSettings(importedData.settings);
          
          // Save to localStorage and apply
          Object.entries(importedData.settings).forEach(([key, value]) => {
            localStorage.setItem(key, value.toString());
            applySingleSetting(key, value);
          });
        }
        
        showNotification('הגדרות יובאו בהצלחה', 'success');
      } catch (error) {
        showNotification('שגיאה בייבוא הגדרות', 'error');
      }
    };
    reader.readAsText(file);
  };

  const previewTheme = (themeId) => {
    // Temporary theme preview without saving
    uiEnhancements.applyTheme(themeId);
  };

  const cancelPreview = () => {
    // Restore original theme
    uiEnhancements.applyTheme(selectedTheme);
  };

  return (
    <div className="theme-overlay">
      <div className="theme-container">
        <div className="theme-header">
          <div className="theme-title-section">
            <div className="theme-icon">
              <i className="fas fa-palette"></i>
            </div>
            <div>
              <h2 className="theme-title">הגדרות מראה ונגישות</h2>
              <p className="theme-subtitle">התאם אישית את חוויית השימוש שלך</p>
            </div>
          </div>
          <button className="theme-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="theme-content">
          <div className="theme-tabs">
            <button 
              className={`theme-tab ${currentView === 'themes' ? 'active' : ''}`}
              onClick={() => setCurrentView('themes')}
            >
              <i className="fas fa-palette"></i>
              ערכות נושא
            </button>
            <button 
              className={`theme-tab ${currentView === 'animations' ? 'active' : ''}`}
              onClick={() => setCurrentView('animations')}
            >
              <i className="fas fa-magic"></i>
              אנימציות
            </button>
            <button 
              className={`theme-tab ${currentView === 'accessibility' ? 'active' : ''}`}
              onClick={() => setCurrentView('accessibility')}
            >
              <i className="fas fa-universal-access"></i>
              נגישות
            </button>
            <button 
              className={`theme-tab ${currentView === 'notifications' ? 'active' : ''}`}
              onClick={() => setCurrentView('notifications')}
            >
              <i className="fas fa-bell"></i>
              התראות
            </button>
          </div>

          <div className="theme-tab-content">
            {currentView === 'themes' && (
              <div className="themes-section">
                <div className="section-header">
                  <h3>בחר ערכת נושא</h3>
                  <p>התאם את מראה האתר לטעמך האישי</p>
                </div>
                
                <div className="theme-grid">
                  {uiEnhancements.getAvailableThemes().map(theme => (
                    <div 
                      key={theme.id}
                      className={`theme-card ${selectedTheme === theme.id ? 'active' : ''}`}
                      data-theme={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      onMouseEnter={() => previewTheme(theme.id)}
                      onMouseLeave={cancelPreview}
                    >
                      <div className={`theme-preview theme-${theme.id}`}>
                        <i className={theme.icon}></i>
                      </div>
                      <div className="theme-info">
                        <h4>{theme.name}</h4>
                        {selectedTheme === theme.id && (
                          <div className="theme-active-indicator">
                            <i className="fas fa-check"></i>
                            פעיל
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="theme-actions">
                  <button className="btn-secondary" onClick={resetToDefaults}>
                    <i className="fas fa-undo"></i>
                    איפוס לברירת מחדל
                  </button>
                  <button className="btn-secondary" onClick={exportSettings}>
                    <i className="fas fa-download"></i>
                    ייצוא הגדרות
                  </button>
                  <label className="btn-secondary">
                    <i className="fas fa-upload"></i>
                    ייבוא הגדרות
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={importSettings}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            )}

            {currentView === 'animations' && (
              <div className="animations-section">
                <div className="section-header">
                  <h3>הגדרות אנימציות</h3>
                  <p>שלוט ברמת האנימציות והאפקטים הויזואליים</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>אנימציות כלליות</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.enableAnimations}
                          onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>הפעל או בטל אנימציות כלליות באתר</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>מהירות אנימציות</h4>
                      <select 
                        value={settings.animationSpeed}
                        onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
                        className="setting-select"
                      >
                        <option value="slow">איטי</option>
                        <option value="normal">רגיל</option>
                        <option value="fast">מהיר</option>
                      </select>
                    </div>
                    <p>בחר את מהירות האנימציות</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>אפקט חלקיקים</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.enableParticles}
                          onChange={(e) => handleSettingChange('enableParticles', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>אפקט חלקיקים צבעוניים בפעולות מיוחדות</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>אפקט ריפל</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.enableRipples}
                          onChange={(e) => handleSettingChange('enableRipples', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>אפקט גלים בלחיצה על כפתורים</p>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'accessibility' && (
              <div className="accessibility-section">
                <div className="section-header">
                  <h3>הגדרות נגישות</h3>
                  <p>התאם את האתר לצרכי הנגישות שלך</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>ניגודיות גבוהה</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.highContrast}
                          onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>הגבר את הניגודיות לקריאה טובה יותר</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>טקסט גדול</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.largeText}
                          onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>הגדל את גודל הטקסט באתר</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>צמצום תנועה</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.reducedMotion}
                          onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>הפחת אנימציות לרגישים לתנועה</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>מצב קורא מסך</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.screenReaderMode}
                          onChange={(e) => handleSettingChange('screenReaderMode', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>אופטימיזציה לקוראי מסך</p>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'notifications' && (
              <div className="notifications-section">
                <div className="section-header">
                  <h3>הגדרות התראות</h3>
                  <p>שלוט באופן הצגת ההתראות</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>התראות מופעלות</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notificationsEnabled}
                          onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>הפעל או בטל התראות באתר</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>צלילי התראה</h4>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notificationSound}
                          onChange={(e) => handleSettingChange('notificationSound', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>נגן צליל עם התראות חדשות</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>משך זמן התראה</h4>
                      <input 
                        type="range" 
                        min="2000" 
                        max="10000" 
                        step="1000"
                        value={settings.notificationDuration}
                        onChange={(e) => handleSettingChange('notificationDuration', parseInt(e.target.value))}
                        className="setting-range"
                      />
                      <span className="range-value">{settings.notificationDuration / 1000} שניות</span>
                    </div>
                    <p>כמה זמן תוצג ההתראה</p>
                  </div>

                  <div className="setting-card">
                    <div className="setting-header">
                      <h4>מספר התראות מקסימלי</h4>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={settings.maxNotifications}
                        onChange={(e) => handleSettingChange('maxNotifications', parseInt(e.target.value))}
                        className="setting-range"
                      />
                      <span className="range-value">{settings.maxNotifications}</span>
                    </div>
                    <p>כמה התראות יוצגו בו זמנית</p>
                  </div>
                </div>

                <div className="notification-preview">
                  <h4>תצוגה מקדימה</h4>
                  <button 
                    className="btn-primary"
                    onClick={() => showNotification('זוהי התראה לדוגמה! 🎉', 'success')}
                  >
                    הצג התראה לדוגמה
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;