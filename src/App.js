import React, { useState, useEffect, useRef } from 'react';
import Auth from './Auth';
import ContentModeration, { createModerator } from './ContentModeration';
import PremiumUI from './PremiumUI';
import PremiumSystem from './PremiumSystem';
import QuestionsUI from './QuestionsUI';
import MatchingSystem from './MatchingSystem';
import SafetyUI from './SafetyUI';
import SafetySystem from './SafetySystem';
import SocialUI from './SocialUI';
import SocialFeatures from './SocialFeatures';
import ThemeSelector from './ThemeSelector';
import UIEnhancements from './UIEnhancements';
import AdminDashboard from './AdminDashboard';
import AdminSystem from './AdminSystem';
import './UIEnhancements.css';
import './App.css';

const App = () => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Main app states
  const [currentPage, setCurrentPage] = useState('home');
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [notification, setNotification] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);
  
  // Settings state
  const [settings, setSettings] = useState({
    firstName: '',
    lastName: '',
    city: 'תל אביב',
    bio: '',
    lookingFor: 'women',
    ageRange: { min: 22, max: 35 },
    searchRadius: 50,
    privacy: {
      showOnlyToLiked: true,
      messageNotifications: true,
      matchNotifications: false
    }
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumSystem] = useState(new PremiumSystem());
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [matchingSystem] = useState(new MatchingSystem());
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [safetySystem] = useState(new SafetySystem());
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialSystem] = useState(new SocialFeatures()); 
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSystem] = useState(new AdminSystem());
  const [isAdmin, setIsAdmin] = useState(false);
  const [safetyContext, setSafetyContext] = useState({ targetUserId: null, context: 'general' });
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [uiEnhancements] = useState(new UIEnhancements());


  const cardRef = useRef(null);

  // Initialize content moderator
  const moderator = createModerator();

// Initialize UI enhancements
useEffect(() => {
  uiEnhancements.init();
}, [uiEnhancements]);

  // Premium feature checks
const canUseLike = () => {
  return premiumSystem.useFeature('like');
};

const canUseSuperLike = () => {
  return premiumSystem.useFeature('superLike');
};

const openPremiumModal = () => {
  setShowPremiumModal(true);
};

const openQuestionsModal = () => {
  setShowQuestionsModal(true);
};

const openSafetyModal = (targetUserId = null, context = 'general') => {
  setSafetyContext({ targetUserId, context });
  setShowSafetyModal(true);
};

const openSocialModal = () => {
  setShowSocialModal(true);
};

const checkAdminAccess = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // בדיקה פשוטה למנהל
  if (currentUser.email === 'yossidanilovv@gmail.com') {
    // שמירת סטטוס מנהל
    localStorage.setItem('isAdmin', 'true');
    return true;
  }
  
  return false;
};

const openAdminModal = () => {
  console.log('Opening admin modal...');
  setIsAdmin(true);
  setShowAdminModal(true);
  showNotification('דשבורד מנהלים נפתח! 👑');
};

const reportUser = (userId) => {
  openSafetyModal(userId, 'report');
};

