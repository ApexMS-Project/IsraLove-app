// AttackProtectionSystem.js - Advanced Attack Protection & Defense System

class AttackProtectionSystem {
  constructor() {
    // Attack detection patterns
    this.attackPatterns = {
      sqlInjection: {
        patterns: [
          /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
          /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
          /(\b(union|select).*from)/i,
          /(--|\/\*|\*\/)/,
          /(\b(exec|execute|sp_|xp_)\b)/i
        ],
        severity: 'critical',
        action: 'block'
      },
      xss: {
        patterns: [
          /<script[^>]*>.*?<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe[^>]*>/gi,
          /<object[^>]*>/gi,
          /<embed[^>]*>/gi
        ],
        severity: 'high',
        action: 'sanitize'
      },
      csrf: {
        patterns: [
          /<form[^>]*action\s*=\s*["'][^"']*["'][^>]*>/gi,
          /<a[^>]*href\s*=\s*["'][^"']*["'][^>]*>/gi
        ],
        severity: 'high',
        action: 'validate'
      },
      bruteForce: {
        patterns: [
          /login.*failed/gi,
          /password.*incorrect/gi,
          /invalid.*credentials/gi
        ],
        severity: 'medium',
        action: 'rate_limit'
      },
      ddos: {
        patterns: [
          /rapid.*requests/gi,
          /flood.*attack/gi,
          /overwhelm.*server/gi
        ],
        severity: 'critical',
        action: 'block_ip'
      }
    };
    
    // Protection mechanisms
    this.protectionMechanisms = {
      inputValidation: true,
      outputEncoding: true,
      sessionManagement: true,
      rateLimiting: true,
      ipBlocking: true,
      captcha: true,
      twoFactorAuth: true
    };
    
    // Attack history
    this.attackHistory = [];
    this.blockedIPs = new Set();
    this.suspiciousIPs = new Map();
    
    this.initializeAttackProtection();
  }

  // Initialize attack protection system
  initializeAttackProtection() {
    this.setupInputValidation();
    this.setupOutputEncoding();
    this.setupSessionProtection();
    this.setupRateLimiting();
    this.startAttackMonitoring();
  }

  // Setup input validation
  setupInputValidation() {
    // Monitor all form inputs
    document.addEventListener('submit', (e) => this.validateFormInput(e));
    document.addEventListener('input', (e) => this.validateInput(e));
  }

  // Validate form input
  validateFormInput(event) {
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    let hasAttack = false;
    
    inputs.forEach(input => {
      const validation = this.validateInputValue(input.value, input.type);
      if (!validation.isValid) {
        hasAttack = true;
        this.handleAttack('input_validation', {
          type: validation.attackType,
          value: input.value,
          field: input.name
        });
      }
    });
    
    if (hasAttack) {
      event.preventDefault();
      this.showSecurityAlert('זוהתה ניסיון התקפה - הקלט לא תקין');
    }
  }

  // Validate individual input
  validateInput(event) {
    const input = event.target;
    const validation = this.validateInputValue(input.value, input.type);
    
    if (!validation.isValid) {
      input.style.borderColor = '#dc3545';
      input.style.backgroundColor = '#fff5f5';
      
      this.handleAttack('input_validation', {
        type: validation.attackType,
        value: input.value,
        field: input.name
      });
    } else {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    }
  }

  // Validate input value
  validateInputValue(value, type) {
    if (!value) return { isValid: true };
    
    // Check for SQL injection
    if (this.detectSQLInjection(value)) {
      return { isValid: false, attackType: 'sql_injection' };
    }
    
    // Check for XSS
    if (this.detectXSS(value)) {
      return { isValid: false, attackType: 'xss' };
    }
    
    // Check for CSRF
    if (this.detectCSRF(value)) {
      return { isValid: false, attackType: 'csrf' };
    }
    
    // Type-specific validation
    switch (type) {
      case 'email':
        return this.validateEmail(value);
      case 'password':
        return this.validatePassword(value);
      case 'url':
        return this.validateURL(value);
      default:
        return { isValid: true };
    }
  }

  // Detect SQL injection
  detectSQLInjection(value) {
    return this.attackPatterns.sqlInjection.patterns.some(pattern => 
      pattern.test(value)
    );
  }

