// PremiumSystem.js - Premium Features Management System

class PremiumSystem {
  constructor() {
    // Premium subscription tiers
    this.subscriptionTiers = {
      free: {
        id: 'free',
        name: 'חינם',
        price: 0,
        duration: 'לתמיד',
        features: {
          dailyLikes: 10,
          superLikes: 1,
          boosts: 0,
          seeWhoLikesYou: false,
          unlimitedMessages: false,
          advancedFilters: false,
          readReceipts: false,
          undoSwipes: false,
          invisibleMode: false,
          prioritySupport: false,
          adFree: false,
          photoVerificationBadge: false
        },
        color: '#6c757d'
      },
      basic: {
        id: 'basic',
        name: 'בייסיק',
        price: 29.90,
        duration: 'לחודש',
        originalPrice: 39.90,
        features: {
          dailyLikes: 50,
          superLikes: 5,
          boosts: 1,
          seeWhoLikesYou: true,
          unlimitedMessages: true,
          advancedFilters: true,
          readReceipts: false,
          undoSwipes: true,
          invisibleMode: false,
          prioritySupport: false,
          adFree: true,
          photoVerificationBadge: true
        },
        color: '#007bff',
        popular: false
      },
      premium: {
        id: 'premium',
        name: 'פרימיום',
        price: 49.90,
        duration: 'לחודש',
        originalPrice: 69.90,
        features: {
          dailyLikes: 100,
          superLikes: 10,
          boosts: 3,
          seeWhoLikesYou: true,
          unlimitedMessages: true,
          advancedFilters: true,
          readReceipts: true,
          undoSwipes: true,
          invisibleMode: true,
          prioritySupport: true,
          adFree: true,
          photoVerificationBadge: true
        },
        color: '#28a745',
        popular: true
      },
      vip: {
        id: 'vip',
        name: 'VIP',
        price: 79.90,
        duration: 'לחודש',
        originalPrice: 99.90,
        features: {
          dailyLikes: 'unlimited',
          superLikes: 20,
          boosts: 5,
          seeWhoLikesYou: true,
          unlimitedMessages: true,
          advancedFilters: true,
          readReceipts: true,
          undoSwipes: true,
          invisibleMode: true,
          prioritySupport: true,
          adFree: true,
          photoVerificationBadge: true,
          exclusiveFeatures: true,
          weeklyBoost: true,
          topProfileShowcase: true
        },
        color: '#ffc107',
        popular: false
      }
    };

    // Premium features descriptions
    this.featureDescriptions = {
      dailyLikes: 'מספר הלייקים הדזליים שלך',
      superLikes: 'סופר לייקים לחודש - בולטים יותר',
      boosts: 'הבלטת פרופיל לחודש - x10 יותר צפיות',
      seeWhoLikesYou: 'ראה מי עשה לך לייק לפני שתחליט',
      unlimitedMessages: 'הודעות ללא הגבלה לכל ההתאמות',
      advancedFilters: 'פילטרים מתקדמים לחיפוש מדויק',
      readReceipts: 'ראיית קריאת הודעות',
      undoSwipes: 'ביטול החלטות (undo) ללא הגבלה',
      invisibleMode: 'גלישה חשאית - רק מי שתלייק יראה אותך',
      prioritySupport: 'תמיכה בעדיפות גבוהה',
      adFree: 'חווית גלישה ללא פרסומות',
      photoVerificationBadge: 'תג אימות זהות כחול',
      exclusiveFeatures: 'גישה לפיצ\'רים בלעדיים',
      weeklyBoost: 'הבלטה אוטומטית כל שבוע',
      topProfileShowcase: 'הצגה ברשימת הפרופילים המובילים'
    };

    // Single purchase items
    this.singlePurchases = {
      superLikes_5: {
        id: 'superLikes_5',
        name: '5 סופר לייקים',
        price: 9.90,
        quantity: 5,
        type: 'superLikes',
        description: '5 סופר לייקים נוספים - בולטים פי 3 יותר!'
      },
      superLikes_15: {
        id: 'superLikes_15',
        name: '15 סופר לייקים',
        price: 24.90,
        quantity: 15,
        type: 'superLikes',
        description: '15 סופר לייקים - חסכון של 25%',
        popular: true
      },
      boost_1: {
        id: 'boost_1',
        name: 'הבלטה (30 דקות)',
        price: 14.90,
        quantity: 1,
        type: 'boost',
        description: 'הפרופיל שלך יוצג למעלה ל-30 דקות'
      },
      boost_3: {
        id: 'boost_3',
        name: '3 הבלטות',
        price: 39.90,
        quantity: 3,
        type: 'boost',
        description: '3 הבלטות - חסכון של 10%'
      },
      likes_50: {
        id: 'likes_50',
        name: '50 לייקים נוספים',
        price: 7.90,
        quantity: 50,
        type: 'likes',
        description: '50 לייקים נוספים להיום'
      }
    };

    // User premium status
    this.userPremiumData = this.loadUserPremiumData();
  }