const blockUser = (userId) => {
  const success = safetySystem.blockUser(user.id, userId, 'מחסום מהפרופיל');
  if (success) {
    showNotification('המשתמש נחסם בהצלחה');
  }
};
const openThemeModal = () => {
  setShowThemeModal(true);
};
  // Real profiles data - Empty for real users only
  const sampleProfiles = [];

  // Real users database - Empty for real users only
  const realUsers = [];

  // Real chats data - Empty for real users only
  const sampleChats = [];

  // Real chats database - Empty for real users only
  const realChats = [];

  // Clear fake data on app load (for testing with real accounts)
  const clearFakeData = () => {
    // Clear fake profiles and related data
    localStorage.removeItem('likedUsers');
    localStorage.removeItem('matches');
    // Clear any fake user likes
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('likedBy_')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser(userData);
        
        // Load photos from multiple sources for reliability
        const savedPhotos = localStorage.getItem('userPhotos');
        if (savedPhotos) {
          setUserPhotos(JSON.parse(savedPhotos));
        } else if (userData.photos) {
          setUserPhotos(userData.photos);
        } else {
          setUserPhotos([]);
        }
        
        // Clear fake data when user logs in
        clearFakeData();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Initialize data when user is authenticated
  useEffect(() => {
    if (user) {
      setProfiles(realUsers);
      setMessages(realChats);
    }
  }, [user]);

  // Handle successful authentication
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    
    // Load photos from multiple sources
    const savedPhotos = localStorage.getItem('userPhotos');
    if (savedPhotos) {
      setUserPhotos(JSON.parse(savedPhotos));
    } else if (userData.photos) {
      setUserPhotos(userData.photos);
    } else {
      setUserPhotos([]);
    }
    
    setCurrentPage('home');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('home');
    setUserPhotos([]);
  };

  // Page navigation
  const showPage = (pageName) => {
    setCurrentPage(pageName);
  };

  // Card dragging functionality
  const handleMouseDown = (e) => {
    if (!cardRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cardPosition.x,
      y: e.clientY - cardPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setCardPosition({ x: newX, y: newY });
    
    // Add rotation based on horizontal movement
    if (cardRef.current) {
      const rotation = newX * 0.1;
      cardRef.current.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation}deg)`;
      
      // Add color overlay based on direction
      const overlay = cardRef.current.querySelector('.card-overlay');
      if (overlay) {
        if (newX > 50) {
          overlay.style.background = 'linear-gradient(45deg, rgba(46, 213, 115, 0.8), rgba(26, 188, 156, 0.8))';
          overlay.style.opacity = Math.min(Math.abs(newX) / 100, 1);
        } else if (newX < -50) {
          overlay.style.background = 'linear-gradient(45deg, rgba(255, 71, 87, 0.8), rgba(255, 55, 66, 0.8))';
          overlay.style.opacity = Math.min(Math.abs(newX) / 100, 1);
        } else {
          overlay.style.opacity = 0;
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    
    if (cardPosition.x > threshold) {
      likeCard();
    } else if (cardPosition.x < -threshold) {
      rejectCard();
    } else {
      // Snap back to center
      setCardPosition({ x: 0, y: 0 });
      if (cardRef.current) {
        cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
        const overlay = cardRef.current.querySelector('.card-overlay');
        if (overlay) {
          overlay.style.opacity = 0;
        }
      }
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Card actions
  const likeCard = () => {
  if (profiles.length === 0) return;
  
  // Check if user can use like
  if (!canUseLike()) {
    showNotification('נגמרו הלייקים! שדרג לפרימיום למעלה לייקים');
    openPremiumModal();
    return;
  }

  const currentProfile = profiles[currentProfileIndex];
  
  // Save like to localStorage
  const likedUsers = JSON.parse(localStorage.getItem('likedUsers') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!likedUsers.includes(currentProfile.id)) {
    likedUsers.push(currentProfile.id);
    localStorage.setItem('likedUsers', JSON.stringify(likedUsers));
  }
    
    // Animate card away
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(1000px) rotate(30deg)';
      cardRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      nextCard();
      
      // Check for mutual like and compatibility
      const likedByOthers = JSON.parse(localStorage.getItem(`likedBy_${currentUser.id}`) || '[]');
      
      if (likedByOthers.includes(currentProfile.id)) {
        // Mutual like! Check compatibility
        const compatibility = matchingSystem.calculateCompatibility(
          currentUser.questionAnswers || {},
          currentProfile.questionAnswers || {}
        );
        
        // Only match if compatibility is above 60%
        if (compatibility >= 60) {
          // Save the match
          const matches = JSON.parse(localStorage.getItem('matches') || '[]');
          const newMatch = {
            id: Date.now(),
            userId: currentProfile.id,
            name: currentProfile.name,
            photo: currentProfile.photo,
            compatibility: compatibility,
            matchedAt: new Date().toISOString()
          };
          
          matches.push(newMatch);
          localStorage.setItem('matches', JSON.stringify(matches));
          
          setShowMatchPopup(true);
          setTimeout(() => setShowMatchPopup(false), 3000);
          showNotification(`🎉 יש לכם מאץ'! ${compatibility}% התאמה!`);
        } else {
          showNotification('👍 לייק נשלח!');
        }
      } else {
        // Add like to the other user's liked list
        const likedByOthers = JSON.parse(localStorage.getItem(`likedBy_${currentProfile.id}`) || '[]');
        if (!likedByOthers.includes(currentUser.id)) {
          likedByOthers.push(currentUser.id);
          localStorage.setItem(`likedBy_${currentProfile.id}`, JSON.stringify(likedByOthers));
        }
        showNotification('👍 לייק נשלח!');
      }
    }, 300);
  };

  const rejectCard = () => {
    if (profiles.length === 0) return;
    
    // Animate card away
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-1000px) rotate(-30deg)';
      cardRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      nextCard();
      showNotification('👎 עבר לבא');
    }, 300);
  };

  const superLikeCard = () => {
  if (profiles.length === 0) return;
  
  // Check if user can use super like
  if (!canUseSuperLike()) {
    showNotification('נגמרו הסופר לייקים! שדרג לפרימיום');
    openPremiumModal();
    return;
  }
    
    // Animate card away upward
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(-1000px) rotate(0deg)';
      cardRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      nextCard();
      setShowMatchPopup(true);
      setTimeout(() => setShowMatchPopup(false), 3000);
      showNotification('⭐ סופר לייק נשלח!');
    }, 300);
  };

  const nextCard = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
    setCardPosition({ x: 0, y: 0 });
    
    // Reset card animation
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
        cardRef.current.style.opacity = '1';
        const overlay = cardRef.current.querySelector('.card-overlay');
        if (overlay) {
          overlay.style.opacity = 0;
        }
      }
    }, 50);
  };

  // Chat functionality
  const selectChat = (index) => {
    setCurrentChatIndex(index);
  };

  // Send message with moderation
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Moderate message before sending
    const moderationResult = moderator.moderateMessage(newMessage);
    
    if (!moderationResult.canSend) {
      showNotification(`הודעה לא נשלחה: ${moderationResult.reason}`);
      setNewMessage(moderationResult.cleanedMessage); // Show cleaned version
      return;
    }
    
    const updatedChats = [...messages];
    const newMsg = {
      id: Date.now(),
      text: moderationResult.cleanedMessage, // Use cleaned message
      sent: true,
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
    
    updatedChats[currentChatIndex].messages.push(newMsg);
    updatedChats[currentChatIndex].lastMessage = moderationResult.cleanedMessage;
    
    setMessages(updatedChats);
    setNewMessage('');
    
    // Show warning if message was cleaned
    if (moderationResult.cleanedMessage !== moderationResult.originalMessage) {
      showNotification('⚠️ הודעה נוקתה מתוכן לא הולם');
    }
    
    // Scroll to bottom
    setTimeout(() => {
      const chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  };

  // Photo upload functionality with moderation
  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (userPhotos.length + files.length > 5) {
      showNotification('ניתן להעלות עד 5 תמונות בלבד');
      return;
    }
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('תמונה חייבת להיות קטנה מ-5MB');
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target.result;
        
        // Moderate image before adding
        const moderationResult = await moderator.moderateImage(file, imageDataUrl);
        
        if (!moderationResult.isAppropriate) {
          showNotification(`תמונה נדחתה: ${moderationResult.reason}`);
          return;
        }
        
        if (moderationResult.warning) {
          showNotification(`⚠️ ${moderationResult.warning}`);
        }
        
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: imageDataUrl,
          file: file,
          moderationStatus: 'approved'
        };
        
        setUserPhotos(prev => [...prev, newPhoto]);
        
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.photos) currentUser.photos = [];
        currentUser.photos.push(newPhoto);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        setUser(currentUser);
        
        // Also save photos separately for backup
        const updatedPhotos = [...userPhotos, newPhoto];
        localStorage.setItem('userPhotos', JSON.stringify(updatedPhotos));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo function
  const removePhoto = (photoId) => {
    const updatedPhotos = userPhotos.filter(photo => photo.id !== photoId);
    setUserPhotos(updatedPhotos);
    
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.photos = updatedPhotos;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setUser(currentUser);
    
    // Also update backup
    localStorage.setItem('userPhotos', JSON.stringify(updatedPhotos));
    
    showNotification('תמונה הוסרה בהצלחה');
  };

