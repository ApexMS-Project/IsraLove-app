import React, { useState, useEffect, useRef } from 'react';
import SocialFeatures from './SocialFeatures';
import './SocialUI.css';

const SocialUI = ({ onClose, showNotification }) => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'stories', 'events', 'groups', 'connections'
  const [socialSystem] = useState(new SocialFeatures());
  const [stories, setStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [recommendedGroups, setRecommendedGroups] = useState([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [socialStats, setSocialStats] = useState({});
  
  // Story creation form
  const [storyForm, setStoryForm] = useState({
    category: 'moment',
    type: 'text',
    content: '',
    media: null
  });
  
  // Event creation form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'meetup',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    price: 0,
    requirements: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStories(socialSystem.getActiveStories());
    setEvents(socialSystem.getUpcomingEvents());
    setUserGroups(socialSystem.getUserGroups());
    setRecommendedGroups(socialSystem.getRecommendedGroups());
    setSocialStats({
      storyStats: socialSystem.getStoryStats(),
      eventStats: socialSystem.getEventStats(),
      socialScore: socialSystem.getSocialScore()
    });
  };

  // Story Management
  const handleCreateStory = () => {
    if (!storyForm.content.trim()) {
      showNotification('אנא הוסף תוכן לסטורי');
      return;
    }

    const story = socialSystem.createStory(storyForm);
    setStories(socialSystem.getActiveStories());
    setStoryForm({ category: 'moment', type: 'text', content: '', media: null });
    setShowCreateStory(false);
    showNotification('הסטורי נוצר בהצלחה! ✨');
    loadData();
  };

  const handleLikeStory = (storyId) => {
    const result = socialSystem.likeStory(storyId);
    if (result.success) {
      setStories(socialSystem.getActiveStories());
      if (result.liked) {
        showNotification('נוסף לייק לסטורי! ❤️');
      } else {
        showNotification('הלייק הוסר מהסטורי');
      }
    } else {
      showNotification('שגיאה בעדכון הלייק');
    }
  };

  const handleViewStory = (story) => {
    socialSystem.viewStory(story.id);
    setSelectedStory(story);
    setStories(socialSystem.getActiveStories());
  };

  const handleReplyToStory = (storyId, message) => {
    const result = socialSystem.replyToStory(storyId, message);
    if (result.success) {
      // Force re-render to show the new reply
      setTimeout(() => {
        setStories([...socialSystem.getActiveStories()]);
      }, 100);
      showNotification('התגובה נשלחה בהצלחה! 💬');
    } else {
      showNotification('שגיאה בשליחת התגובה');
    }
  };

  const handleReplyClick = (storyId) => {
    const story = stories.find(s => s.id === storyId);
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(null); // Close reply section
    } else {
      setSelectedStory(story); // Open reply section
    }
    // Force re-render
    setTimeout(() => {
      setStories([...socialSystem.getActiveStories()]);
    }, 100);
  };

  const handleMediaClick = (mediaUrl, type) => {
    // Create a modal to show the media in full size
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.innerHTML = `
      <div class="media-modal-overlay">
        <div class="media-modal-content">
          <button class="media-modal-close">×</button>
          ${type === 'image' 
            ? `<img src="${mediaUrl}" alt="Full size" />` 
            : `<video src="${mediaUrl}" controls autoplay />`
          }
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.querySelector('.media-modal-overlay').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Close modal on close button click
    modal.querySelector('.media-modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Close modal on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  };

  // Event Management
  const handleCreateEvent = () => {
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.time) {
      showNotification('אנא מלא את כל השדות הנדרשים');
      return;
    }

    const event = socialSystem.createEvent(eventForm);
    setEvents(socialSystem.getUpcomingEvents());
    setEventForm({
      title: '',
      description: '',
      category: 'meetup',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      price: 0,
      requirements: ''
    });
    setShowCreateEvent(false);
    showNotification('האירוע נוצר בהצלחה! 🎉');
    loadData();
  };

  const handleJoinEvent = (eventId) => {
    const result = socialSystem.joinEvent(eventId);
    if (result.success) {
      setEvents(socialSystem.getUpcomingEvents());
      showNotification(result.message + ' 🎉');
      loadData();
    } else {
      showNotification(result.message);
    }
  };

  const handleLeaveEvent = (eventId) => {
    const result = socialSystem.leaveEvent(eventId);
    if (result.success) {
      setEvents(socialSystem.getUpcomingEvents());
      showNotification(result.message);
      loadData();
    }
  };

  const handleShowInterest = (eventId) => {
    const result = socialSystem.showInterestInEvent(eventId);
    if (result.success) {
      setEvents(socialSystem.getUpcomingEvents());
      showNotification(result.message + ' ⭐');
    }
  };

  // Group Management
  const handleJoinGroup = (groupId) => {
    const result = socialSystem.joinGroup(groupId);
    if (result.success) {
      setUserGroups(socialSystem.getUserGroups());
      setRecommendedGroups(socialSystem.getRecommendedGroups());
      showNotification(result.message + ' 👥');
      loadData();
    }
  };

  const handleLeaveGroup = (groupId) => {
    const result = socialSystem.leaveGroup(groupId);
    if (result.success) {
      setUserGroups(socialSystem.getUserGroups());
      setRecommendedGroups(socialSystem.getRecommendedGroups());
      showNotification(result.message);
      loadData();
    }
  };

  // File Upload for Stories
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification('קובץ חייב להיות קטן מ-10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setStoryForm(prev => ({
          ...prev,
          media: e.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'עכשיו';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    return `לפני ${Math.floor(diffInHours / 24)} ימים`;
  };

  const renderOverview = () => (
    <div className="social-overview">
      {/* Social Score */}
      <div className="social-score-card">
        <div className="social-score-content">
          <div className="social-score-number">{socialStats.socialScore || 0}</div>
          <div className="social-score-label">ציון חברתי</div>
        </div>
        <div className="social-score-icon">
          <i className="fas fa-star"></i>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="social-quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-number">{socialStats.storyStats?.totalStories || 0}</div>
          <div className="quick-stat-label">סטוריז</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">{socialStats.eventStats?.eventsJoined || 0}</div>
          <div className="quick-stat-label">אירועים</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">{userGroups.length}</div>
          <div className="quick-stat-label">קבוצות</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">{socialStats.storyStats?.totalViews || 0}</div>
          <div className="quick-stat-label">צפיות</div>
        </div>
      </div>

      {/* Recent Stories Preview */}
      <div className="recent-stories-preview">
        <h3>📸 סטוריז אחרונות - שתף רגעים מיוחדים</h3>
        <div className="stories-grid">
          {stories.slice(0, 3).map(story => (
            <div key={story.id} className="story-preview-card" onClick={() => handleViewStory(story)}>
              <div className="story-avatar">
                {story.userAvatar ? (
                  <img src={story.userAvatar} alt={story.userName} />
                ) : (
                  story.userName.charAt(0)
                )}
              </div>
              <div className="story-info">
                <div className="story-author">{story.userName}</div>
                <div className="story-time">{getTimeSince(story.createdAt)}</div>
              </div>
              <div className="story-category-badge" style={{backgroundColor: socialSystem.storyCategories[story.category]?.color}}>
                <i className={socialSystem.storyCategories[story.category]?.icon}></i>
              </div>
            </div>
          ))}
        </div>
        <button className="view-all-btn" onClick={() => setCurrentView('stories')}>
          👀 צפה בכל הסטוריז
        </button>
      </div>

      {/* Upcoming Events Preview */}
      <div className="upcoming-events-preview">
        <h3>🎉 אירועים קרובים - הצטרף למפגשים חברתיים</h3>
        <div className="events-list">
          {events.slice(0, 2).map(event => (
            <div key={event.id} className="event-preview-card">
              <div className="event-category-icon" style={{backgroundColor: socialSystem.eventCategories[event.category]?.color}}>
                <i className={socialSystem.eventCategories[event.category]?.icon}></i>
              </div>
              <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-date">{formatDate(event.date)} • {formatTime(event.time)}</div>
                <div className="event-participants">{event.participants.length} משתתפים</div>
              </div>
            </div>
          ))}
        </div>
        <button className="view-all-btn" onClick={() => setCurrentView('events')}>
          📅 צפה בכל האירועים
        </button>
      </div>
    </div>
  );

  const renderStories = () => (
    <div className="stories-section">
      <div className="section-header">
        <h2>סטוריז</h2>
        <button className="create-btn" onClick={() => setShowCreateStory(true)}>
          <i className="fas fa-plus"></i>
          צור סטורי
        </button>
      </div>

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="create-modal">
          <div className="create-modal-content">
            <div className="create-modal-header">
              <h3>צור סטורי חדש</h3>
              <button className="close-btn" onClick={() => setShowCreateStory(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="story-categories">
              {Object.values(socialSystem.storyCategories).map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${storyForm.category === category.id ? 'active' : ''}`}
                  style={{borderColor: category.color}}
                  onClick={() => setStoryForm(prev => ({...prev, category: category.id}))}
                >
                  <i className={category.icon} style={{color: category.color}}></i>
                  {category.name}
                </button>
              ))}
            </div>

            <textarea
              className="story-content-input"
              placeholder="מה קורה איתך היום?"
              value={storyForm.content}
              onChange={(e) => setStoryForm(prev => ({...prev, content: e.target.value}))}
              maxLength={300}
            />

            <div className="media-upload-section">
              <button className="media-upload-btn" onClick={() => fileInputRef.current?.click()}>
                <i className="fas fa-camera"></i>
                הוסף תמונה או וידאו
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                style={{display: 'none'}}
              />
              {storyForm.media && (
                <div className="media-preview">
                  {storyForm.type === 'image' ? (
                    <img src={storyForm.media} alt="Preview" />
                  ) : (
                    <video src={storyForm.media} controls />
                  )}
                </div>
              )}
            </div>

            <div className="create-actions">
              <button className="cancel-btn" onClick={() => setShowCreateStory(false)}>
                ביטול
              </button>
              <button className="create-story-btn" onClick={handleCreateStory}>
                פרסם סטורי
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stories List */}
      <div className="stories-list">
        {stories.map(story => (
          <div key={story.id} className="story-card">
            <div className="story-header">
              <div className="story-user">
                <div className="story-avatar">
                  {story.userAvatar ? (
                    <img src={story.userAvatar} alt={story.userName} />
                  ) : (
                    story.userName.charAt(0)
                  )}
                </div>
                <div className="story-user-info">
                  <div className="story-username">{story.userName}</div>
                  <div className="story-timestamp">{getTimeSince(story.createdAt)}</div>
                </div>
              </div>
              <div className="story-category" style={{backgroundColor: socialSystem.storyCategories[story.category]?.color}}>
                <i className={socialSystem.storyCategories[story.category]?.icon}></i>
                {socialSystem.storyCategories[story.category]?.name}
              </div>
            </div>

            <div className="story-content">
              {story.content}
              {story.media && (
                <div className="story-media">
                  {story.type === 'image' ? (
                    <img 
                      src={story.media} 
                      alt="Story content" 
                      className="story-image"
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginTop: '10px'
                      }}
                    />
                  ) : (
                    <video 
                      src={story.media} 
                      controls 
                      className="story-video"
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        borderRadius: '8px',
                        marginTop: '10px'
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="story-actions">
              <button 
                className={`story-action-btn ${story.likedBy && story.likedBy.includes(socialSystem.getCurrentUserId()) ? 'liked' : ''}`} 
                onClick={() => handleLikeStory(story.id)}
              >
                <i className="fas fa-heart"></i>
                {story.likes || 0}
              </button>
              <button className="story-action-btn" onClick={() => handleViewStory(story)}>
                <i className="fas fa-eye"></i>
                {story.viewers ? story.viewers.length : 0}
              </button>
              <button 
                className="story-action-btn reply-btn" 
                onClick={() => handleReplyClick(story.id)}
              >
                <i className="fas fa-reply"></i>
                הגב
              </button>
            </div>

            {/* Reply Section */}
            {selectedStory && selectedStory.id === story.id && (
              <div className="story-reply-section">
                <div className="reply-input-container">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="כתוב תגובה..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleReplyToStory(story.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button 
                    className="send-reply-btn"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      if (input.value.trim()) {
                        handleReplyToStory(story.id, input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
                
                {/* Show existing replies */}
                {story.replies && story.replies.length > 0 && (
                  <div className="story-replies">
                    {story.replies.slice(0, 3).map(reply => (
                      <div key={reply.id} className="story-reply">
                        <div className="reply-user">
                          <div className="reply-avatar">
                            {reply.userAvatar ? (
                              <img src={reply.userAvatar} alt={reply.userName} />
                            ) : (
                              reply.userName.charAt(0)
                            )}
                          </div>
                          <div className="reply-content">
                            <div className="reply-username">{reply.userName}</div>
                            <div className="reply-message">{reply.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {story.replies.length > 3 && (
                      <div className="more-replies">
                        צפה ב-{story.replies.length - 3} תגובות נוספות
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h2>אירועים ומפגשים</h2>
        <button className="create-btn" onClick={() => setShowCreateEvent(true)}>
          <i className="fas fa-plus"></i>
          צור אירוע
        </button>
      </div>

      {/* Event Categories Filter */}
      <div className="event-categories-filter">
        {Object.values(socialSystem.eventCategories).map(category => (
          <button key={category.id} className="category-filter-btn">
            <i className={category.icon} style={{color: category.color}}></i>
            {category.name}
          </button>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="create-modal">
          <div className="create-modal-content large">
            <div className="create-modal-header">
              <h3>צור אירוע חדש</h3>
              <button className="close-btn" onClick={() => setShowCreateEvent(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="event-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="שם האירוע"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({...prev, title: e.target.value}))}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <textarea
                  placeholder="תיאור האירוע"
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({...prev, description: e.target.value}))}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm(prev => ({...prev, category: e.target.value}))}
                  className="form-select"
                >
                  {Object.values(socialSystem.eventCategories).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row two-cols">
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm(prev => ({...prev, date: e.target.value}))}
                  className="form-input"
                />
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm(prev => ({...prev, time: e.target.value}))}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="מיקום האירוע"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({...prev, location: e.target.value}))}
                  className="form-input"
                />
              </div>

              <div className="form-row two-cols">
                <input
                  type="number"
                  placeholder="מספר משתתפים מקסימלי"
                  value={eventForm.maxParticipants}
                  onChange={(e) => setEventForm(prev => ({...prev, maxParticipants: e.target.value}))}
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="עלות (₪)"
                  value={eventForm.price}
                  onChange={(e) => setEventForm(prev => ({...prev, price: Number(e.target.value)}))}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <textarea
                  placeholder="דרישות מיוחדות"
                  value={eventForm.requirements}
                  onChange={(e) => setEventForm(prev => ({...prev, requirements: e.target.value}))}
                  className="form-textarea small"
                />
              </div>
            </div>

            <div className="create-actions">
              <button className="cancel-btn" onClick={() => setShowCreateEvent(false)}>
                ביטול
              </button>
              <button className="create-event-btn" onClick={handleCreateEvent}>
                צור אירוע
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div className="event-category-badge" style={{backgroundColor: socialSystem.eventCategories[event.category]?.color}}>
                <i className={socialSystem.eventCategories[event.category]?.icon}></i>
              </div>
              <div className="event-info">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-creator">ע"י {event.creatorName}</div>
              </div>
              {event.price > 0 && (
                <div className="event-price">₪{event.price}</div>
              )}
            </div>

            <div className="event-details">
              <div className="event-detail">
                <i className="fas fa-calendar"></i>
                {formatDate(event.date)}
              </div>
              <div className="event-detail">
                <i className="fas fa-clock"></i>
                {formatTime(event.time)}
              </div>
              <div className="event-detail">
                <i className="fas fa-map-marker-alt"></i>
                {event.location}
              </div>
            </div>

            <div className="event-description">
              {event.description}
            </div>

            <div className="event-participants">
              <div className="participants-count">
                <i className="fas fa-users"></i>
                {event.participants.length} משתתפים
                {event.maxParticipants && ` מתוך ${event.maxParticipants}`}
              </div>
              {event.interestedUsers.length > 0 && (
                <div className="interested-count">
                  <i className="fas fa-star"></i>
                  {event.interestedUsers.length} מעוניינים
                </div>
              )}
            </div>

            <div className="event-actions">
              {event.participants.includes(socialSystem.getCurrentUserId()) ? (
                <button className="event-action-btn joined" onClick={() => handleLeaveEvent(event.id)}>
                  <i className="fas fa-check"></i>
                  משתתף
                </button>
              ) : (
                <>
                  <button className="event-action-btn primary" onClick={() => handleJoinEvent(event.id)}>
                    <i className="fas fa-plus"></i>
                    הצטרף
                  </button>
                  <button className="event-action-btn secondary" onClick={() => handleShowInterest(event.id)}>
                    <i className="fas fa-star"></i>
                    מעוניין
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroups = () => (
    <div className="groups-section">
      <div className="section-header">
        <h2>קבוצות עניין</h2>
      </div>

      {/* User Groups */}
      <div className="user-groups">
        <h3>הקבוצות שלי ({userGroups.length})</h3>
        <div className="groups-grid">
          {userGroups.map(group => (
            <div key={group.id} className="group-card joined">
              <div className="group-icon" style={{backgroundColor: group.color}}>
                <i className={group.icon}></i>
              </div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-members">{group.members} חברים</div>
              </div>
              <button className="leave-group-btn" onClick={() => handleLeaveGroup(group.id)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Groups */}
      <div className="recommended-groups">
        <h3>קבוצות מומלצות</h3>
        <div className="groups-grid">
          {recommendedGroups.map(group => (
            <div key={group.id} className="group-card">
              <div className="group-icon" style={{backgroundColor: group.color}}>
                <i className={group.icon}></i>
              </div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-members">{group.members} חברים</div>
              </div>
              <button className="join-group-btn" onClick={() => handleJoinGroup(group.id)}>
                <i className="fas fa-plus"></i>
                הצטרף
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="social-overlay">
      <div className="social-modal">
        <div className="social-header">
          <h1 className="social-title">
            <i className="fas fa-users"></i>
            פיצ'רים חברתיים
          </h1>
          <button className="social-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="social-nav">
          <button 
            className={`social-nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            <i className="fas fa-home"></i>
            סקירה
          </button>
          <button 
            className={`social-nav-item ${currentView === 'stories' ? 'active' : ''}`}
            onClick={() => setCurrentView('stories')}
          >
            <i className="fas fa-camera"></i>
            סטוריז
          </button>
          <button 
            className={`social-nav-item ${currentView === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentView('events')}
          >
            <i className="fas fa-calendar-alt"></i>
            אירועים
          </button>
          <button 
            className={`social-nav-item ${currentView === 'groups' ? 'active' : ''}`}
            onClick={() => setCurrentView('groups')}
          >
            <i className="fas fa-layer-group"></i>
            קבוצות
          </button>
          <button 
            className={`social-nav-item ${currentView === 'connections' ? 'active' : ''}`}
            onClick={() => setCurrentView('connections')}
          >
            <i className="fas fa-link"></i>
            קשרים
          </button>
        </div>

        <div className="social-content">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'stories' && renderStories()}
          {currentView === 'events' && renderEvents()}
          {currentView === 'groups' && renderGroups()}
          {currentView === 'connections' && (
            <div className="connections-section">
              <h2>חברים משותפים</h2>
              <p>פיצ'ר זה יפותח בקרוב...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialUI;