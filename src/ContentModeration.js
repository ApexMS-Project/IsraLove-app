// ContentModeration.js - Automatic Content Moderation System

class ContentModeration {
  constructor() {
    // Inappropriate words related to religion, nationality, and offensive content
    this.bannedWords = [
      // Religious offensive terms
      'גוי', 'שווארצע', 'ערבוש', 'ישמעאלי', 'צלבן', 'כופר', 'נוצרי זבל',
      'מוסלמי זבל', 'יהודי זבל', 'חרדי זבל', 'דתי זבל', 'חילוני זבל',
      
      // Nationality/ethnic offensive terms
      'מזרחי זבל', 'אשכנזי זבל', 'רוסי זבל', 'אתיופי זבל', 'תימני זבל',
      'ערבי זבל', 'פלסטיני זבל', 'עולה זבל', 'קושי', 'פלסטינאי',
      
      // General offensive/inappropriate terms
      'זונה', 'כלבה', 'שרמוטה', 'זין', 'כוס', 'תחפור', 'לך תמות',
      'בן זונה', 'בת זונה', 'חתיכת זבל', 'חרא', 'חתיכת חרא',
      'פיצוץ', 'טרור', 'פיגוע', 'רצח', 'להרוג', 'לחסל',
      
      // Sexual/inappropriate content
      'סקס', 'מין', 'אונס', 'זיון', 'מציצה', 'ליקוק', 'אורגזמה',
      'פורנו', 'xxx', 'סקסי בטירוף', 'חם במיטה', 'נוטף', 'רטוב',
      
      // Drugs and illegal activities
      'סמים', 'קוקאין', 'הרואין', 'גראס', 'חשיש', 'אקסטזי', 'LSD',
      'סמוקי', 'כסף מזומן', 'רק נוכלים', 'הונאה', 'גניבה',
      
      // Extremist/violent content
      'נאצי', 'היטלר', 'הולוקוסט זיוף', 'גזים', 'כבשו', 'תחסלו',
      'מוות לערבים', 'מוות ליהודים', 'כל הערבים', 'כל היהודים',
      
      // Inappropriate requests/offers
      'זקוקה למין', 'מחפש מין', 'אוהב בסקס', 'רק למין', 'חד פעמי',
      'תמורת כסף', 'נשים בתשלום', 'גברים בתשלום', 'זימה',
      
      // Commercial/spam content
      'קנה עכשיו', 'הנחה מיוחדת', 'חינם לגמרי', 'הזדמנות יחידה',
      'עושר מהיר', 'כסף קל', 'עבודה מהבית', 'השקעה', 'ביטקוין'
    ];

    // Suspicious patterns that might indicate inappropriate content
    this.suspiciousPatterns = [
      /\b\d{10,}\b/, // Long numbers (might be phone/ID)
      /(?:www\.|http|\.com|\.co\.il)/i, // URLs
      /telegram|whatsapp|viber|signal/i, // Messaging apps
      /\$\d+|\d+\$|\d+₪/i, // Money symbols
      /\b(?:cash|money|pay|payment)\b/i, // Payment terms
      /\b(?:drug|weed|cocaine|pills)\b/i, // Drug references
      /\b(?:escort|massage|discrete|discreet)\b/i, // Escort services
      /\b(?:nazi|hitler|holocaust)\b/i, // Extremist content
      /[A-Z]{5,}/, // All caps words (shouting)
      /(.)\1{4,}/, // Repeated characters (aaaaa)
      /\b\d{3}-?\d{3}-?\d{4}\b/, // Phone numbers
    ];

    // Inappropriate photo indicators (simplified detection)
    this.inappropriateImageIndicators = [
      'data:image', // Check if it's a data URL
      'blob:', // Blob URL
    ];
  }