const showNotification = (message, type = 'info') => {
  uiEnhancements.showNotification(message, type);
};

  // Accessibility toggle
  const toggleAccessibility = () => {
    setIsAccessibilityMode(!isAccessibilityMode);
    document.body.classList.toggle('accessibility-mode');
    showNotification(isAccessibilityMode ? 'מצב נגישות כבוי' : 'מצב נגישות דלוק');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentPage === 'discover') {
        switch (e.key) {
          case 'ArrowLeft':
            rejectCard();
            break;
          case 'ArrowRight':
            likeCard();
            break;
          case 'ArrowUp':
            superLikeCard();
            break;
          default:
            break;
        }
      }
    };

    if (isAccessibilityMode) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, isAccessibilityMode]);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1>IsraLove 💙</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Show authentication screen if not logged in
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`app ${isAccessibilityMode ? 'accessibility-mode' : ''}`}>
      {/* Accessibility Button */}
      <button 
        className="accessibility-btn" 
        onClick={toggleAccessibility}
        aria-label="הפעל/כבה מצב נגישות"
      >
        <i className="fas fa-universal-access"></i>
      </button>

      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">IsraLove 💙</div>
            <div className="nav-links">
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => showPage('home')}
              >
                בית
              </button>
              <button 
                className={`nav-link ${currentPage === 'discover' ? 'active' : ''}`}
                onClick={() => showPage('discover')}
              >
                גילוי
              </button>
              <button 
                className={`nav-link ${currentPage === 'messages' ? 'active' : ''}`}
                onClick={() => showPage('messages')}
              >
                הודעות
              </button>
              <button 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => showPage('profile')}
              >
                פרופיל
              </button>
              <button 
                className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
                onClick={() => showPage('settings')}
              >
                הגדרות
              </button>
            </div>
            <div className="profile-menu">
              
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Home Page */}
          {currentPage === 'home' && (
            <div className="page">
              <section className="hero">
                <h1>ברוך הבא, {user.firstName}!</h1>
                <p>מוצאים אהבה בארץ - מוכן להכיר אנשים חדשים?</p>
                <button className="cta-button" onClick={() => showPage('discover')}>
                  התחל לחפש
                </button>
              </section>
              <div className="home-icons-bar">
                <button className="icon-btn premium-link" onClick={openPremiumModal}>
                  <i className="fas fa-crown"></i>
                  <span>פרימיום</span>
                </button>
                <button className="icon-btn questions-link" onClick={openQuestionsModal}>
                  <i className="fas fa-brain"></i>
                  <span>שאלות התאמה</span>
                </button>
                <button className="icon-btn safety-link" onClick={() => openSafetyModal()}>
                  <i className="fas fa-shield-alt"></i>
                  <span>בטיחות ואבטחה</span>
                </button>
                <button className="icon-btn social-link" onClick={openSocialModal}>
                  <i className="fas fa-users"></i>
                  <span>פיצ'רים חברתיים</span>
                </button>
                {user.email === "yossidanilov96@gmail.com" && (
                  <button className="icon-btn admin-link" onClick={openAdminModal}>
                    <i className="fas fa-cog"></i>
                    <span>דשבורד מנהלים</span>
                  </button>
                )}
                <button className="icon-btn theme-link" onClick={openThemeModal}>
                  <i className="fas fa-palette"></i>
                  <span>הגדרות מראה</span>
                </button>
                <button className="icon-btn logout-link" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>התנתק</span>
                </button>
              </div>
            </div>
          )}

          {/* Discover Page */}
          {currentPage === 'discover' && (
            <div className="page">
              <div className="discover-container">
                <div className="card-stack">
                  {profiles.length > 0 ? (
                    <div 
                      className="profile-card"
                      ref={cardRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      <div className="card-overlay"></div>
                      <div className="card-image">
                        <div className="card-gradient"></div>
                        <div className="card-info">
                          <h2 className="card-name">
                            {profiles[currentProfileIndex]?.name}
                          </h2>
                          <p className="card-age">
                            גיל {profiles[currentProfileIndex]?.age} • {profiles[currentProfileIndex]?.city}
                          </p>
                          <p className="card-bio">
                            {profiles[currentProfileIndex]?.bio}
                          </p>
                          <div className="card-interests">
                            {profiles[currentProfileIndex]?.interests?.map((interest, index) => (
                              <span key={index} className="interest-tag">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-profiles-message">
                      <div className="empty-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <h3>אין עוד משתמשים באזור שלך</h3>
                      <p>
                        כרגע אין משתמשים אחרים באפליקציה. <br/>
                        שתף את האפליקציה עם חברים כדי לראות פרופילים!
                      </p>
                      <div className="empty-tips">
                        <p>💡 <strong>איך להתחיל:</strong></p>
                        <ul>
                          <li>שתף את האפליקציה עם חברים</li>
                          <li>בקש מחברים להירשם</li>
                          <li>מלא שאלונים כדי לשפר התאמות</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                {profiles.length > 0 && (
                  <div className="card-actions">
                    <button className="action-btn reject-btn" onClick={rejectCard}>
                      <i className="fas fa-times"></i>
                    </button>
                    <button className="action-btn super-like-btn" onClick={superLikeCard}>
                      <i className="fas fa-star"></i>
                    </button>
                    <button className="action-btn like-btn" onClick={likeCard}>
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                )}
                {isAccessibilityMode && profiles.length > 0 && (
                  <div className="keyboard-instructions">
                    <p>החצים: ← דחה | → אהבה | ↑ סופר לייק</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Page */}
          {currentPage === 'messages' && (
            <div className="page">
              <div className="messages-container">
                <div className="chat-sidebar">
                  {messages.length > 0 ? (
                    messages.map((chat, index) => (
                      <div 
                        key={chat.id}
                        className={`chat-item ${index === currentChatIndex ? 'active' : ''}`}
                        onClick={() => selectChat(index)}
                      >
                        <div className="chat-avatar"></div>
                        <div className="chat-info">
                          <h4>{chat.name}</h4>
                          <p className="chat-preview">{chat.lastMessage}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-chats-message">
                      <div className="empty-icon">
                        <i className="fas fa-comments"></i>
                      </div>
                      <h4>אין עדיין צ'אטים</h4>
                      <p>כשיהיו משתמשים נוספים, תוכל ליצור התאמות!</p>
                    </div>
                  )}
                </div>
                <div className="chat-main">
                  {messages.length > 0 ? (
                    <>
                      <div className="chat-header">
                        <h3>{messages[currentChatIndex]?.name}</h3>
                      </div>
                      <div className="chat-messages" id="chatMessages">
                        {messages[currentChatIndex]?.messages?.map((message) => (
                          <div key={message.id} className={`message ${message.sent ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                              {message.text}
                            </div>
                            <div className="message-time">{message.time}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="empty-chat-main">
                      <div className="empty-icon">
                        <i className="fas fa-heart"></i>
                      </div>
                    </div>
                  )}
                  <div className="chat-input">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="כתב הודעה..."
                    />
                    <button className="send-btn" onClick={sendMessage}>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Page */}
          {currentPage === 'profile' && (
            <div className="page">
              <div className="profile-container">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {userPhotos.length > 0 ? (
                      <img src={userPhotos[0].url} alt="Profile" />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                </div>
                <div className="profile-content">
                  <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
                  <p className="profile-age">
                    גיל {new Date().getFullYear() - new Date(user.birthDate).getFullYear()} • {user.city}
                  </p>
                  
                  <div className="profile-section">
                    <h3 className="section-title">התמונות שלי ({userPhotos.length}/5)</h3>
                    <div className="photo-grid">
                      {userPhotos.map((photo, index) => (
                        <div key={photo.id} className="photo-item">
                          <img src={photo.url} alt={`תמונה ${index + 1}`} />
                          <button 
                            className="remove-photo-btn"
                            onClick={() => removePhoto(photo.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      {userPhotos.length < 5 && (
                        <label className="add-photo-btn">
                          <i className="fas fa-plus"></i>
                          <span>הוסף תמונה</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3 className="section-title">אודותיי</h3>
                    <p className="section-content">
                      {user.bio || 'עדיין לא הוספת תיאור אישי. עבור להגדרות כדי להוסיף.'}
                    </p>
                  </div>

                  <div className="profile-section">
                    <h3 className="section-title">תחומי עניין</h3>
                    <div className="tags">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, index) => (
                          <span key={index} className="tag">{interest}</span>
                        ))
                      ) : (
                        <p>עדיין לא הוספת תחומי עניין. עבור להגדרות כדי להוסיף.</p>
                      )}
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3 className="section-title">סטטיסטיקות</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-number">{profiles.length}</span>
                        <span className="stat-label">פרופילים נצפו</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{messages.length}</span>
                        <span className="stat-label">צ'אטים</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{userPhotos.length}</span>
                        <span className="stat-label">תמונות</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Page */}
          {currentPage === 'settings' && (
            <div className="page">
              <div className="settings-container">
                <div className="settings-section">
                  <h2 className="settings-title">פרטים אישיים</h2>
                  
                  <div className="form-group">
                    <label className="form-label">שם פרטי *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={settings.firstName || user.firstName || ''} 
                      onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                      placeholder="הכנס את השם הפרטי שלך" 
                    />
                    <div className="field-description">השם שיוצג בפרופיל שלך</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">שם משפחה *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={settings.lastName || user.lastName || ''} 
                      onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                      placeholder="הכנס את שם המשפחה שלך" 
                    />
                    <div className="field-description">שם המשפחה שיוצג בפרופיל שלך</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">עיר מגורים *</label>
                    <select 
                      className="form-select" 
                      value={settings.city || user.city || 'תל אביב'}
                      onChange={(e) => setSettings({...settings, city: e.target.value})}
                    >
                      <option value="">בחר עיר מגורים</option>
                      <option value="תל אביב">תל אביב</option>
                      <option value="ירושלים">ירושלים</option>
                      <option value="חיפה">חיפה</option>
                      <option value="באר שבע">באר שבע</option>
                      <option value="אשדוד">אשדוד</option>
                      <option value="פתח תקווה">פתח תקווה</option>
                      <option value="אחר">עיר אחרת</option>
                    </select>
                    <div className="field-description">העיר שלך תשמש לחיפוש אנשים באזור שלך</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">תיאור אישי</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="ספר על עצמך, תחומי העניין שלך, מה אתה מחפש..."
                      value={settings.bio || user.bio || ''}
                      onChange={(e) => setSettings({...settings, bio: e.target.value})}
                    />
                    <div className="field-description">ספר על עצמך כדי שאחרים יוכלו להכיר אותך טוב יותר</div>
                  </div>
                </div>

                <div className="settings-section">
                  <h2 className="settings-title">העדפות חיפוש</h2>
                  
                  <div className="form-group">
                    <label className="form-label">מחפש/ת *</label>
                    <select 
                      className="form-select" 
                      value={settings.lookingFor || user.lookingFor || 'women'}
                      onChange={(e) => setSettings({...settings, lookingFor: e.target.value})}
                    >
                      <option value="">בחר מי אתה מחפש/ת</option>
                      <option value="women">נשים</option>
                      <option value="men">גברים</option>
                      <option value="everyone">כולם</option>
                    </select>
                    <div className="field-description">בחר את המגדר שאתה מעוניין/ת לפגוש</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">טווח גילאים *</label>
                    <div className="range-group">
                      <div className="age-input-group">
                        <label className="age-label">מגיל:</label>
                        <input 
                          type="number" 
                          className="form-input range-input" 
                          value={settings.ageRange?.min || 22}
                          onChange={(e) => setSettings({
                            ...settings, 
                            ageRange: {...settings.ageRange, min: parseInt(e.target.value)}
                          })}
                          placeholder="18" 
                          min="18"
                          max="100"
                        />
                      </div>
                      <div className="age-input-group">
                        <label className="age-label">עד גיל:</label>
                        <input 
                          type="number" 
                          className="form-input range-input" 
                          value={settings.ageRange?.max || 35}
                          onChange={(e) => setSettings({
                            ...settings, 
                            ageRange: {...settings.ageRange, max: parseInt(e.target.value)}
                          })}
                          placeholder="50" 
                          min="18"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="field-description">בחר את טווח הגילאים שאתה מעוניין/ת לפגוש</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">רדיוס חיפוש *</label>
                    <div className="range-slider-container">
                      <input 
                        type="range" 
                        className="form-input range-slider" 
                        min="1" 
                        max="100" 
                        value={settings.searchRadius || 50}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setSettings({...settings, searchRadius: newValue});
                          // Force re-render by updating state
                          setTimeout(() => {
                            setSettings(prev => ({...prev, searchRadius: newValue}));
                          }, 10);
                        }}
                      />
                      <div className="range-value">{settings.searchRadius || 50} ק"מ</div>
                    </div>
                    <div className="field-description">בחר עד כמה רחוק אתה מוכן/ה לנסוע כדי לפגוש אנשים</div>
                  </div>
                </div>

                <div className="settings-section">
                  <h2 className="settings-title">הגדרות פרטיות</h2>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <input 
                        type="checkbox" 
                        checked={settings.privacy?.showOnlyToLiked || false}
                        onChange={(e) => setSettings({
                          ...settings, 
                          privacy: {...settings.privacy, showOnlyToLiked: e.target.checked}
                        })}
                      /> 
                      הצג אותי רק לאנשים שליציתי להם
                      <div className="setting-description">הפרופיל שלך יוצג רק למשתמשים שאתה עשה להם לייק</div>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <input 
                        type="checkbox" 
                        checked={settings.privacy?.messageNotifications || false}
                        onChange={(e) => setSettings({
                          ...settings, 
                          privacy: {...settings.privacy, messageNotifications: e.target.checked}
                        })}
                      /> 
                      קבל התראות על הודעות חדשות
                      <div className="setting-description">תקבל התראה כשמישהו שולח לך הודעה חדשה</div>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <input 
                        type="checkbox" 
                        checked={settings.privacy?.matchNotifications || false}
                        onChange={(e) => setSettings({
                          ...settings, 
                          privacy: {...settings.privacy, matchNotifications: e.target.checked}
                        })}
                      /> 
                      קבל התראות על התאמות חדשות
                      <div className="setting-description">תקבל התראה כשאתה מתאים עם מישהו חדש</div>
                    </label>
                  </div>
                </div>

                <button className="save-btn" onClick={() => {
                  // Save settings to localStorage
                  localStorage.setItem('userSettings', JSON.stringify(settings));
                  
                  // Update user data
                  const updatedUser = { ...user, ...settings };
                  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  
                  showNotification('הגדרות נשמרו בהצלחה!');
                }}>שמור שינויים</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification ? 'show' : ''}`}>
          {notification}
        </div>
      )}

      {/* Match Popup */}
      {showMatchPopup && (
        <div className="match-popup">
          <div className="match-content">
            <h2 className="match-title">זה מאץ'! 🎉</h2>
            <div className="match-avatars">
              <div className="match-avatar"></div>
              <div className="match-avatar"></div>
            </div>
            <p>אתם התאמתם! תתחילו לשוחח עכשיו</p>
            <button className="cta-button" onClick={() => showPage('messages')}>
              שלח הודעה
            </button>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumUI 
          onClose={() => setShowPremiumModal(false)}
          showNotification={showNotification}
        />
        
      )}
      {/* Questions Modal */}
      {showQuestionsModal && (
        <QuestionsUI 
          onClose={() => setShowQuestionsModal(false)}
          showNotification={showNotification}
        />
      )}
      {/* Safety Modal */}
      {showSafetyModal && (
        <SafetyUI 
          onClose={() => setShowSafetyModal(false)}
          showNotification={showNotification}
          targetUserId={safetyContext.targetUserId}
          context={safetyContext.context}
        />
      )}

      {/* Social Modal */}
      {showSocialModal && (
        <SocialUI 
          onClose={() => setShowSocialModal(false)}
          showNotification={showNotification}
        />
      )}
{/* Admin Dashboard Modal */}
      {showAdminModal && (
        <AdminDashboard 
          onClose={() => setShowAdminModal(false)}
          showNotification={showNotification}
        />
      )}
      {/* Theme Modal */}
      {showThemeModal && (
        <ThemeSelector 
          onClose={() => setShowThemeModal(false)}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default App;