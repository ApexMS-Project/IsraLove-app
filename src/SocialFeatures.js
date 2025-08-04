// SocialFeatures.js - Advanced Social Features System

class SocialFeatures {
  constructor() {
    // Story categories and settings
    this.storyCategories = {
      moment: { id: 'moment', name: 'רגע', icon: 'fas fa-camera', color: '#ff6b6b' },
      mood: { id: 'mood', name: 'מצב רוח', icon: 'fas fa-heart', color: '#ff9f43' },
      activity: { id: 'activity', name: 'פעילות', icon: 'fas fa-running', color: '#10ac84' },
      food: { id: 'food', name: 'אוכל', icon: 'fas fa-utensils', color: '#ee5a6f' },
      travel: { id: 'travel', name: 'טיול', icon: 'fas fa-map-marker-alt', color: '#5f27cd' },
      achievement: { id: 'achievement', name: 'הישג', icon: 'fas fa-trophy', color: '#feca57' }
    };

    // Event categories
    this.eventCategories = {
      meetup: { id: 'meetup', name: 'מפגש כללי', icon: 'fas fa-users', color: '#3867d6' },
      coffee: { id: 'coffee', name: 'קפה', icon: 'fas fa-coffee', color: '#8b4513' },
      dinner: { id: 'dinner', name: 'ארוחת ערב', icon: 'fas fa-utensils', color: '#e74c3c' },
      movie: { id: 'movie', name: 'סרט', icon: 'fas fa-film', color: '#9b59b6' },
      sport: { id: 'sport', name: 'ספורט', icon: 'fas fa-futbol', color: '#27ae60' },
      culture: { id: 'culture', name: 'תרבות', icon: 'fas fa-theater-masks', color: '#f39c12' },
      nature: { id: 'nature', name: 'טבע', icon: 'fas fa-tree', color: '#2ecc71' },
      nightlife: { id: 'nightlife', name: 'חיי לילה', icon: 'fas fa-cocktail', color: '#8e44ad' }
    };

    // Interest groups
    this.interestGroups = {
      books: { id: 'books', name: 'אוהבי ספרים', icon: 'fas fa-book', members: 234, color: '#3498db' },
      fitness: { id: 'fitness', name: 'כושר וספורט', icon: 'fas fa-dumbbell', members: 567, color: '#e74c3c' },
      cooking: { id: 'cooking', name: 'בישול וקולינריה', icon: 'fas fa-chef-hat', members: 189, color: '#f39c12' },
      photography: { id: 'photography', name: 'צילום', icon: 'fas fa-camera-retro', members: 345, color: '#9b59b6' },
      music: { id: 'music', name: 'מוזיקה', icon: 'fas fa-music', members: 456, color: '#1abc9c' },
      travel: { id: 'travel', name: 'נסיעות וטיולים', icon: 'fas fa-plane', members: 678, color: '#27ae60' },
      tech: { id: 'tech', name: 'טכנולוגיה', icon: 'fas fa-laptop-code', members: 289, color: '#34495e' },
      art: { id: 'art', name: 'אמנות ויצירה', icon: 'fas fa-palette', members: 156, color: '#e67e22' }
    };

    // Initialize data
    this.init();
  }

  init() {
    // Load existing data from localStorage
    this.stories = JSON.parse(localStorage.getItem('socialStories') || '[]');
    this.events = JSON.parse(localStorage.getItem('socialEvents') || '[]');
    this.userGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
    this.mutualConnections = JSON.parse(localStorage.getItem('mutualConnections') || '[]');

    // No sample data - production ready
  }

  // Story Management
  createStory(content) {
    const story = {
      id: Date.now() + Math.random(),
      userId: this.getCurrentUserId(),
      userName: this.getCurrentUserName(),
      userAvatar: this.getCurrentUserAvatar(),
      category: content.category,
      type: content.type, // 'image', 'text', 'poll'
      content: content.content,
      media: content.media || null,
      poll: content.poll || null,
      viewers: [],
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      isActive: true
    };

    this.stories.unshift(story);
    this.saveStories();
    return story;
  }