  // Main text moderation function
  moderateText(text) {
    if (!text || typeof text !== 'string') {
      return {
        isAppropriate: true,
        reason: null,
        cleanedText: text
      };
    }

    const lowerText = text.toLowerCase().trim();
    
    // Check for banned words
    for (const word of this.bannedWords) {
      if (lowerText.includes(word.toLowerCase())) {
        return {
          isAppropriate: false,
          reason: 'תוכן לא הולם - מילים פוגעניות',
          cleanedText: this.cleanText(text),
        };
      }
    }

    // Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(text)) {
        return {
          isAppropriate: false,
          reason: 'תוכן חשוד - דפוס לא מתאים',
          cleanedText: this.cleanText(text),
        };
      }
    }

    // Check for excessive special characters or numbers
    const specialCharCount = (text.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    const numberCount = (text.match(/\d/g) || []).length;
    
    if (specialCharCount > text.length * 0.3) {
      return {
        isAppropriate: false,
        reason: 'יותר מדי תווים מיוחדים',
        cleanedText: this.cleanText(text),
      };
    }

    if (numberCount > text.length * 0.4) {
      return {
        isAppropriate: false,
        reason: 'יותר מדי מספרים - יכול להיות ספאם',
        cleanedText: this.cleanText(text),
      };
    }

    // Check for religious/political extremism patterns
    if (this.containsExtremistContent(text)) {
      return {
        isAppropriate: false,
        reason: 'תוכן קיצוני או פוגעני',
        cleanedText: this.cleanText(text),
      };
    }

    return {
      isAppropriate: true,
      reason: null,
      cleanedText: text
    };
  }

  // Check for extremist content patterns
  containsExtremistContent(text) {
    const extremistPatterns = [
      /מוות\s+ל[א-ת]+/i, // "Death to [group]"
      /כל\s+ה[א-ת]+\s+(?:צריכים|חייבים|זה)/i, // "All [group] should/must"
      /[א-ת]+\s+(?:מסריחים|זבל|לא\s+שווים)/i, // Dehumanizing language
      /(?:גזים|שואה|נאצים)/i, // Holocaust references
      /(?:ביטחון|פיגוע|טרור).*(?:ערבים|יהודים|פלסטינים)/i, // Security + ethnic terms
    ];

    return extremistPatterns.some(pattern => pattern.test(text));
  }

  // Clean inappropriate text by replacing banned words
  cleanText(text) {
    let cleanedText = text;
    
    for (const word of this.bannedWords) {
      const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanedText = cleanedText.replace(regex, '*'.repeat(word.length));
    }

    // Clean suspicious patterns
    cleanedText = cleanedText.replace(/\b\d{10,}\b/g, '***'); // Long numbers
    cleanedText = cleanedText.replace(/(?:www\.|http|\.com|\.co\.il)/gi, '***'); // URLs
    cleanedText = cleanedText.replace(/\b\d{3}-?\d{3}-?\d{4}\b/g, '***-***-****'); // Phone numbers
    
    return cleanedText;
  }

  // Image moderation function
  moderateImage(imageFile, imageDataUrl) {
    return new Promise((resolve) => {
      try {
        // Basic file type check
        if (!imageFile.type.startsWith('image/')) {
          resolve({
            isAppropriate: false,
            reason: 'קובץ חייב להיות תמונה',
          });
          return;
        }

        // File size check (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageFile.size > maxSize) {
          resolve({
            isAppropriate: false,
            reason: 'תמונה גדולה מדי - מקסימום 5MB',
          });
          return;
        }

        // Check for inappropriate file names
        const inappropriateNames = [
          'nude', 'naked', 'sex', 'porn', 'xxx', 'adult',
          'ערום', 'חשוף', 'סקס', 'פורנו'
        ];
        
        const fileName = imageFile.name.toLowerCase();
        for (const term of inappropriateNames) {
          if (fileName.includes(term)) {
            resolve({
              isAppropriate: false,
              reason: 'שם קובץ לא הולם',
            });
            return;
          }
        }

        // Basic image analysis
        this.analyzeImageContent(imageDataUrl)
          .then((analysis) => {
            resolve(analysis);
          })
          .catch(() => {
            // If analysis fails, allow the image but with a warning
            resolve({
              isAppropriate: true,
              reason: null,
              warning: 'לא ניתן היה לנתח את התמונה - ודא שהיא הולמת'
            });
          });

      } catch (error) {
        resolve({
          isAppropriate: false,
          reason: 'שגיאה בעיבוד התמונה',
        });
      }
    });
  }

  // Basic image content analysis
  analyzeImageContent(imageDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        try {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Simple analysis - check for predominantly skin color
          const analysis = this.analyzePixels(imageData);
          
          if (analysis.skinTonePercentage > 70) {
            resolve({
              isAppropriate: false,
              reason: 'התמונה עלולה להכיל תוכן לא הולם',
            });
          } else if (analysis.skinTonePercentage > 50) {
            resolve({
              isAppropriate: true,
              reason: null,
              warning: 'ודא שהתמונה הולמת ומכבדת'
            });
          } else {
            resolve({
              isAppropriate: true,
              reason: null,
            });
          }
        } catch (error) {
          // If we can't analyze, allow but warn
          resolve({
            isAppropriate: true,
            reason: null,
            warning: 'לא ניתן היה לנתח את התמונה'
          });
        }
      };
      
      img.onerror = () => {
        resolve({
          isAppropriate: false,
          reason: 'תמונה פגומה או לא תקינה',
        });
      };
      
      img.src = imageDataUrl;
    });
  }

  // Analyze pixels for skin tone detection (simplified)
  analyzePixels(imageData) {
    const pixels = imageData.data;
    let skinPixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Simple skin tone detection
      if (this.isSkinTone(r, g, b)) {
        skinPixels++;
      }
      totalPixels++;
    }
    
    return {
      skinTonePercentage: (skinPixels / totalPixels) * 100,
      totalPixels: totalPixels
    };
  }

  // Basic skin tone detection
  isSkinTone(r, g, b) {
    // Very basic skin tone detection - can be improved
    return (
      r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      r - g > 15 &&
      Math.abs(r - g) > 15
    ) || (
      r > 220 && g > 210 && b > 170 &&
      Math.abs(r - g) <= 15 &&
      r > b && g > b
    );
  }

  // Moderate user profile data
  moderateProfile(profileData) {
    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      cleanedData: { ...profileData }
    };

    // Check first name
    if (profileData.firstName) {
      const nameCheck = this.moderateText(profileData.firstName);
      if (!nameCheck.isAppropriate) {
        results.errors.push(`שם פרטי: ${nameCheck.reason}`);
        results.isValid = false;
      }
      results.cleanedData.firstName = nameCheck.cleanedText;
    }

    // Check last name
    if (profileData.lastName) {
      const nameCheck = this.moderateText(profileData.lastName);
      if (!nameCheck.isAppropriate) {
        results.errors.push(`שם משפחה: ${nameCheck.reason}`);
        results.isValid = false;
      }
      results.cleanedData.lastName = nameCheck.cleanedText;
    }

    // Check bio
    if (profileData.bio) {
      const bioCheck = this.moderateText(profileData.bio);
      if (!bioCheck.isAppropriate) {
        results.errors.push(`תיאור אישי: ${bioCheck.reason}`);
        results.isValid = false;
      }
      results.cleanedData.bio = bioCheck.cleanedText;
    }

    // Check interests
    if (profileData.interests && Array.isArray(profileData.interests)) {
      const cleanedInterests = [];
      for (const interest of profileData.interests) {
        const interestCheck = this.moderateText(interest);
        if (!interestCheck.isAppropriate) {
          results.warnings.push(`תחום עניין "${interest}" הוסר: ${interestCheck.reason}`);
        } else {
          cleanedInterests.push(interestCheck.cleanedText);
        }
      }
      results.cleanedData.interests = cleanedInterests;
    }

    return results;
  }

  // Moderate chat messages
  moderateMessage(message) {
    const messageCheck = this.moderateText(message);
    
    return {
      canSend: messageCheck.isAppropriate,
      reason: messageCheck.reason,
      cleanedMessage: messageCheck.cleanedText,
      originalMessage: message
    };
  }

  // Get content moderation statistics
  getModerationStats() {
    return {
      totalBannedWords: this.bannedWords.length,
      totalPatterns: this.suspiciousPatterns.length,
      categories: {
        religious: this.bannedWords.filter(w => 
          ['גוי', 'ערבוש', 'ישמעאלי', 'צלבן', 'כופר'].includes(w)
        ).length,
        ethnic: this.bannedWords.filter(w => 
          w.includes('זבל') || ['קושי', 'פלסטינאי'].includes(w)
        ).length,
        offensive: this.bannedWords.filter(w => 
          ['זונה', 'כלבה', 'שרמוטה', 'זין', 'כוס'].includes(w)
        ).length,
        sexual: this.bannedWords.filter(w => 
          ['סקס', 'מין', 'אונס', 'זיון', 'פורנו'].includes(w)
        ).length
      }
    };
  }

  // Check if content needs human review
  needsHumanReview(text) {
    const borderlinePhrases = [
      'אני לא גזען אבל',
      'יש לי חברים [אתניות] אבל',
      'זה לא נגד [קבוצה] זה רק',
      'אני לא נגד [דת] אבל',
    ];

    return borderlinePhrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    );
  }
}

// Export the ContentModeration class
export default ContentModeration;

// Utility functions for external use
export const createModerator = () => new ContentModeration();

export const quickTextCheck = (text) => {
  const moderator = new ContentModeration();
  return moderator.moderateText(text);
};

export const quickImageCheck = (imageFile, imageDataUrl) => {
  const moderator = new ContentModeration();
  return moderator.moderateImage(imageFile, imageDataUrl);
};