import React, { useState, useEffect } from 'react';
import MatchingSystem from './MatchingSystem';
import './QuestionsUI.css';

const QuestionsUI = ({ onClose, showNotification }) => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'questions', 'results', 'insights'
  const [matchingSystem] = useState(new MatchingSystem());
  const [stats, setStats] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('medium');
  const [insights, setInsights] = useState({});
  const [matchSuggestions, setMatchSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStats(matchingSystem.getUserStats());
    setInsights(matchingSystem.getPersonalityInsights());
    
    // Load sample users for matching (in real app, this would come from API)
    const sampleUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const suggestions = matchingSystem.getMatchSuggestions(sampleUsers, 10);
    setMatchSuggestions(suggestions);
  };

  const startQuestions = () => {
    const unanswered = matchingSystem.getUnansweredQuestions(10);
    if (unanswered.length === 0) {
      showNotification('🎉 עניתי על כל השאלות! מדהים!');
      return;
    }
    
    setCurrentQuestions(unanswered);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setSelectedImportance('medium');
    setCurrentView('questions');
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      showNotification('נא לבחור תשובה');
      return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    matchingSystem.answerQuestion(currentQuestion.id, selectedAnswer, selectedImportance);
    
    // Move to next question or finish
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setSelectedImportance('medium');
    } else {
      // Finished all questions
      showNotification('🎉 סיימת את השאלות! מחשב התאמות...');
      finishQuestions();
    }
  };

  const finishQuestions = () => {
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      loadData(); // Reload stats and suggestions
      setCurrentView('results');
      setLoading(false);
    }, 1500);
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setSelectedImportance('medium');
    } else {
      finishQuestions();
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      lifestyle: 'fas fa-home',
      values: 'fas fa-heart',
      personality: 'fas fa-user',
      relationship: 'fas fa-users',
      interests: 'fas fa-star'
    };
    return icons[category] || 'fas fa-question';
  };

  const getCategoryColor = (category) => {
    const colors = {
      lifestyle: '#28a745',
      values: '#dc3545',
      personality: '#007bff',
      relationship: '#ffc107',
      interests: '#6f42c1'
    };
    return colors[category] || '#6c757d';
  };

  const getImportanceColor = (importance) => {
    const colors = {
      low: '#6c757d',
      medium: '#007bff',
      high: '#ffc107',
      critical: '#dc3545'
    };
    return colors[importance] || '#007bff';
  };

  return (
    <div className="questions-overlay">
      <div className="questions-modal">
        {/* Header */}
        <div className="questions-header">
          <h2>
            <i className="fas fa-brain"></i>
            מערכת התאמות חכמה
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Overview */}
        {currentView === 'overview' && (
          <div className="questions-overview">
            <div className="progress-section">
              <h3>ההתקדמות שלך</h3>
              <div className="progress-circle">
                <div className="circle-progress" style={{
                  background: `conic-gradient(#007bff ${stats.completionPercentage * 3.6}deg, #e9ecef 0deg)`
                }}>
                  <div className="circle-inner">
                    <span className="percentage">{stats.completionPercentage}%</span>
                    <small>הושלם</small>
                  </div>
                </div>
              </div>
              <p>{stats.answeredQuestions} מתוך {stats.totalQuestions} שאלות</p>
            </div>

            <div className="categories-breakdown">
              <h3>פילוח לפי קטגוריות</h3>
              <div className="categories-grid">
                {Object.entries(stats.categoryStats || {}).map(([category, data]) => (
                  <div key={category} className="category-card">
                    <div className="category-header">
                      <i className={getCategoryIcon(category)} style={{ color: getCategoryColor(category) }}></i>
                      <h4>{matchingSystem.questionCategories[category]?.name}</h4>
                    </div>
                    <div className="category-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${data.percentage}%`,
                            backgroundColor: getCategoryColor(category)
                          }}
                        ></div>
                      </div>
                      <span>{data.answered}/{data.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="start-questions-btn" onClick={startQuestions}>
                <i className="fas fa-play"></i>
                {stats.answeredQuestions === 0 ? 'התחל לענות על שאלות' : 'המשך לענות'}
              </button>
              
              {stats.answeredQuestions > 0 && (
                <>
                  <button className="view-results-btn" onClick={() => setCurrentView('results')}>
                    <i className="fas fa-chart-line"></i>
                    הצג התאמות
                  </button>
                  
                  <button className="view-insights-btn" onClick={() => setCurrentView('insights')}>
                    <i className="fas fa-lightbulb"></i>
                    תובנות אישיות
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        {currentView === 'questions' && currentQuestions.length > 0 && (
          <div className="questions-section">
            <div className="question-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                ></div>
              </div>
              <span>שאלה {currentQuestionIndex + 1} מתוך {currentQuestions.length}</span>
            </div>

            <div className="question-card">
              <div className="question-category">
                <i className={getCategoryIcon(currentQuestions[currentQuestionIndex].category)}></i>
                <span>{matchingSystem.questionCategories[currentQuestions[currentQuestionIndex].category]?.name}</span>
              </div>
              
              <h3 className="question-text">
                {currentQuestions[currentQuestionIndex].question}
              </h3>

              <div className="answer-options">
                {currentQuestions[currentQuestionIndex].options.map(option => (
                  <label key={option.id} className="answer-option">
                    <input
                      type="radio"
                      name="answer"
                      value={option.id}
                      checked={selectedAnswer === option.id}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                    />
                    <span className="option-text">{option.text}</span>
                    <span className="option-radio"></span>
                  </label>
                ))}
              </div>

              <div className="importance-section">
                <h4>כמה חשובה השאלה הזו בעיניך?</h4>
                <div className="importance-options">
                  {[
                    { value: 'low', label: 'לא חשוב', icon: 'far fa-circle' },
                    { value: 'medium', label: 'בינוני', icon: 'fas fa-circle' },
                    { value: 'high', label: 'חשוב', icon: 'fas fa-exclamation' },
                    { value: 'critical', label: 'קריטי', icon: 'fas fa-exclamation-triangle' }
                  ].map(importance => (
                    <label key={importance.value} className="importance-option">
                      <input
                        type="radio"
                        name="importance"
                        value={importance.value}
                        checked={selectedImportance === importance.value}
                        onChange={(e) => setSelectedImportance(e.target.value)}
                      />
                      <span className="importance-badge" style={{ backgroundColor: getImportanceColor(importance.value) }}>
                        <i className={importance.icon}></i>
                        {importance.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="question-actions">
                <button className="skip-btn" onClick={skipQuestion}>
                  דלג
                </button>
                <button 
                  className="answer-btn"
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                >
                  {currentQuestionIndex < currentQuestions.length - 1 ? 'הבא' : 'סיים'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results/Matches */}
        {currentView === 'results' && (
          <div className="results-section">
            <h3>
              <i className="fas fa-heart"></i>
              ההתאמות שלך ({matchSuggestions.length})
            </h3>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>מחשב התאמות...</p>
              </div>
            ) : matchSuggestions.length === 0 ? (
              <div className="no-matches">
                <i className="fas fa-search"></i>
                <h4>אין התאמות זמינות</h4>
                <p>ענה על עוד שאלות כדי לקבל התאמות טובות יותר</p>
                <button className="answer-more-btn" onClick={() => setCurrentView('overview')}>
                  ענה על עוד שאלות
                </button>
              </div>
            ) : (
              <div className="matches-grid">
                {matchSuggestions.map(match => (
                  <div key={match.id} className="match-card">
                    <div className="match-header">
                      <div className="match-avatar">
                        {match.photos && match.photos.length > 0 ? (
                          <img src={match.photos[0].url} alt={match.firstName} />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <div className="match-info">
                        <h4>{match.firstName} {match.lastName}</h4>
                        <p>גיל {new Date().getFullYear() - new Date(match.birthDate).getFullYear()} • {match.city}</p>
                      </div>
                      <div className="match-percentage">
                        <div className="percentage-circle" style={{
                          background: `conic-gradient(#28a745 ${match.matchPercentage * 3.6}deg, #e9ecef 0deg)`
                        }}>
                          <span>{match.matchPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="match-details">
                      {match.commonAnswers && match.commonAnswers.length > 0 && (
                        <div className="common-answers">
                          <h5>
                            <i className="fas fa-check"></i>
                            דברים משותפים ({match.commonAnswers.length})
                          </h5>
                          <ul>
                            {match.commonAnswers.slice(0, 3).map((common, index) => (
                              <li key={index}>
                                <strong>{common.question}:</strong> {common.answer}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {match.dealBreakers && match.dealBreakers.length > 0 && (
                        <div className="deal-breakers">
                          <h5>
                            <i className="fas fa-exclamation-triangle"></i>
                            הבדלים חשובים
                          </h5>
                          <ul>
                            {match.dealBreakers.slice(0, 2).map((breaker, index) => (
                              <li key={index}>
                                <strong>{breaker.question}:</strong> אתה: {breaker.userAnswer}, הם: {breaker.otherAnswer}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="match-actions">
                      <button className="view-profile-btn">
                        <i className="fas fa-eye"></i>
                        הצג פרופיל
                      </button>
                      <button className="like-btn">
                        <i className="fas fa-heart"></i>
                        לייק
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Personality Insights */}
        {currentView === 'insights' && (
          <div className="insights-section">
            <h3>
              <i className="fas fa-lightbulb"></i>
              תובנות אישיות
            </h3>

            <div className="insights-grid">
              <div className="insight-card">
                <h4>
                  <i className="fas fa-user-circle"></i>
                  התכונות שלך
                </h4>
                <ul>
                  {insights.traits && insights.traits.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>

              <div className="insight-card">
                <h4>
                  <i className="fas fa-chart-pie"></i>
                  סטטיסטיקות
                </h4>
                <div className="stats-list">
                  <div className="stat-item">
                    <span>שאלות שענית:</span>
                    <strong>{stats.answeredQuestions}</strong>
                  </div>
                  <div className="stat-item">
                    <span>אחוז השלמה:</span>
                    <strong>{stats.completionPercentage}%</strong>
                  </div>
                  <div className="stat-item">
                    <span>התאמות נמצאו:</span>
                    <strong>{matchSuggestions.length}</strong>
                  </div>
                </div>
              </div>

              <div className="insight-card">
                <h4>
                  <i className="fas fa-tips"></i>
                  טיפים לשיפור
                </h4>
                <ul>
                  {stats.completionPercentage < 50 && (
                    <li>ענה על עוד שאלות כדי לקבל התאמות טובות יותר</li>
                  )}
                  {matchSuggestions.length < 5 && (
                    <li>נסה לענות על שאלות בקטגוריות שונות</li>
                  )}
                  <li>ענה בכנות - זה יעזור למצוא התאמות אמיתיות</li>
                  <li>עדכן את הפרופיל שלך עם תמונות וביוגרפיה</li>
                </ul>
              </div>
            </div>

            <div className="insights-actions">
              <button className="improve-btn" onClick={() => setCurrentView('overview')}>
                <i className="fas fa-arrow-up"></i>
                שפר את ההתאמות
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentView !== 'questions' && (
          <div className="questions-navigation">
            <button 
              className={`nav-btn ${currentView === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentView('overview')}
            >
              <i className="fas fa-home"></i>
              סקירה
            </button>
            
            {stats.answeredQuestions > 0 && (
              <>
                <button 
                  className={`nav-btn ${currentView === 'results' ? 'active' : ''}`}
                  onClick={() => setCurrentView('results')}
                >
                  <i className="fas fa-heart"></i>
                  התאמות
                </button>
                
                <button 
                  className={`nav-btn ${currentView === 'insights' ? 'active' : ''}`}
                  onClick={() => setCurrentView('insights')}
                >
                  <i className="fas fa-lightbulb"></i>
                  תובנות
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsUI;