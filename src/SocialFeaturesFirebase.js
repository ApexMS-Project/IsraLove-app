import firebaseDB from './FirebaseDatabase';

class SocialFeaturesFirebase {
  constructor() {
    this.currentUser = null;
    this.stories = [];
    this.events = [];
    this.groups = [];
    
    // Start cleanup interval for expired stories
    this.startCleanupInterval();
  }

  setCurrentUser(user) {
    this.currentUser = user;
    console.log('Social system updated with user:', user?.firstName);
  }

  getCurrentUserId() {
    return this.currentUser?.id || null;
  }

  getCurrentUserName() {
    if (!this.currentUser) return 'אנונימי';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  getCurrentUserAvatar() {
    if (!this.currentUser?.photos?.length) return null;
    return this.currentUser.photos[0]?.url || null;
  }

  // Story Management
  async createStory(storyData) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('משתמש לא מחובר');
    }

    // Check daily story limit
    const canCreateStory = await firebaseDB.checkUserStoryLimit(userId);
    if (!canCreateStory) {
      throw new Error('ניתן להעלות רק סטורי אחד ביום');
    }

    const story = {
      ...storyData,
      userId: userId,
      userName: this.getCurrentUserName(),
      userAvatar: this.getCurrentUserAvatar()
    };

    try {
      const createdStory = await firebaseDB.createStory(story);
      console.log('Story created successfully:', createdStory);
      return createdStory;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async getStories() {
    try {
      this.stories = await firebaseDB.getStories();
      return this.stories;
    } catch (error) {
      console.error('Error getting stories:', error);
      return [];
    }
  }

  async likeStory(storyId) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('משתמש לא מחובר');
    }

    try {
      const result = await firebaseDB.likeStory(storyId, userId);
      console.log('Story like updated:', result);
      return result;
    } catch (error) {
      console.error('Error liking story:', error);
      throw error;
    }
  }

  async replyToStory(storyId, replyText) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('משתמש לא מחובר');
    }

    if (!replyText?.trim()) {
      throw new Error('תגובה לא יכולה להיות רקה');
    }

    try {
      const reply = await firebaseDB.replyToStory(storyId, userId, replyText.trim());
      console.log('Reply added successfully:', reply);
      return reply;
    } catch (error) {
      console.error('Error replying to story:', error);
      throw error;
    }
  }

  async viewStory(storyId) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return { viewed: false, totalViews: 0 };
    }

    try {
      const result = await firebaseDB.viewStory(storyId, userId);
      console.log('Story view updated:', result);
      return result;
    } catch (error) {
      console.error('Error viewing story:', error);
      return { viewed: false, totalViews: 0 };
    }
  }

  async uploadMedia(file) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('משתמש לא מחובר');
    }

    try {
      const photoData = await firebaseDB.uploadPhoto(file, userId, 'story');
      console.log('Media uploaded successfully:', photoData);
      return photoData.url;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  // Events Management (placeholder for future implementation)
  createEvent(eventData) {
    console.log('Event creation not yet implemented with Firebase');
    return null;
  }

  getEvents() {
    console.log('Event retrieval not yet implemented with Firebase');
    return [];
  }

  joinEvent(eventId) {
    console.log('Event joining not yet implemented with Firebase');
    return false;
  }

  // Groups Management (placeholder for future implementation)
  createGroup(groupData) {
    console.log('Group creation not yet implemented with Firebase');
    return null;
  }

  getGroups() {
    console.log('Group retrieval not yet implemented with Firebase');
    return [];
  }

  joinGroup(groupId) {
    console.log('Group joining not yet implemented with Firebase');
    return false;
  }

  // Cleanup expired stories
  startCleanupInterval() {
    // Clean up expired stories every 5 minutes
    setInterval(async () => {
      try {
        await firebaseDB.cleanupExpiredStories();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Get story statistics
  getStoryStats(story) {
    if (!story) return { likes: 0, replies: 0, views: 0 };
    
    return {
      likes: story.likes?.length || 0,
      replies: story.replies?.length || 0,
      views: story.views?.length || 0
    };
  }

  // Check if current user liked a story
  hasUserLikedStory(story) {
    const userId = this.getCurrentUserId();
    if (!userId || !story?.likes) return false;
    return story.likes.includes(userId);
  }

  // Check if current user viewed a story
  hasUserViewedStory(story) {
    const userId = this.getCurrentUserId();
    if (!userId || !story?.views) return false;
    return story.views.includes(userId);
  }

  // Format story time (how long ago)
  formatStoryTime(story) {
    if (!story?.createdAt) return '';
    
    const now = new Date();
    const created = story.createdAt.toDate ? story.createdAt.toDate() : new Date(story.createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    return 'לפני יום';
  }

  // Calculate time until story expires
  getStoryTimeRemaining(story) {
    if (!story?.expiresAt) return 'פג תוקף';
    
    const now = new Date();
    const expires = story.expiresAt.toDate ? story.expiresAt.toDate() : new Date(story.expiresAt);
    const diffMs = expires - now;
    
    if (diffMs <= 0) return 'פג תוקף';
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} דקות`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} שעות`;
  }
}

// Create singleton instance
const socialSystem = new SocialFeaturesFirebase();
export default socialSystem;
