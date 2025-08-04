// MatchingSystem.js - Advanced Matching Algorithm System

class MatchingSystem {
  constructor() {
    // Question categories and weights
    this.questionCategories = {
      lifestyle: { weight: 0.25, name: 'אורח חיים' },
      values: { weight: 0.30, name: 'ערכים' },
      personality: { weight: 0.20, name: 'אישיות' },
      relationship: { weight: 0.15, name: 'מערכות יחסים' },
      interests: { weight: 0.10, name: 'תחומי עניין' }
    };

    // Comprehensive question database
    this.questions = [
      // Lifestyle Questions
      {
        id: 1,
        category: 'lifestyle',
        question: 'איך אתה מעדיף לבלות בסוף השבוע?',
        options: [
          { id: 'a', text: 'בבית עם חברים קרובים', weight: 1 },
          { id: 'b', text: 'בחוץ במקומות חדשים', weight: 2 },
          { id: 'c', text: 'באירועים חברתיים גדולים', weight: 3 },
          { id: 'd', text: 'לבד עם תחביבים', weight: 0 }
        ]
      },
      {
        id: 2,
        category: 'lifestyle',
        question: 'מה הכי חשוב לך בעבודה?',
        options: [
          { id: 'a', text: 'יציבות כלכלית', weight: 1 },
          { id: 'b', text: 'הגשמה אישית', weight: 2 },
          { id: 'c', text: 'השפעה חברתית', weight: 3 },
          { id: 'd', text: 'איזון עבודה-חיים', weight: 0 }
        ]
      },
      {
        id: 3,
        category: 'lifestyle',
        question: 'איך אתה מתייחס לספורט ופעילות גופנית?',
        options: [
          { id: 'a', text: 'חלק חיוני מהחיים שלי', weight: 3 },
          { id: 'b', text: 'כיף מדי פעם', weight: 2 },
          { id: 'c', text: 'אני לא ממש ספורטיבי', weight: 1 },
          { id: 'd', text: 'אני שונא ספורט', weight: 0 }
        ]
      },
      {
        id: 4,
        category: 'lifestyle',
        question: 'מה הגישה שלך לכסף?',
        options: [
          { id: 'a', text: 'חוסך לעתיד', weight: 1 },
          { id: 'b', text: 'מאזן בין חיסכון והנאה', weight: 2 },
          { id: 'c', text: 'חי את היום', weight: 3 },
          { id: 'd', text: 'הכסף לא חשוב לי', weight: 0 }
        ]
      },

      // Values Questions
      {
        id: 5,
        category: 'values',
        question: 'מה הכי חשוב לך במערכת יחסים?',
        options: [
          { id: 'a', text: 'כנות ואמון', weight: 3 },
          { id: 'b', text: 'תשוקה ורומנטיקה', weight: 2 },
          { id: 'c', text: 'יציבות ובטחון', weight: 1 },
          { id: 'd', text: 'חופש אישי', weight: 0 }
        ]
      },
      {
        id: 6,
        category: 'values',
        question: 'איך אתה מתייחס לדת ורוחניות?',
        options: [
          { id: 'a', text: 'חלק מרכזי בחיי', weight: 3 },
          { id: 'b', text: 'חשוב אבל לא דומיננטי', weight: 2 },
          { id: 'c', text: 'מכבד אבל לא מאמין', weight: 1 },
          { id: 'd', text: 'לא רלוונטי בעיני', weight: 0 }
        ]
      },
      {
        id: 7,
        category: 'values',
        question: 'מה הגישה שלך לפוליטיקה?',
        options: [
          { id: 'a', text: 'ימני/שמרני', weight: 1 },
          { id: 'b', text: 'מרכז', weight: 2 },
          { id: 'c', text: 'שמאלי/ליברלי', weight: 3 },
          { id: 'd', text: 'לא מתעניין בפוליטיקה', weight: 0 }
        ]
      },
      {
        id: 8,
        category: 'values',
        question: 'איך אתה מתייחס לסביבה ולטבע?',
        options: [
          { id: 'a', text: 'אקטיביסט סביבתי', weight: 3 },
          { id: 'b', text: 'מודע ומשתדל לעזור', weight: 2 },
          { id: 'c', text: 'חושב שזה חשוב אבל לא פועל', weight: 1 },
          { id: 'd', text: 'לא ממש מעסיק אותי', weight: 0 }
        ]
      },

      // Personality Questions
      {
        id: 9,
        category: 'personality',
        question: 'איך אתה בחברה?',
        options: [
          { id: 'a', text: 'אני האיש של המסיבה', weight: 3 },
          { id: 'b', text: 'אוהב לפגוש אנשים חדשים', weight: 2 },
          { id: 'c', text: 'מעדיף קבוצות קטנות', weight: 1 },
          { id: 'd', text: 'אינטרוברט מובהק', weight: 0 }
        ]
      },
      {
        id: 10,
        category: 'personality',
        question: 'איך אתה מתמודד עם לחץ?',
        options: [
          { id: 'a', text: 'אני פורח תחת לחץ', weight: 3 },
          { id: 'b', text: 'מתמודד טוב בדרך כלל', weight: 2 },
          { id: 'c', text: 'צריך זמן להתארגן', weight: 1 },
          { id: 'd', text: 'הלחץ משתק אותי', weight: 0 }
        ]
      },
      {
        id: 11,
        category: 'personality',
        question: 'מה הגישה שלך לסיכונים?',
        options: [
          { id: 'a', text: 'חיים הם הרפתקה!', weight: 3 },
          { id: 'b', text: 'מוכן לנסות דברים חדשים', weight: 2 },
          { id: 'c', text: 'זהיר אבל פתוח', weight: 1 },
          { id: 'd', text: 'מעדיף הבטוח', weight: 0 }
        ]
      },
      {
        id: 12,
        category: 'personality',
        question: 'איך אתה מביע רגשות?',
        options: [
          { id: 'a', text: 'אני ספונטני ופתוח', weight: 3 },
          { id: 'b', text: 'מביע אבל בזהירות', weight: 2 },
          { id: 'c', text: 'צריך זמן להיפתח', weight: 1 },
          { id: 'd', text: 'שומר הכל בפנים', weight: 0 }
        ]
      },

      // Relationship Questions
      {
        id: 13,
        category: 'relationship',
        question: 'כמה זמן אתה צריך לבד?',
        options: [
          { id: 'a', text: 'אני צריך המון זמן אישי', weight: 0 },
          { id: 'b', text: 'כמה שעות ביום', weight: 1 },
          { id: 'c', text: 'אוהב לבלות עם בן/בת הזוג', weight: 2 },
          { id: 'd', text: 'ככל האפשר ביחד', weight: 3 }
        ]
      },
      {
        id: 14,
        category: 'relationship',
        question: 'איך אתה מתייחס לקנאה?',
        options: [
          { id: 'a', text: 'קנאה היא רעל', weight: 3 },
          { id: 'b', text: 'קצת קנאה זה נורמלי', weight: 2 },
          { id: 'c', text: 'אני די קנאי', weight: 1 },
          { id: 'd', text: 'אני מאוד קנאי', weight: 0 }
        ]
      },
      {
        id: 15,
        category: 'relationship',
        question: 'מה הגישה שלך למשפחה?',
        options: [
          { id: 'a', text: 'המשפחה הכי חשובה לי', weight: 3 },
          { id: 'b', text: 'אוהב אבל צריך גבולות', weight: 2 },
          { id: 'c', text: 'מערכת יחסים מורכבת', weight: 1 },
          { id: 'd', text: 'מנותק מהמשפחה', weight: 0 }
        ]
      },
      {
        id: 16,
        category: 'relationship',
        question: 'איך אתה רואה את העתיד?',
        options: [
          { id: 'a', text: 'חתונה וילדים בקרוב', weight: 3 },
          { id: 'b', text: 'רוצה משפחה אבל לא ממהר', weight: 2 },
          { id: 'c', text: 'עדיין לא בטוח', weight: 1 },
          { id: 'd', text: 'לא רוצה התחייבויות', weight: 0 }
        ]
      },

      // Interest Questions
      {
        id: 17,
        category: 'interests',
        question: 'מה אתה הכי אוהב לעשות בזמן פנוי?',
        options: [
          { id: 'a', text: 'קריאה ולמידה', weight: 1 },
          { id: 'b', text: 'יצירה ואמנות', weight: 2 },
          { id: 'c', text: 'ספורט ופעילות', weight: 3 },
          { id: 'd', text: 'סדרות ופילמים', weight: 0 }
        ]
      },
      {
        id: 18,
        category: 'interests',
        question: 'איך אתה אוהב לטייל?',
        options: [
          { id: 'a', text: 'הרפתקאות בטבע', weight: 3 },
          { id: 'b', text: 'ערים ותרבות', weight: 2 },
          { id: 'c', text: 'חופשות רגועות', weight: 1 },
          { id: 'd', text: 'אני לא אוהב לטייל', weight: 0 }
        ]
      },
      {
        id: 19,
        category: 'interests',
        question: 'מה הקשר שלך למוזיקה?',
        options: [
          { id: 'a', text: 'אני מוזיקאי/אוהב מוזיקה', weight: 3 },
          { id: 'b', text: 'שומע המון מוזיקה', weight: 2 },
          { id: 'c', text: 'אוהב אבל לא מומחה', weight: 1 },
          { id: 'd', text: 'מוזיקה לא חשובה לי', weight: 0 }
        ]
      },
      {
        id: 20,
        category: 'interests',
        question: 'איך אתה מתייחס לטכנולוגיה?',
        options: [
          { id: 'a', text: 'אני טכנולוג מובהק', weight: 3 },
          { id: 'b', text: 'אוהב להכיר חדשנות', weight: 2 },
          { id: 'c', text: 'משתמש בסיסי', weight: 1 },
          { id: 'd', text: 'מעדיף הישן והטוב', weight: 0 }
        ]
      },

      // Additional questions for better matching...
      {
        id: 21,
        category: 'lifestyle',
        question: 'מה הרגלי השינה שלך?',
        options: [
          { id: 'a', text: 'בוקרן מובהק', weight: 1 },
          { id: 'b', text: 'נורמלי (22:00-07:00)', weight: 2 },
          { id: 'c', text: 'ינשוף לילי', weight: 3 },
          { id: 'd', text: 'לא קבוע', weight: 0 }
        ]
      },
      {
        id: 22,
        category: 'values',
        question: 'איך אתה מתייחס לחיות מחמד?',
        options: [
          { id: 'a', text: 'חיים בלי חיות? בלתי אפשרי!', weight: 3 },
          { id: 'b', text: 'אוהב חיות', weight: 2 },
          { id: 'c', text: 'אדיש', weight: 1 },
          { id: 'd', text: 'לא אוהב חיות', weight: 0 }
        ]
      },
      {
        id: 23,
        category: 'personality',
        question: 'איך אתה מקבל החלטות?',
        options: [
          { id: 'a', text: 'באינטואיציה', weight: 3 },
          { id: 'b', text: 'משלב הגיון ורגש', weight: 2 },
          { id: 'c', text: 'מאוד הגיוני', weight: 1 },
          { id: 'd', text: 'קשה לי להחליט', weight: 0 }
        ]
      },
      {
        id: 24,
        category: 'relationship',
        question: 'איך אתה מטפל בקונפליקטים?',
        options: [
          { id: 'a', text: 'פותר מיד בשיחה פתוחה', weight: 3 },
          { id: 'b', text: 'צריך זמן לחשוב ואז מדבר', weight: 2 },
          { id: 'c', text: 'נוטה להימנע מעימותים', weight: 1 },
          { id: 'd', text: 'נסגר לגמרי', weight: 0 }
        ]
      },
      {
        id: 25,
        category: 'interests',
        question: 'מה הגישה שלך לאוכל?',
        options: [
          { id: 'a', text: 'פודי מובהק - אוהב לנסות', weight: 3 },
          { id: 'b', text: 'אוהב אוכל טוב', weight: 2 },
          { id: 'c', text: 'אוכל כדי לחיות', weight: 1 },
          { id: 'd', text: 'די קפדן באוכל', weight: 0 }
        ]
      }
    ];

    // User answers storage
    this.userAnswers = this.loadUserAnswers();
  }

  // Load user answers from localStorage
  loadUserAnswers() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.questionAnswers || {};
  }

  // Save user answers to localStorage
  saveUserAnswers() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.questionAnswers = this.userAnswers;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Answer a question
  answerQuestion(questionId, optionId, importance = 'medium') {
    this.userAnswers[questionId] = {
      answer: optionId,
      importance: importance,
      timestamp: new Date().toISOString()
    };
    this.saveUserAnswers();
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    return this.questions.filter(q => q.category === category);
  }

  // Get unanswered questions
  getUnansweredQuestions(limit = 10) {
    const answeredIds = Object.keys(this.userAnswers).map(id => parseInt(id));
    const unanswered = this.questions.filter(q => !answeredIds.includes(q.id));
    
    // Prioritize important categories
    const prioritized = unanswered.sort((a, b) => {
      const weightA = this.questionCategories[a.category].weight;
      const weightB = this.questionCategories[b.category].weight;
      return weightB - weightA;
    });
    
    return prioritized.slice(0, limit);
  }

  // Calculate compatibility between two users
  calculateCompatibility(userAnswers, otherUserAnswers) {
    if (!userAnswers || !otherUserAnswers) return 0;
    
    let totalWeight = 0;
    let matchingWeight = 0;
    
    // Find common questions both users answered
    const commonQuestions = Object.keys(userAnswers).filter(qId => 
      otherUserAnswers.hasOwnProperty(qId)
    );
    
    if (commonQuestions.length === 0) return 0;
    
    commonQuestions.forEach(questionId => {
      const question = this.questions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const userAnswer = userAnswers[questionId];
      const otherAnswer = otherUserAnswers[questionId];
      
      // Get category weight
      const categoryWeight = this.questionCategories[question.category].weight;
      
      // Get importance multiplier
      const importanceMultiplier = this.getImportanceMultiplier(userAnswer.importance);
      
      // Calculate question weight
      const questionWeight = categoryWeight * importanceMultiplier;
      totalWeight += questionWeight;
      
      // Check if answers are compatible
      const compatibility = this.getAnswerCompatibility(
        question, 
        userAnswer.answer, 
        otherAnswer.answer
      );
      
      matchingWeight += questionWeight * compatibility;
    });
    
    // Calculate final percentage
    return totalWeight > 0 ? Math.round((matchingWeight / totalWeight) * 100) : 0;
  }

  // Get importance multiplier
  getImportanceMultiplier(importance) {
    switch (importance) {
      case 'low': return 0.5;
      case 'medium': return 1.0;
      case 'high': return 1.5;
      case 'critical': return 2.0;
      default: return 1.0;
    }
  }

  // Calculate answer compatibility
  getAnswerCompatibility(question, userAnswer, otherAnswer) {
    // Exact match = 100% compatibility
    if (userAnswer === otherAnswer) return 1.0;
    
    // Get option weights
    const userOption = question.options.find(opt => opt.id === userAnswer);
    const otherOption = question.options.find(opt => opt.id === otherAnswer);
    
    if (!userOption || !otherOption) return 0;
    
    // Calculate compatibility based on weight difference
    const weightDiff = Math.abs(userOption.weight - otherOption.weight);
    const maxDiff = Math.max(...question.options.map(opt => opt.weight)) - 
                   Math.min(...question.options.map(opt => opt.weight));
    
    if (maxDiff === 0) return 1.0;
    
    // Convert weight difference to compatibility score
    return Math.max(0, 1 - (weightDiff / maxDiff));
  }

  // Get match suggestions for current user
  getMatchSuggestions(allUsers, limit = 20) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) return [];
    
    const suggestions = allUsers
      .filter(user => user.id !== currentUser.id)
      .map(user => {
        const compatibility = this.calculateCompatibility(
          this.userAnswers,
          user.questionAnswers || {}
        );
        
        return {
          ...user,
          matchPercentage: compatibility,
          commonAnswers: this.getCommonAnswers(this.userAnswers, user.questionAnswers || {}),
          dealBreakers: this.checkDealBreakers(this.userAnswers, user.questionAnswers || {})
        };
      })
      .filter(user => user.matchPercentage > 0) // Only users with some compatibility
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, limit);
    
    return suggestions;
  }

  // Get common answers between users
  getCommonAnswers(userAnswers, otherAnswers) {
    const common = [];
    
    Object.keys(userAnswers).forEach(questionId => {
      if (otherAnswers[questionId] && 
          userAnswers[questionId].answer === otherAnswers[questionId].answer) {
        const question = this.questions.find(q => q.id === parseInt(questionId));
        if (question) {
          common.push({
            question: question.question,
            answer: question.options.find(opt => opt.id === userAnswers[questionId].answer)?.text
          });
        }
      }
    });
    
    return common;
  }

  // Check for deal breakers
  checkDealBreakers(userAnswers, otherAnswers) {
    const dealBreakers = [];
    
    Object.keys(userAnswers).forEach(questionId => {
      const userAnswer = userAnswers[questionId];
      
      // Only check critical importance questions
      if (userAnswer.importance === 'critical' && otherAnswers[questionId]) {
        const question = this.questions.find(q => q.id === parseInt(questionId));
        if (question && userAnswer.answer !== otherAnswers[questionId].answer) {
          dealBreakers.push({
            question: question.question,
            userAnswer: question.options.find(opt => opt.id === userAnswer.answer)?.text,
            otherAnswer: question.options.find(opt => opt.id === otherAnswers[questionId].answer)?.text
          });
        }
      }
    });
    
    return dealBreakers;
  }

  // Get user's answer statistics
  getUserStats() {
    const totalQuestions = this.questions.length;
    const answeredQuestions = Object.keys(this.userAnswers).length;
    const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    // Category breakdown
    const categoryStats = {};
    Object.keys(this.questionCategories).forEach(category => {
      const categoryQuestions = this.getQuestionsByCategory(category);
      const answeredInCategory = categoryQuestions.filter(q => 
        this.userAnswers.hasOwnProperty(q.id)
      ).length;
      
      categoryStats[category] = {
        total: categoryQuestions.length,
        answered: answeredInCategory,
        percentage: Math.round((answeredInCategory / categoryQuestions.length) * 100)
      };
    });
    
    return {
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      categoryStats
    };
  }

  // Get personality insights based on answers
  getPersonalityInsights() {
    const insights = {
      traits: [],
      strengths: [],
      preferences: {}
    };
    
    // Analyze answers to determine personality traits
    const categoryScores = {};
    
    Object.keys(this.userAnswers).forEach(questionId => {
      const question = this.questions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const answer = this.userAnswers[questionId];
      const option = question.options.find(opt => opt.id === answer.answer);
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, count: 0 };
      }
      
      categoryScores[question.category].total += option.weight;
      categoryScores[question.category].count += 1;
    });
    
    // Generate insights based on scores
    Object.keys(categoryScores).forEach(category => {
      const avgScore = categoryScores[category].total / categoryScores[category].count;
      const categoryName = this.questionCategories[category].name;
      
      if (avgScore >= 2.5) {
        insights.traits.push(`${categoryName}: פעיל ופתוח`);
      } else if (avgScore >= 1.5) {
        insights.traits.push(`${categoryName}: מאוזן`);
      } else {
        insights.traits.push(`${categoryName}: זהיר ומסורתי`);
      }
    });
    
    return insights;
  }

  // Reset all answers (useful for testing)
  resetAnswers() {
    this.userAnswers = {};
    this.saveUserAnswers();
  }
}

// Export the MatchingSystem class
export default MatchingSystem;

// Utility functions
export const createMatchingSystem = () => new MatchingSystem();

export const calculateUserCompatibility = (user1Answers, user2Answers) => {
  const matchingSystem = new MatchingSystem();
  return matchingSystem.calculateCompatibility(user1Answers, user2Answers);
};