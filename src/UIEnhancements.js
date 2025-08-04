// UIEnhancements.js - Advanced UX/UI Enhancement System

class UIEnhancements {
  constructor() {
    // Theme configurations
    this.themes = {
      light: {
        id: 'light',
        name: 'בהיר',
        icon: 'fas fa-sun',
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: '#ffffff',
          textPrimary: '#2c3e50',
          textSecondary: '#6c757d',
          border: '#e9ecef',
          success: '#28a745',
          danger: '#dc3545',
          warning: '#ffc107',
          info: '#17a2b8'
        }
      },
      dark: {
        id: 'dark',
        name: 'כהה',
        icon: 'fas fa-moon',
        colors: {
          primary: '#bb86fc',
          secondary: '#03dac6',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          cardBackground: '#1e1e2e',
          textPrimary: '#ffffff',
          textSecondary: '#b0b3b8',
          border: '#3a3a4a',
          success: '#00d4aa',
          danger: '#ff6b6b',
          warning: '#ffd93d',
          info: '#6bcf7f'
        }
      },
      romantic: {
        id: 'romantic',
        name: 'רומנטי',
        icon: 'fas fa-heart',
        colors: {
          primary: '#ff6b9d',
          secondary: '#c44569',
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
          cardBackground: '#ffffff',
          textPrimary: '#2c3e50',
          textSecondary: '#6c757d',
          border: '#f8d7da',
          success: '#ff6b9d',
          danger: '#e74c3c',
          warning: '#f39c12',
          info: '#ff6b9d'
        }
      },
      ocean: {
        id: 'ocean',
        name: 'אוקיינוס',
        icon: 'fas fa-water',
        colors: {
          primary: '#36d1dc',
          secondary: '#5b86e5',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: '#ffffff',
          textPrimary: '#2c3e50',
          textSecondary: '#6c757d',
          border: '#e9ecef',
          success: '#36d1dc',
          danger: '#e74c3c',
          warning: '#f39c12',
          info: '#36d1dc'
        }
      }
    };

    // Notification types and configurations
    this.notificationTypes = {
      success: {
        icon: 'fas fa-check-circle',
        color: '#28a745',
        duration: 4000
      },
      error: {
        icon: 'fas fa-exclamation-circle',
        color: '#dc3545',
        duration: 6000
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        color: '#ffc107',
        duration: 5000
      },
      info: {
        icon: 'fas fa-info-circle',
        color: '#17a2b8',
        duration: 4000
      },
      match: {
        icon: 'fas fa-heart',
        color: '#ff6b9d',
        duration: 8000
      },
      message: {
        icon: 'fas fa-comment',
        color: '#6f42c1',
        duration: 6000
      },
      like: {
        icon: 'fas fa-thumbs-up',
        color: '#fd7e14',
        duration: 3000
      },
      superlike: {
        icon: 'fas fa-star',
        color: '#ffc107',
        duration: 5000
      }
    };

    // Animation presets
    this.animations = {
      slideIn: 'slideInUp 0.5s ease-out',
      fadeIn: 'fadeIn 0.3s ease-in',
      bounceIn: 'bounceIn 0.6s ease-out',
      zoomIn: 'zoomIn 0.4s ease-out',
      pulse: 'pulse 2s infinite',
      shake: 'shake 0.5s ease-in-out',
      glow: 'glow 2s infinite alternate'
    };

    // Load saved theme
    this.currentTheme = localStorage.getItem('selectedTheme') || 'light';
    this.applyTheme(this.currentTheme);

    // Notification queue
    this.notificationQueue = [];
    this.maxNotifications = 5;
    
