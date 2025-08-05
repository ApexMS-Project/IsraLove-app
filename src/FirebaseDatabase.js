import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebaseConfig';

class FirebaseDatabase {
  constructor() {
    this.unsubscribeFunctions = new Map();
  }

  // User Management
  async createUser(userData) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...userData };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  subscribeToUser(userId, callback) {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
    
    this.unsubscribeFunctions.set(`user_${userId}`, unsubscribe);
    return unsubscribe;
  }

  // Photo Management
  async uploadPhoto(file, userId, type = 'profile') {
    try {
      const fileName = `${type}/${userId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        id: snapshot.ref.name,
        url: downloadURL,
        path: fileName
      };
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  // Story Management
  async createStory(storyData) {
    try {
      const docRef = await addDoc(collection(db, 'stories'), {
        ...storyData,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        likes: [],
        replies: [],
        views: []
      });
      return { id: docRef.id, ...storyData };
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async getStories() {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'stories'),
        where('expiresAt', '>', now),
        orderBy('expiresAt'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting stories:', error);
      throw error;
    }
  }

  async likeStory(storyId, userId) {
    try {
      const storyRef = doc(db, 'stories', storyId);
      const storySnap = await getDoc(storyRef);
      
      if (storySnap.exists()) {
        const story = storySnap.data();
        const likes = story.likes || [];
        
        if (likes.includes(userId)) {
          // Remove like
          const updatedLikes = likes.filter(id => id !== userId);
          await updateDoc(storyRef, { likes: updatedLikes });
          return { liked: false, totalLikes: updatedLikes.length };
        } else {
          // Add like
          const updatedLikes = [...likes, userId];
          await updateDoc(storyRef, { likes: updatedLikes });
          return { liked: true, totalLikes: updatedLikes.length };
        }
      }
      throw new Error('Story not found');
    } catch (error) {
      console.error('Error liking story:', error);
      throw error;
    }
  }

  async replyToStory(storyId, userId, replyText) {
    try {
      const storyRef = doc(db, 'stories', storyId);
      const storySnap = await getDoc(storyRef);
      
      if (storySnap.exists()) {
        const story = storySnap.data();
        const replies = story.replies || [];
        
        const newReply = {
          id: Date.now().toString(),
          userId,
          text: replyText,
          timestamp: new Date()
        };
        
        const updatedReplies = [...replies, newReply];
        await updateDoc(storyRef, { replies: updatedReplies });
        return newReply;
      }
      throw new Error('Story not found');
    } catch (error) {
      console.error('Error replying to story:', error);
      throw error;
    }
  }

  async viewStory(storyId, userId) {
    try {
      const storyRef = doc(db, 'stories', storyId);
      const storySnap = await getDoc(storyRef);
      
      if (storySnap.exists()) {
        const story = storySnap.data();
        const views = story.views || [];
        
        if (!views.includes(userId)) {
          const updatedViews = [...views, userId];
          await updateDoc(storyRef, { views: updatedViews });
          return { viewed: true, totalViews: updatedViews.length };
        }
        return { viewed: false, totalViews: views.length };
      }
      throw new Error('Story not found');
    } catch (error) {
      console.error('Error viewing story:', error);
      throw error;
    }
  }

  async checkUserStoryLimit(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const q = query(
        collection(db, 'stories'),
        where('userId', '==', userId),
        where('createdAt', '>=', today),
        where('createdAt', '<', tomorrow)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size < 1; // Allow 1 story per day
    } catch (error) {
      console.error('Error checking story limit:', error);
      return false;
    }
  }

  // Cleanup expired stories
  async cleanupExpiredStories() {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'stories'),
        where('expiresAt', '<=', now)
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`Cleaned up ${querySnapshot.size} expired stories`);
    } catch (error) {
      console.error('Error cleaning up expired stories:', error);
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.unsubscribeFunctions.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.unsubscribeFunctions.clear();
  }
}

// Create singleton instance
const firebaseDB = new FirebaseDatabase();
export default firebaseDB;
