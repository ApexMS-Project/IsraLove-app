import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import firebaseDB from './FirebaseDatabase';
import './Auth.css';

const AuthFirebase = ({ onLogin, showNotification }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    city: 'תל אביב',
    lookingFor: 'women'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userData = await firebaseDB.getUserByEmail(user.email);
      
      if (userData) {
        showNotification('התחברת בהצלחה! 🎉');
        onLogin(userData);
      } else {
        showNotification('שגיאה בטעינת נתוני המשתמש');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'שגיאה בהתחברות';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'משתמש לא נמצא';
          break;
        case 'auth/wrong-password':
          errorMessage = 'סיסמה שגויה';
          break;
        case 'auth/invalid-email':
          errorMessage = 'כתובת אימייל לא תקינה';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      showNotification('אנא מלא את כל השדות הנדרשים');
      setIsLoading(false);
      return;
    }

    // Age validation
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      showNotification('חייב להיות מעל גיל 18');
      setIsLoading(false);
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        age: age,
        city: formData.city,
        lookingFor: formData.lookingFor,
        bio: '',
        photos: [],
        settings: {
          ageRange: { min: 22, max: 35 },
          searchRadius: 50,
          privacy: {
            showOnlyToLiked: true,
            messageNotifications: true,
            matchNotifications: false
          }
        },
        uid: user.uid
      };

      const createdUser = await firebaseDB.createUser(userData);
      
      showNotification('נרשמת בהצלחה! 🎉');
      onLogin(createdUser);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'שגיאה ברישום';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'כתובת האימייל כבר בשימוש';
          break;
        case 'auth/weak-password':
          errorMessage = 'הסיסמה חלשה מדי (לפחות 6 תווים)';
          break;
        case 'auth/invalid-email':
          errorMessage = 'כתובת אימייל לא תקינה';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification('התנתקת בהצלחה');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('שגיאה בהתנתקות');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? 'התחברות ל-IsraLove 💕' : 'הצטרפות ל-IsraLove 💕'}
        </h2>
        
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="כתובת אימייל *"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="auth-input"
          />
          
          <input
            type="password"
            name="password"
            placeholder="סיסמה *"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="auth-input"
          />
          
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="שם פרטי *"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="auth-input"
              />
              
              <input
                type="text"
                name="lastName"
                placeholder="שם משפחה *"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="auth-input"
              />
              
              <input
                type="date"
                name="dateOfBirth"
                placeholder="תאריך לידה *"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="auth-input"
              />
              
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="auth-input"
              >
                <option value="תל אביב">תל אביב</option>
                <option value="ירושלים">ירושלים</option>
                <option value="חיפה">חיפה</option>
                <option value="באר שבע">באר שבע</option>
                <option value="פתח תקווה">פתח תקווה</option>
                <option value="נתניה">נתניה</option>
                <option value="אשדוד">אשדוד</option>
                <option value="רמת גן">רמת גן</option>
              </select>
              
              <select
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleInputChange}
                className="auth-input"
              >
                <option value="women">מחפש נשים</option>
                <option value="men">מחפש גברים</option>
                <option value="both">מחפש גברים ונשים</option>
              </select>
            </>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'טוען...' : (isLogin ? 'התחבר' : 'הירשם')}
          </button>
        </form>
        
        <p className="auth-switch">
          {isLogin ? 'אין לך חשבון?' : 'יש לך כבר חשבון?'}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="auth-link"
            disabled={isLoading}
          >
            {isLogin ? 'הירשם כאן' : 'התחבר כאן'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthFirebase;