    // Initialize notification container
    this.initNotificationContainer();
  }

  // Theme Management
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  getAvailableThemes() {
    return Object.values(this.themes);
  }

  applyTheme(themeId) {
    const theme = this.themes[themeId];
    if (!theme) return false;

    this.currentTheme = themeId;
    localStorage.setItem('selectedTheme', themeId);

    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeId}`);

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: theme } 
    }));

    return true;
  }

  // Advanced Notification System
  initNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  showNotification(message, type = 'info', options = {}) {
    const notificationConfig = this.notificationTypes[type] || this.notificationTypes.info;
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      icon: options.icon || notificationConfig.icon,
      color: options.color || notificationConfig.color,
      duration: options.duration || notificationConfig.duration,
      persistent: options.persistent || false,
      actions: options.actions || []
    };

    this.addNotificationToQueue(notification);
    this.displayNotification(notification);

    return notification.id;
  }

  addNotificationToQueue(notification) {
    // Remove oldest notification if queue is full
    if (this.notificationQueue.length >= this.maxNotifications) {
      const oldestNotification = this.notificationQueue.shift();
      this.removeNotification(oldestNotification.id);
    }

    this.notificationQueue.push(notification);
  }

  displayNotification(notification) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${notification.type}`;
    notificationElement.setAttribute('data-notification-id', notification.id);

    // Build notification HTML
    let actionsHTML = '';
    if (notification.actions.length > 0) {
      actionsHTML = `
        <div class="notification-actions">
          ${notification.actions.map(action => `
            <button class="notification-action-btn" data-action="${action.id}">
              ${action.text}
            </button>
          `).join('')}
        </div>
      `;
    }

    notificationElement.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="${notification.icon}"></i>
        </div>
        <div class="notification-message">
          ${notification.message}
        </div>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      ${actionsHTML}
    `;

    // Add event listeners
    const closeBtn = notificationElement.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification.id);
    });

    // Handle action buttons
    notification.actions.forEach(action => {
      const actionBtn = notificationElement.querySelector(`[data-action="${action.id}"]`);
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          action.callback();
          this.removeNotification(notification.id);
        });
      }
    });

    // Add to container
    container.appendChild(notificationElement);

    // Animate in
    setTimeout(() => {
      notificationElement.classList.add('notification-show');
    }, 10);

    // Auto remove if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(notificationId) {
    const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
    if (element) {
      element.classList.add('notification-hide');
      setTimeout(() => {
        element.remove();
      }, 300);
    }

    // Remove from queue
    this.notificationQueue = this.notificationQueue.filter(n => n.id !== notificationId);
  }

  // Special notification types
  showMatchNotification(matchedUser) {
    return this.showNotification(
      `זה מאץ'! התאמת עם ${matchedUser.name}`,
      'match',
      {
        duration: 8000,
        actions: [
          {
            id: 'message',
            text: 'שלח הודעה',
            callback: () => {
              window.dispatchEvent(new CustomEvent('openChat', { 
                detail: { userId: matchedUser.id } 
              }));
            }
          }
        ]
      }
    );
  }

  showLikeNotification(likedUser) {
    return this.showNotification(
      `עשית לייק ל${likedUser.name}`,
      'like',
      { duration: 3000 }
    );
  }

  showSuperLikeNotification(superLikedUser) {
    return this.showNotification(
      `שלחת סופר לייק ל${superLikedUser.name}! 🌟`,
      'superlike',
      { duration: 5000 }
    );
  }

  showMessageNotification(sender, message) {
    return this.showNotification(
      `הודעה חדשה מ${sender.name}: ${message.substring(0, 50)}...`,
      'message',
      {
        duration: 6000,
        actions: [
          {
            id: 'reply',
            text: 'הגב',
            callback: () => {
              window.dispatchEvent(new CustomEvent('openChat', { 
                detail: { userId: sender.id } 
              }));
            }
          }
        ]
      }
    );
  }

  // Loading States
  createLoadingSpinner(size = 'medium') {
    const spinner = document.createElement('div');
    spinner.className = `loading-spinner loading-${size}`;
    spinner.innerHTML = `
      <div class="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
    return spinner;
  }

  showPageLoader() {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.className = 'page-loader';
      loader.innerHTML = `
        <div class="page-loader-content">
          <div class="page-loader-logo">
            <i class="fas fa-heart"></i>
          </div>
          <div class="page-loader-spinner">
            ${this.createLoadingSpinner('large').outerHTML}
          </div>
          <div class="page-loader-text">טוען...</div>
        </div>
      `;
      document.body.appendChild(loader);
    }
    loader.classList.add('show');
  }

  hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.remove('show');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }

  // Visual Effects
  addRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  addParticleEffect(element, particleCount = 20) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = (rect.left + rect.width / 2) + 'px';
      particle.style.top = (rect.top + rect.height / 2) + 'px';
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      const life = 1000 + Math.random() * 1000;
      
      particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
      particle.style.setProperty('--life', life + 'ms');
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, life);
    }
  }

  // Smooth Scrolling
  smoothScrollTo(element, duration = 500) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  // Performance Optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Accessibility Features
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Initialize all UI enhancements
  init() {
    this.initNotificationContainer();
    this.applyTheme(this.currentTheme);
    this.addGlobalEventListeners();
    
    // Add ripple effect to all buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, .card')) {
        this.addRippleEffect(e.target, e);
      }
    });

    console.log('UI Enhancements initialized successfully');
  }

  addGlobalEventListeners() {
    // Theme change detection
    window.addEventListener('themeChanged', (e) => {
      this.announceToScreenReader(`ערכת נושא שונתה ל${e.detail.theme.name}`);
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close top-most modal or notification
        const topModal = document.querySelector('.modal:last-of-type, .overlay:last-of-type');
        if (topModal) {
          const closeBtn = topModal.querySelector('.close, .modal-close, .overlay-close');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }
}

// Export for use in other components
export default UIEnhancements;