  getActiveStories() {
    const now = new Date();
    return this.stories.filter(story => {
      const expiresAt = new Date(story.expiresAt);
      return story.isActive && expiresAt > now;
    });
  }

  getUserStories(userId) {
    return this.getActiveStories().filter(story => story.userId === userId);
  }

  viewStory(storyId) {
    const currentUserId = this.getCurrentUserId();
    const story = this.stories.find(s => s.id === storyId);
    
    if (story && !story.viewers.includes(currentUserId)) {
      story.viewers.push(currentUserId);
      this.saveStories();
      return { success: true, viewers: story.viewers.length };
    }
    return { success: false };
  }

  likeStory(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    const currentUserId = this.getCurrentUserId();
    
    if (story) {
      // Initialize likedBy array if it doesn't exist
      if (!story.likedBy) {
        story.likedBy = [];
      }
      
      // Check if user already liked this story
      const userLikedIndex = story.likedBy.indexOf(currentUserId);
      
      if (userLikedIndex === -1) {
        // User hasn't liked yet - add like
        story.likedBy.push(currentUserId);
        story.likes = story.likedBy.length;
        this.saveStories();
        return { success: true, liked: true, likes: story.likes };
      } else {
        // User already liked - remove like (toggle)
        story.likedBy.splice(userLikedIndex, 1);
        story.likes = story.likedBy.length;
        this.saveStories();
        return { success: true, liked: false, likes: story.likes };
      }
    }
    return { success: false, error: 'Story not found' };
  }

  replyToStory(storyId, message) {
    const story = this.stories.find(s => s.id === storyId);
    if (story && message && message.trim()) {
      const reply = {
        id: Date.now() + Math.random(),
        userId: this.getCurrentUserId(),
        userName: this.getCurrentUserName(),
        userAvatar: this.getCurrentUserAvatar(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      if (!story.replies) {
        story.replies = [];
      }
      
      story.replies.push(reply);
      this.saveStories();
      return { success: true, reply: reply };
    }
    return { success: false, error: 'Invalid story or message' };
  }

  // Event Management
  createEvent(eventData) {
    const event = {
      id: Date.now() + Math.random(),
      creatorId: this.getCurrentUserId(),
      creatorName: this.getCurrentUserName(),
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      maxParticipants: eventData.maxParticipants || null,
      participants: [this.getCurrentUserId()],
      interestedUsers: [],
      price: eventData.price || 0,
      requirements: eventData.requirements || '',
      images: eventData.images || [],
      isPublic: eventData.isPublic !== false,
      createdAt: new Date().toISOString(),
      status: 'active' // 'active', 'cancelled', 'completed'
    };

    this.events.unshift(event);
    this.saveEvents();
    return event;
  }

  getUpcomingEvents() {
    const now = new Date();
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return event.status === 'active' && eventDate >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getEventsByCategory(category) {
    return this.getUpcomingEvents().filter(event => event.category === category);
  }

  joinEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    const currentUserId = this.getCurrentUserId();
    
    if (event && !event.participants.includes(currentUserId)) {
      if (!event.maxParticipants || event.participants.length < event.maxParticipants) {
        event.participants.push(currentUserId);
        // Remove from interested if was there
        const interestedIndex = event.interestedUsers.indexOf(currentUserId);
        if (interestedIndex > -1) {
          event.interestedUsers.splice(interestedIndex, 1);
        }
        this.saveEvents();
        return { success: true, message: 'הצטרפת לאירוע בהצלחה!' };
      } else {
        return { success: false, message: 'האירוע מלא' };
      }
    }
    return { success: false, message: 'לא ניתן להצטרף לאירוע' };
  }

  leaveEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    const currentUserId = this.getCurrentUserId();
    
    if (event) {
      const participantIndex = event.participants.indexOf(currentUserId);
      if (participantIndex > -1) {
        event.participants.splice(participantIndex, 1);
        this.saveEvents();
        return { success: true, message: 'עזבת את האירוע' };
      }
    }
    return { success: false, message: 'שגיאה ביציאה מהאירוע' };
  }

  showInterestInEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    const currentUserId = this.getCurrentUserId();
    
    if (event && !event.participants.includes(currentUserId) && !event.interestedUsers.includes(currentUserId)) {
      event.interestedUsers.push(currentUserId);
      this.saveEvents();
      return { success: true, message: 'סומנת כמעוניין/ת באירוע' };
    }
    return { success: false, message: 'לא ניתן לסמן עניין' };
  }

