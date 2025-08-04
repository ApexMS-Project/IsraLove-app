import React, { useState, useEffect } from 'react';
import ContentModeration from './ContentModeration';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'forgot', 'verify'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    gender: '',
    lookingFor: '',
    city: '',
    bio: '',
    interests: [],
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [moderationWarnings, setModerationWarnings] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);

  // Initialize content moderator
  const moderator = new ContentModeration();

  // Cities in Israel
  const israeliCities = [
    'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה',
    'באר שבע', 'בני ברק', 'חולון', 'רמת גן', 'אשקלון', 'רחובות', 'בת ים',
    'כפר סבא', 'הרצליה', 'חדרה', 'רעננה', 'הוד השרון', 'ערד', 'דימונה',
    'מודיעין', 'נצרת', 'לוד', 'רמלה', 'כרמיאל', 'מעלה אדומים', 'שדרות',
    'אר יהוד', 'נס ציונה', 'ראש העין', 'אופקים', 'קרית גת', 'קרית מלאכי'
  ];

  // Safe interests categories
  const interestCategories = {
    ספורט: ['כדורגל', 'כדורסל', 'טניס', 'שחייה', 'ריצה', 'כושר', 'יוגה', 'פילאטס'],
    תרבות: ['קולנוע', 'תיאטרון', 'מוזיקה', 'ריקוד', 'אמנות', 'צילום', 'כתיבה'],
    טבע: ['טיולים', 'קמפינג', 'צלילה', 'גלישה', 'טיפוס', 'אופניים', 'דייג'],
    בישול: ['בישול', 'אפייה', 'יין', 'קפה', 'מסעדות', 'אוכל בריא'],
    טכנולוגיה: ['מחשבים', 'משחקים', 'פיתוח', 'רובוטיקה', 'AI', 'קריפטו'],
    לימודים: ['ספרים', 'השכלה', 'שפות', 'היסטוריה', 'מדע', 'פילוסופיה'],
    חברתי: ['חברים', 'משפחה', 'וולונטריות', 'קהילה', 'נטוורקינג'],
    נסיעות: ['טיולי חוץ', 'תרבויות', 'שפות זרות', 'הרפתקאות']
  };

  useEffect(() => {
    // Flatten all interests into one array
    const allInterests = Object.values(interestCategories).flat();
    setAvailableInterests(allInterests);
  }, []);

  // Content moderation for real-time input
  const moderateInput = (fieldName, value) => {
    if (!value) return null;

    const result = moderator.moderateText(value);
    
    if (!result.isAppropriate) {
      return {
        error: `${result.reason} - אנא שנה את הטקסט`,
        cleanedValue: result.cleanedText
      };
    }

    if (moderator.needsHumanReview(value)) {
      return {
        warning: 'התוכן ייבדק על ידי המנהלים',
        cleanedValue: result.cleanedText
      };
    }

    return {
      cleanedValue: result.cleanedText
    };
  };

  // Form validation with content moderation
  const validateForm = () => {
    const newErrors = {};
    const warnings = [];

    if (!formData.email) {
      newErrors.email = 'נדרש מייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'מייל לא תקין';
    }

    if (!formData.password) {
      newErrors.password = 'נדרשת סיסמה';
    } else if (formData.password.length < 8) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 8 תווים';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'סיסמה חייבת להכיל אות גדולה, קטנה ומספר';
    }

    if (currentView === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'נדרש אישור סיסמה';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'הסיסמאות לא תואמות';
      }

      // Moderate first name
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'נדרש שם פרטי';
      } else {
        const modResult = moderateInput('firstName', formData.firstName);
        if (modResult?.error) {
          newErrors.firstName = modResult.error;
        } else if (modResult?.warning) {
          warnings.push(`שם פרטי: ${modResult.warning}`);
        }
        if (formData.firstName.trim().length < 2) {
          newErrors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
        }
      }

      // Moderate last name
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'נדרש שם משפחה';
      } else {
        const modResult = moderateInput('lastName', formData.lastName);
        if (modResult?.error) {
          newErrors.lastName = modResult.error;
        } else if (modResult?.warning) {
          warnings.push(`שם משפחה: ${modResult.warning}`);
        }
        if (formData.lastName.trim().length < 2) {
          newErrors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
        }
      }

      // Moderate bio if provided
      if (formData.bio && formData.bio.trim()) {
        const modResult = moderateInput('bio', formData.bio);
        if (modResult?.error) {
          newErrors.bio = modResult.error;
        } else if (modResult?.warning) {
          warnings.push(`תיאור אישי: ${modResult.warning}`);
        }
      }

      if (!formData.birthDate) {
        newErrors.birthDate = 'נדרש תאריך לידה';
      } else {
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors.birthDate = 'חייב להיות מעל גיל 18';
        } else if (age > 100) {
          newErrors.birthDate = 'גיל לא הגיוני';
        }
      }

      if (!formData.gender) {
        newErrors.gender = 'נדרש מגדר';
      }

      if (!formData.lookingFor) {
        newErrors.lookingFor = 'נדרש מה אתה מחפש';
      }

      if (!formData.city) {
        newErrors.city = 'נדרשת עיר מגורים';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'חובה להסכים לתנאי השימוש';
      }

      // Phone validation (optional but if provided must be valid)
      if (formData.phone && !/^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
        newErrors.phone = 'מספר טלפון לא תקין (נדרש פורמט: 05XXXXXXXX)';
      }

      // Validate interests
      if (formData.interests.length === 0) {
        warnings.push('מומלץ להוסיף לפחות תחום עניין אחד');
      }
    }

    setErrors(newErrors);
    setModerationWarnings(warnings);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with real-time moderation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Real-time moderation for text fields
    if (type === 'text' || type === 'textarea') {
      const modResult = moderateInput(name, newValue);
      if (modResult?.error) {
        setErrors(prev => ({ ...prev, [name]: modResult.error }));
      } else {
        // Clear error when user starts typing valid content
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      }
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle interest selection
  const handleInterestToggle = (interest) => {
    const modResult = moderateInput('interest', interest);
    
    if (modResult?.error) {
      setErrors(prev => ({ ...prev, interests: modResult.error }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 10) // Max 10 interests
    }));

    // Clear errors
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (currentView === 'login') {
        // Simulate login API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user exists (simulate)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          onAuthSuccess(user);
        } else {
          setErrors({ general: 'מייל או סיסמה לא נכונים' });
        }
      } else if (currentView === 'register') {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === formData.email);
        
        if (existingUser) {
          setErrors({ email: 'משתמש עם מייל זה כבר קיים' });
          return;
        }

        // Moderate all profile data before saving
        const profileModerationResult = moderator.moderateProfile(formData);
        
        if (!profileModerationResult.isValid) {
          setErrors({ general: `שגיאת מודרציה: ${profileModerationResult.errors.join(', ')}` });
          return;
        }

        // Create new user with cleaned data
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          firstName: profileModerationResult.cleanedData.firstName,
          lastName: profileModerationResult.cleanedData.lastName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          lookingFor: formData.lookingFor,
          city: formData.city,
          bio: profileModerationResult.cleanedData.bio || '',
          interests: profileModerationResult.cleanedData.interests || [],
          isVerified: false,
          photos: [],
          createdAt: new Date().toISOString(),
          moderationWarnings: profileModerationResult.warnings || []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Send verification code (simulate)
        setCurrentView('verify');
      }
    } catch (error) {
      setErrors({ general: 'שגיאה בחיבור לשרת, נסה שוב' });
    } finally {
      setLoading(false);
    }
  };

  // Handle verification
  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ verification: 'נדרש קוד בן 6 ספרות' });
      return;
    }

    setLoading(true);

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user as verified
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === formData.email);
    
    if (userIndex !== -1) {
      users[userIndex].isVerified = true;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      onAuthSuccess(users[userIndex]);
    }

    setLoading(false);
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors({ resetEmail: 'נדרש מייל תקין' });
      return;
    }

    setLoading(true);

    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('קישור לאיפוס סיסמה נשלח למייל שלך');
    setCurrentView('login');
    setLoading(false);
  };

  // Social login handlers
  const handleSocialLogin = (provider) => {
    // In a real app, this would integrate with OAuth providers
    alert(`${provider} login functionality would be implemented here`);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1 className="auth-logo">IsraLove 💙</h1>
          <p className="auth-tagline">מוצאים אהבה בארץ</p>
        </div>

        {/* Moderation Warnings */}
        {moderationWarnings.length > 0 && (
          <div className="moderation-warnings">
            <h4>התראות מערכת:</h4>
            {moderationWarnings.map((warning, index) => (
              <p key={index} className="warning-text">⚠️ {warning}</p>
            ))}
          </div>
        )}

        {currentView === 'login' && (
          <div className="auth-form-container">
            <h2>התחברות</h2>
            
            <div className="social-login-buttons">
              <button 
                type="button" 
                className="social-btn facebook-btn"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <i className="fab fa-facebook-f"></i>
                התחבר עם פייסבוק
              </button>
              <button 
                type="button" 
                className="social-btn google-btn"
                onClick={() => handleSocialLogin('Google')}
              >
                <i className="fab fa-google"></i>
                התחבר עם גוגל
              </button>
            </div>

            <div className="divider">
              <span>או</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">מייל</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="הכנס את המייל שלך"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">סיסמה</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="הכנס את הסיסמה שלך"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : 'התחבר'}
              </button>
            </form>

            <div className="auth-links">
              <button 
                type="button"
                className="link-btn"
                onClick={() => setCurrentView('forgot')}
              >
                שכחת סיסמה?
              </button>
              
              <p>
                אין לך חשבון?{' '}
                <button 
                  type="button"
                  className="link-btn"
                  onClick={() => setCurrentView('register')}
                >
                  הרשם כאן
                </button>
              </p>
            </div>
          </div>
        )}

        {currentView === 'register' && (
          <div className="auth-form-container">
            <h2>הרשמה</h2>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">שם פרטי *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                    placeholder="שם פרטי"
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">שם משפחה *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                    placeholder="שם משפחה"
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">מייל *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="example@email.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">טלפון (אופציונלי)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="05X-XXX-XXXX"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">תאריך לידה *</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={errors.birthDate ? 'error' : ''}
                  max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">המגדר שלי *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">בחר מגדר</option>
                    <option value="male">גבר</option>
                    <option value="female">אישה</option>
                    <option value="non-binary">נון-בינארי</option>
                    <option value="other">אחר</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lookingFor">מחפש/ת *</label>
                  <select
                    id="lookingFor"
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleInputChange}
                    className={errors.lookingFor ? 'error' : ''}
                  >
                    <option value="">מה אתה מחפש?</option>
                    <option value="men">גברים</option>
                    <option value="women">נשים</option>
                    <option value="everyone">כולם</option>
                  </select>
                  {errors.lookingFor && <span className="error-text">{errors.lookingFor}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="city">עיר מגורים *</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                >
                  <option value="">בחר עיר</option>
                  {israeliCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bio">תיאור אישי (אופציונלי)</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={errors.bio ? 'error' : ''}
                  placeholder="ספר קצת על עצמך..."
                  maxLength={500}
                />
                {errors.bio && <span className="error-text">{errors.bio}</span>}
                <small className="char-count">{formData.bio.length}/500</small>
              </div>

              <div className="form-group">
                <label>תחומי עניין ({formData.interests.length}/10)</label>
                <div className="interests-grid">
                  {Object.entries(interestCategories).map(([category, interests]) => (
                    <div key={category} className="interest-category">
                      <h4>{category}</h4>
                      <div className="interest-items">
                        {interests.map(interest => (
                          <button
                            key={interest}
                            type="button"
                            className={`interest-btn ${formData.interests.includes(interest) ? 'selected' : ''}`}
                            onClick={() => handleInterestToggle(interest)}
                            disabled={!formData.interests.includes(interest) && formData.interests.length >= 10}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.interests && <span className="error-text">{errors.interests}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">סיסמה *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="לפחות 8 תווים, אות גדולה, קטנה ומספר"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">אישור סיסמה *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="הכנס שוב את הסיסמה"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={errors.agreeToTerms ? 'error' : ''}
                  />
                  <span className="checkmark"></span>
                  אני מסכים/ה ל<a href="#" className="link">תנאי השימוש</a> ו<a href="#" className="link">מדיניות הפרטיות</a> *
                </label>
                {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : 'הרשם'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                כבר יש לך חשבון?{' '}
                <button 
                  type="button"
                  className="link-btn"
                  onClick={() => setCurrentView('login')}
                >
                  התחבר כאן
                </button>
              </p>
            </div>
          </div>
        )}

        {currentView === 'verify' && (
          <div className="auth-form-container">
            <h2>אימות חשבון</h2>
            <p className="verification-message">
              שלחנו קוד אימות למייל: <strong>{formData.email}</strong>
            </p>
            
            <form onSubmit={handleVerification} className="auth-form">
              <div className="form-group">
                <label htmlFor="verificationCode">קוד אימות</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={errors.verification ? 'error' : ''}
                  placeholder="הכנס קוד בן 6 ספרות"
                  maxLength="6"
                />
                {errors.verification && <span className="error-text">{errors.verification}</span>}
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : 'אמת חשבון'}
              </button>
            </form>

            <div className="auth-links">
              <button 
                type="button"
                className="link-btn"
                onClick={() => alert('קוד חדש נשלח!')}
              >
                שלח קוד חדש
              </button>
            </div>
          </div>
        )}

        {currentView === 'forgot' && (
          <div className="auth-form-container">
            <h2>שחזור סיסמה</h2>
            <p>הכנס את המייל שלך ונשלח לך קישור לאיפוס הסיסמה</p>
            
            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="resetEmail">מייל</label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={errors.resetEmail ? 'error' : ''}
                  placeholder="הכנס את המייל שלך"
                />
                {errors.resetEmail && <span className="error-text">{errors.resetEmail}</span>}
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : 'שלח קישור'}
              </button>
            </form>

            <div className="auth-links">
              <button 
                type="button"
                className="link-btn"
                onClick={() => setCurrentView('login')}
              >
                חזרה להתחברות
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;