  // Detect XSS
  detectXSS(value) {
    return this.attackPatterns.xss.patterns.some(pattern => 
      pattern.test(value)
    );
  }

  // Detect CSRF
  detectCSRF(value) {
    return this.attackPatterns.csrf.patterns.some(pattern => 
      pattern.test(value)
    );
  }

  // Validate email
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailPattern.test(email),
      attackType: emailPattern.test(email) ? null : 'invalid_email'
    };
  }

  // Validate password
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = password.length >= minLength && 
                   hasUpperCase && hasLowerCase && 
                   hasNumbers && hasSpecialChar;
    
    return {
      isValid: isValid,
      attackType: isValid ? null : 'weak_password'
    };
  }

  // Validate URL
  validateURL(url) {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, attackType: 'invalid_url' };
    }
  }

  // Setup output encoding
  setupOutputEncoding() {
    // Encode all dynamic content
    this.encodeDynamicContent();
  }

  // Encode dynamic content
  encodeDynamicContent() {
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(element => {
      const originalContent = element.textContent;
      const encodedContent = this.encodeOutput(originalContent);
      element.textContent = encodedContent;
    });
  }

  // Encode output
  encodeOutput(content) {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Setup session protection
  setupSessionProtection() {
    // Generate CSRF token
    this.generateCSRFToken();
    
    // Validate session
    this.validateSession();
    
    // Monitor session activity
    this.monitorSessionActivity();
  }

  // Generate CSRF token
  generateCSRFToken() {
    const token = this.generateRandomToken();
    sessionStorage.setItem('csrfToken', token);
    
    // Add token to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'csrf_token';
      tokenInput.value = token;
      form.appendChild(tokenInput);
    });
  }

  // Generate random token
  generateRandomToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate session
  validateSession() {
    const sessionId = sessionStorage.getItem('sessionId');
    const lastActivity = sessionStorage.getItem('lastActivity');
    
    if (!sessionId) {
      this.createNewSession();
    } else if (lastActivity && Date.now() - parseInt(lastActivity) > 1800000) {
      // Session expired (30 minutes)
      this.expireSession();
    }
  }

  // Create new session
  createNewSession() {
    const sessionId = this.generateRandomToken();
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }

  // Expire session
  expireSession() {
    sessionStorage.clear();
    this.showSecurityAlert('הסשן פג תוקף - אנא התחבר מחדש');
    // Redirect to login
    window.location.href = '/login';
  }

  // Monitor session activity
  monitorSessionActivity() {
    document.addEventListener('click', () => this.updateSessionActivity());
    document.addEventListener('keypress', () => this.updateSessionActivity());
  }

  // Update session activity
  updateSessionActivity() {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }

  // Setup rate limiting
  setupRateLimiting() {
    this.rateLimits = {
      login: { max: 5, window: 900000 }, // 5 attempts per 15 minutes
      registration: { max: 3, window: 3600000 }, // 3 attempts per hour
      passwordReset: { max: 3, window: 3600000 }, // 3 attempts per hour
      api: { max: 100, window: 60000 } // 100 requests per minute
    };
  }

  // Check rate limit
  checkRateLimit(action, identifier) {
    const limit = this.rateLimits[action];
    if (!limit) return true;
    
    const key = `${action}_${identifier}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    
    // Remove old attempts
    const recentAttempts = attempts.filter(timestamp => 
      now - timestamp < limit.window
    );
    
    if (recentAttempts.length >= limit.max) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  }

  // Start attack monitoring
  startAttackMonitoring() {
    // Monitor for brute force attacks
    this.monitorBruteForce();
    
    // Monitor for DDoS attempts
    this.monitorDDoS();
    
    // Monitor for suspicious patterns
    this.monitorSuspiciousPatterns();
  }

  // Monitor brute force attacks
  monitorBruteForce() {
    const loginAttempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
    const now = Date.now();
    const recentAttempts = loginAttempts.filter(timestamp => 
      now - timestamp < 900000 // 15 minutes
    );
    
    if (recentAttempts.length > 10) {
      this.handleAttack('brute_force', {
        attempts: recentAttempts.length,
        timeWindow: '15 minutes'
      });
    }
  }

  // Monitor DDoS
  monitorDDoS() {
    const requests = JSON.parse(localStorage.getItem('api_requests') || '[]');
    const now = Date.now();
    const recentRequests = requests.filter(timestamp => 
      now - timestamp < 60000 // 1 minute
    );
    
    if (recentRequests.length > 200) {
      this.handleAttack('ddos', {
        requests: recentRequests.length,
        timeWindow: '1 minute'
      });
    }
  }

  // Monitor suspicious patterns
  monitorSuspiciousPatterns() {
    // Monitor for rapid form submissions
    const formSubmissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
    const now = Date.now();
    const recentSubmissions = formSubmissions.filter(timestamp => 
      now - timestamp < 60000 // 1 minute
    );
    
    if (recentSubmissions.length > 20) {
      this.handleAttack('rapid_submissions', {
        submissions: recentSubmissions.length,
        timeWindow: '1 minute'
      });
    }
  }

  // Handle attack
  handleAttack(attackType, details) {
    const attack = {
      type: attackType,
      details: details,
      timestamp: Date.now(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    this.attackHistory.push(attack);
    
    // Take action based on attack type
    this.takeAttackAction(attack);
    
    // Log attack
    this.logAttack(attack);
  }

  // Take attack action
  takeAttackAction(attack) {
    switch (attack.type) {
      case 'sql_injection':
      case 'xss':
      case 'csrf':
        this.blockIP(attack.ip, 'Malicious input detected');
        break;
      case 'brute_force':
        this.rateLimitIP(attack.ip, 'Too many login attempts');
        break;
      case 'ddos':
        this.blockIP(attack.ip, 'DDoS attack detected');
        break;
      case 'rapid_submissions':
        this.warnUser('Too many form submissions');
        break;
    }
  }

  // Block IP
  blockIP(ip, reason) {
    this.blockedIPs.add(ip);
    localStorage.setItem('blockedIPs', JSON.stringify(Array.from(this.blockedIPs)));
    
    console.log(`IP ${ip} blocked: ${reason}`);
  }

  // Rate limit IP
  rateLimitIP(ip, reason) {
    this.suspiciousIPs.set(ip, {
      reason: reason,
      timestamp: Date.now(),
      attempts: (this.suspiciousIPs.get(ip)?.attempts || 0) + 1
    });
    
    console.log(`IP ${ip} rate limited: ${reason}`);
  }

  // Warn user
  warnUser(message) {
    this.showSecurityAlert(message);
  }

  // Log attack
  logAttack(attack) {
    const attacks = JSON.parse(localStorage.getItem('attackLog') || '[]');
    attacks.push(attack);
    localStorage.setItem('attackLog', JSON.stringify(attacks));
  }

  // Show security alert
  showSecurityAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'security-alert';
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10000;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      font-weight: bold;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  // Get client IP (simplified)
  getClientIP() {
    return '127.0.0.1'; // In real app, get actual IP
  }

  // Get attack statistics
  getAttackStats() {
    const now = Date.now();
    const last24h = now - 86400000;
    
    const recentAttacks = this.attackHistory.filter(attack => 
      attack.timestamp > last24h
    );
    
    return {
      totalAttacks: this.attackHistory.length,
      attacks24h: recentAttacks.length,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      attackTypes: this.getAttackTypes(),
      lastAttack: this.attackHistory.length > 0 ? 
        this.attackHistory[this.attackHistory.length - 1] : null
    };
  }

  // Get attack types
  getAttackTypes() {
    const types = {};
    this.attackHistory.forEach(attack => {
      types[attack.type] = (types[attack.type] || 0) + 1;
    });
    return types;
  }

  // Check if IP is blocked
  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  // Check if IP is rate limited
  isIPRateLimited(ip) {
    const suspicious = this.suspiciousIPs.get(ip);
    return suspicious && suspicious.attempts > 5;
  }
}

// Export the AttackProtectionSystem
export default AttackProtectionSystem;

// Export utility functions
export const createAttackProtectionSystem = () => new AttackProtectionSystem();

export const getAttackStats = () => {
  const attackProtection = new AttackProtectionSystem();
  return attackProtection.getAttackStats();
}; 