  // Group Management
  joinGroup(groupId) {
    const group = this.interestGroups[groupId];
    if (group && !this.userGroups.find(g => g.id === groupId)) {
      this.userGroups.push({...group});
      this.saveUserGroups();
      return { success: true, message: `הצטרפת לקבוצת ${group.name}` };
    }
    return { success: false, message: 'לא ניתן להצטרף לקבוצה' };
  }

  leaveGroup(groupId) {
    const groupIndex = this.userGroups.findIndex(g => g.id === groupId);
    if (groupIndex > -1) {
      const groupName = this.userGroups[groupIndex].name;
      this.userGroups.splice(groupIndex, 1);
      this.saveUserGroups();
      return { success: true, message: `עזבת את קבוצת ${groupName}` };
    }
    return { success: false, message: 'שגיאה ביציאה מהקבוצה' };
  }

  getUserGroups() {
    return this.userGroups;
  }

  getRecommendedGroups() {
    return Object.values(this.interestGroups).filter(group => 
      !this.userGroups.find(userGroup => userGroup.id === group.id)
    );
  }

  // Statistics
  getStoryStats() {
    const userStories = this.getUserStories(this.getCurrentUserId());
    return {
      totalStories: userStories.length,
      totalViews: userStories.reduce((sum, story) => sum + (story.viewers ? story.viewers.length : 0), 0),
      totalLikes: userStories.reduce((sum, story) => sum + (story.likes || 0), 0),
      avgViews: userStories.length > 0 ? Math.round(userStories.reduce((sum, story) => sum + (story.viewers ? story.viewers.length : 0), 0) / userStories.length) : 0
    };
  }

  getEventStats() {
    const userEvents = this.events.filter(event => event.creatorId === this.getCurrentUserId());
    return {
      eventsCreated: userEvents.length,
      eventsJoined: this.events.filter(event => event.participants.includes(this.getCurrentUserId())).length,
      totalParticipants: userEvents.reduce((sum, event) => sum + event.participants.length, 0)
    };
  }

  getSocialScore() {
    const storyStats = this.getStoryStats();
    const eventStats = this.getEventStats();
    
    let score = 0;
    score += storyStats.totalStories * 5;
    score += storyStats.totalViews * 2;
    score += storyStats.totalLikes * 3;
    score += eventStats.eventsCreated * 10;
    score += eventStats.eventsJoined * 7;
    score += this.userGroups.length * 5;
    
    return Math.min(score, 100);
  }

  // Utility Methods
  getCurrentUserId() {
    return localStorage.getItem('userId') || 'anonymous_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUserName() {
    return localStorage.getItem('userName') || 'משתמש אנונימי';
  }

  getCurrentUserAvatar() {
    return localStorage.getItem('userAvatar') || null;
  }

  // Storage Methods
  saveStories() {
    localStorage.setItem('socialStories', JSON.stringify(this.stories));
  }

  saveEvents() {
    localStorage.setItem('socialEvents', JSON.stringify(this.events));
  }

  saveUserGroups() {
    localStorage.setItem('userGroups', JSON.stringify(this.userGroups));
  }

  saveMutualConnections() {
    localStorage.setItem('mutualConnections', JSON.stringify(this.mutualConnections));
  }
}

export default SocialFeatures;