  // Load user premium data from localStorage
  loadUserPremiumData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return {
      subscription: currentUser.subscription || 'free',
      subscriptionExpiry: currentUser.subscriptionExpiry || null,
      remainingLikes: currentUser.remainingLikes || this.subscriptionTiers.free.features.dailyLikes,
      remainingSuperLikes: currentUser.remainingSuperLikes || this.subscriptionTiers.free.features.superLikes,
      remainingBoosts: currentUser.remainingBoosts || 0,
      purchaseHistory: currentUser.purchaseHistory || [],
      lastDailyReset: currentUser.lastDailyReset || new Date().toDateString()
    };
  }

  // Save user premium data to localStorage
  saveUserPremiumData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.subscription = this.userPremiumData.subscription;
    currentUser.subscriptionExpiry = this.userPremiumData.subscriptionExpiry;
    currentUser.remainingLikes = this.userPremiumData.remainingLikes;
    currentUser.remainingSuperLikes = this.userPremiumData.remainingSuperLikes;
    currentUser.remainingBoosts = this.userPremiumData.remainingBoosts;
    currentUser.purchaseHistory = this.userPremiumData.purchaseHistory;
    currentUser.lastDailyReset = this.userPremiumData.lastDailyReset;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Check if user has premium subscription
  isPremium() {
    if (this.userPremiumData.subscription === 'free') return false;
    
    if (this.userPremiumData.subscriptionExpiry) {
      const expiryDate = new Date(this.userPremiumData.subscriptionExpiry);
      const now = new Date();
      
      if (now > expiryDate) {
        // Subscription expired, downgrade to free
        this.userPremiumData.subscription = 'free';
        this.userPremiumData.subscriptionExpiry = null;
        this.saveUserPremiumData();
        return false;
      }
    }
    
    return true;
  }

  // Get current subscription tier
  getCurrentTier() {
    return this.subscriptionTiers[this.userPremiumData.subscription] || this.subscriptionTiers.free;
  }

  // Check if user has specific feature
  hasFeature(featureName) {
    const currentTier = this.getCurrentTier();
    return currentTier.features[featureName] || false;
  }

  // Get remaining feature count
  getRemainingFeatureCount(featureName) {
    switch (featureName) {
      case 'likes':
        return this.userPremiumData.remainingLikes;
      case 'superLikes':
        return this.userPremiumData.remainingSuperLikes;
      case 'boosts':
        return this.userPremiumData.remainingBoosts;
      default:
        return 0;
    }
  }

  // Use a feature (decrement count)
  useFeature(featureName) {
    switch (featureName) {
      case 'like':
        if (this.userPremiumData.remainingLikes > 0) {
          this.userPremiumData.remainingLikes--;
          this.saveUserPremiumData();
          return true;
        }
        return false;
      
      case 'superLike':
        if (this.userPremiumData.remainingSuperLikes > 0) {
          this.userPremiumData.remainingSuperLikes--;
          this.saveUserPremiumData();
          return true;
        }
        return false;
      
      case 'boost':
        if (this.userPremiumData.remainingBoosts > 0) {
          this.userPremiumData.remainingBoosts--;
          this.saveUserPremiumData();
          return true;
        }
        return false;
      
      default:
        return false;
    }
  }

  // Reset daily limits
  resetDailyLimits() {
    const today = new Date().toDateString();
    
    if (this.userPremiumData.lastDailyReset !== today) {
      const currentTier = this.getCurrentTier();
      
      // Reset daily likes
      this.userPremiumData.remainingLikes = currentTier.features.dailyLikes === 'unlimited' 
        ? 999999 
        : currentTier.features.dailyLikes;
      
      // Reset super likes (if it's a new month)
      const lastReset = new Date(this.userPremiumData.lastDailyReset);
      const now = new Date();
      
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        this.userPremiumData.remainingSuperLikes = currentTier.features.superLikes === 'unlimited' 
          ? 999999 
          : currentTier.features.superLikes;
        
        this.userPremiumData.remainingBoosts = currentTier.features.boosts === 'unlimited' 
          ? 999999 
          : currentTier.features.boosts;
      }
      
      this.userPremiumData.lastDailyReset = today;
      this.saveUserPremiumData();
    }
  }

  // Purchase subscription
  purchaseSubscription(tierId, paymentMethod = 'creditCard') {
    const tier = this.subscriptionTiers[tierId];
    if (!tier) return { success: false, error: 'תוכנית לא קיימת' };

    // Simulate payment processing
    const paymentResult = this.processPayment(tier.price, paymentMethod);
    
    if (paymentResult.success) {
      // Update user subscription
      this.userPremiumData.subscription = tierId;
      
      // Set expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      this.userPremiumData.subscriptionExpiry = expiryDate.toISOString();
      
      // Reset feature counts based on new tier
      this.userPremiumData.remainingLikes = tier.features.dailyLikes === 'unlimited' ? 999999 : tier.features.dailyLikes;
      this.userPremiumData.remainingSuperLikes = tier.features.superLikes === 'unlimited' ? 999999 : tier.features.superLikes;
      this.userPremiumData.remainingBoosts = tier.features.boosts === 'unlimited' ? 999999 : tier.features.boosts;
      
      // Add to purchase history
      this.userPremiumData.purchaseHistory.push({
        id: Date.now(),
        type: 'subscription',
        item: tierId,
        price: tier.price,
        date: new Date().toISOString(),
        paymentMethod: paymentMethod
      });
      
      this.saveUserPremiumData();
      
      return {
        success: true,
        message: `מזל טוב! שדרגת ל${tier.name}`,
        tier: tier
      };
    } else {
      return {
        success: false,
        error: paymentResult.error
      };
    }
  }

  // Purchase single item
  purchaseSingleItem(itemId, paymentMethod = 'creditCard') {
    const item = this.singlePurchases[itemId];
    if (!item) return { success: false, error: 'פריט לא קיים' };

    // Simulate payment processing
    const paymentResult = this.processPayment(item.price, paymentMethod);
    
    if (paymentResult.success) {
      // Add items to user account
      switch (item.type) {
        case 'superLikes':
          this.userPremiumData.remainingSuperLikes += item.quantity;
          break;
        case 'boost':
          this.userPremiumData.remainingBoosts += item.quantity;
          break;
        case 'likes':
          this.userPremiumData.remainingLikes += item.quantity;
          break;
      }
      
      // Add to purchase history
      this.userPremiumData.purchaseHistory.push({
        id: Date.now(),
        type: 'single',
        item: itemId,
        price: item.price,
        quantity: item.quantity,
        date: new Date().toISOString(),
        paymentMethod: paymentMethod
      });
      
      this.saveUserPremiumData();
      
      return {
        success: true,
        message: `רכשת ${item.name} בהצלחה!`,
        item: item
      };
    } else {
      return {
        success: false,
        error: paymentResult.error
      };
    }
  }

  // Simulate payment processing
  processPayment(amount, method) {
    // In a real app, this would integrate with payment processors like Stripe, PayPal, etc.
    // For demo purposes, we'll simulate different outcomes
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve({
            success: true,
            transactionId: 'TXN_' + Date.now(),
            method: method,
            amount: amount
          });
        } else {
          resolve({
            success: false,
            error: 'תשלום נכשל, נסה שוב'
          });
        }
      }, 2000);
    });
  }

  // Activate boost
  activateBoost() {
    if (!this.useFeature('boost')) {
      return { success: false, error: 'אין לך הבלטות זמינות' };
    }
    
    // Set boost expiry (30 minutes from now)
    const boostExpiry = new Date();
    boostExpiry.setMinutes(boostExpiry.getMinutes() + 30);
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.boostExpiry = boostExpiry.toISOString();
    currentUser.isBoostActive = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return {
      success: true,
      message: 'הפרופיל שלך מוצג למעלה ל-30 דקות!',
      expiryTime: boostExpiry
    };
  }

  // Check if boost is active
  isBoostActive() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.boostExpiry || !currentUser.isBoostActive) return false;
    
    const boostExpiry = new Date(currentUser.boostExpiry);
    const now = new Date();
    
    if (now > boostExpiry) {
      // Boost expired
      currentUser.isBoostActive = false;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return false;
    }
    
    return true;
  }

  // Get subscription comparison data
  getSubscriptionComparison() {
    return Object.values(this.subscriptionTiers).map(tier => ({
      ...tier,
      isCurrentPlan: tier.id === this.userPremiumData.subscription
    }));
  }

  // Get purchase history
  getPurchaseHistory() {
    return this.userPremiumData.purchaseHistory.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  }

  // Cancel subscription
  cancelSubscription() {
    // In a real app, this would handle pro-rated refunds and cancellation
    this.userPremiumData.subscription = 'free';
    this.userPremiumData.subscriptionExpiry = null;
    
    // Reset to free tier limits
    const freeTier = this.subscriptionTiers.free;
    this.userPremiumData.remainingLikes = freeTier.features.dailyLikes;
    this.userPremiumData.remainingSuperLikes = freeTier.features.superLikes;
    this.userPremiumData.remainingBoosts = 0;
    
    this.saveUserPremiumData();
    
    return {
      success: true,
      message: 'המנוי בוטל בהצלחה'
    };
  }

  // Get premium statistics
  getStats() {
    const tier = this.getCurrentTier();
    const totalPurchases = this.userPremiumData.purchaseHistory.reduce((sum, purchase) => sum + purchase.price, 0);
    
    return {
      currentTier: tier.name,
      isPremium: this.isPremium(),
      remainingLikes: this.userPremiumData.remainingLikes,
      remainingSuperLikes: this.userPremiumData.remainingSuperLikes,
      remainingBoosts: this.userPremiumData.remainingBoosts,
      totalSpent: totalPurchases,
      subscriptionDaysLeft: this.getSubscriptionDaysLeft(),
      isBoostActive: this.isBoostActive()
    };
  }

  // Get days left in subscription
  getSubscriptionDaysLeft() {
    if (!this.userPremiumData.subscriptionExpiry) return 0;
    
    const expiry = new Date(this.userPremiumData.subscriptionExpiry);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  // Get promotional offers
  getPromotionalOffers() {
    const offers = [];
    
    // First time user offers
    if (this.userPremiumData.purchaseHistory.length === 0) {
      offers.push({
        id: 'first_time_50',
        title: 'הנחת לקוח חדש!',
        description: '50% הנחה על החודש הראשון',
        discount: 50,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        applicableTiers: ['basic', 'premium', 'vip']
      });
    }
    
    // Weekend special
    const now = new Date();
    if (now.getDay() === 5 || now.getDay() === 6) { // Friday or Saturday
      offers.push({
        id: 'weekend_special',
        title: 'מבצע סוף שבוע!',
        description: '30% הנחה על כל הרכישות',
        discount: 30,
        validUntil: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        applicableTiers: ['basic', 'premium']
      });
    }
    
    // Comeback offer for expired users
    if (this.userPremiumData.subscription === 'free' && this.userPremiumData.purchaseHistory.length > 0) {
      const lastPurchase = this.userPremiumData.purchaseHistory[this.userPremiumData.purchaseHistory.length - 1];
      const daysSinceLastPurchase = (Date.now() - new Date(lastPurchase.date)) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastPurchase > 7) {
        offers.push({
          id: 'comeback_offer',
          title: 'חזרנו אליך!',
          description: 'הנחה מיוחדת של 40% - רק בשבילך',
          discount: 40,
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          applicableTiers: ['premium', 'vip']
        });
      }
    }
    
    return offers.filter(offer => new Date() <= offer.validUntil);
  }

  // Apply promotional discount
  applyPromoDiscount(tierId, promoId) {
    const offers = this.getPromotionalOffers();
    const offer = offers.find(o => o.id === promoId);
    const tier = this.subscriptionTiers[tierId];
    
    if (!offer || !tier || !offer.applicableTiers.includes(tierId)) {
      return tier.price;
    }
    
    const discountAmount = (tier.price * offer.discount) / 100;
    return Math.max(0, tier.price - discountAmount);
  }
}

// Export the PremiumSystem class
export default PremiumSystem;

// Utility functions for external use
export const createPremiumSystem = () => new PremiumSystem();

export const checkPremiumFeature = (featureName) => {
  const premiumSystem = new PremiumSystem();
  return premiumSystem.hasFeature(featureName);
};

export const getPremiumStats = () => {
  const premiumSystem = new PremiumSystem();
  return premiumSystem.getStats();
};