import React, { useState, useEffect } from 'react';
import PremiumSystem from './PremiumSystem';
import './PremiumUI.css';

const PremiumUI = ({ onClose, showNotification }) => {
  const [currentView, setCurrentView] = useState('plans'); // 'plans', 'single', 'history', 'payment'
  const [premiumSystem] = useState(new PremiumSystem());
  const [stats, setStats] = useState({});
  const [offers, setOffers] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    // Reset daily limits when component loads
    premiumSystem.resetDailyLimits();
    
    // Load initial data
    setStats(premiumSystem.getStats());
    setOffers(premiumSystem.getPromotionalOffers());
    setPurchaseHistory(premiumSystem.getPurchaseHistory());
  }, []);

  const handlePurchaseSubscription = async (tierId) => {
    setLoading(true);
    
    try {
      const result = await premiumSystem.purchaseSubscription(tierId, paymentMethod);
      
      if (result.success) {
        showNotification(`🎉 ${result.message}`);
        setStats(premiumSystem.getStats());
        setCurrentView('plans');
      } else {
        showNotification(`❌ ${result.error}`);
      }
    } catch (error) {
      showNotification('❌ שגיאה בעיבוד התשלום');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseItem = async (itemId) => {
    setLoading(true);
    
    try {
      const result = await premiumSystem.purchaseSingleItem(itemId, paymentMethod);
      
      if (result.success) {
        showNotification(`🎉 ${result.message}`);
        setStats(premiumSystem.getStats());
        setCurrentView('single');
      } else {
        showNotification(`❌ ${result.error}`);
      }
    } catch (error) {
      showNotification('❌ שגיאה בעיבוד התשלום');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateBoost = () => {
    const result = premiumSystem.activateBoost();
    
    if (result.success) {
      showNotification(`🚀 ${result.message}`);
      setStats(premiumSystem.getStats());
    } else {
      showNotification(`❌ ${result.error}`);
    }
  };

  const handleCancelSubscription = () => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את המנוי?')) {
      const result = premiumSystem.cancelSubscription();
      showNotification(result.message);
      setStats(premiumSystem.getStats());
    }
  };

  const getDiscountedPrice = (tierId, promoId) => {
    if (!promoId) return premiumSystem.subscriptionTiers[tierId].price;
    return premiumSystem.applyPromoDiscount(tierId, promoId);
  };

  return (
    <div className="premium-overlay">
      <div className="premium-modal">
        <div className="premium-header">
          <h2>IsraLove Premium 💎</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Current Status */}
        <div className="premium-status">
          <div className="status-card">
            <div className="status-info">
              <h3>{stats.currentTier}</h3>
              <p>{stats.isPremium ? `${stats.subscriptionDaysLeft} ימים נותרו` : 'חבר חינם'}</p>
            </div>
            <div className="status-features">
              <span className="feature-count">
                <i className="fas fa-heart"></i> {stats.remainingLikes} לייקים
              </span>
              <span className="feature-count">
                <i className="fas fa-star"></i> {stats.remainingSuperLikes} סופר לייקים
              </span>
              <span className="feature-count">
                <i className="fas fa-rocket"></i> {stats.remainingBoosts} בוסטים
              </span>
            </div>
          </div>
          
          {stats.isBoostActive && (
            <div className="boost-active">
              <i className="fas fa-fire"></i>
              <span>הבוסט שלך פעיל!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="premium-tabs">
          <button 
            className={`tab ${currentView === 'plans' ? 'active' : ''}`}
            onClick={() => setCurrentView('plans')}
          >
            <i className="fas fa-crown"></i>
            מנויים
          </button>
          <button 
            className={`tab ${currentView === 'single' ? 'active' : ''}`}
            onClick={() => setCurrentView('single')}
          >
            <i className="fas fa-shopping-cart"></i>
            רכישות
          </button>
          <button 
            className={`tab ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <i className="fas fa-history"></i>
            היסטוריה
          </button>
        </div>

        {/* Promotional Offers */}
        {offers.length > 0 && (
          <div className="promotional-offers">
            <h3>🔥 מבצעים חמים</h3>
            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-badge">{offer.discount}% הנחה</div>
                  <h4>{offer.title}</h4>
                  <p>{offer.description}</p>
                  <small>בתוקף עד: {new Date(offer.validUntil).toLocaleDateString('he-IL')}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        {currentView === 'plans' && (
          <div className="subscription-plans">
            <div className="plans-grid">
              {Object.values(premiumSystem.subscriptionTiers).map(tier => (
                <div 
                  key={tier.id}
                  className={`plan-card ${tier.popular ? 'popular' : ''} ${stats.currentTier === tier.name ? 'current' : ''}`}
                  style={{ borderColor: tier.color }}
                >
                  {tier.popular && <div className="popular-badge">הכי פופולרי</div>}
                  {stats.currentTier === tier.name && <div className="current-badge">הנוכחי שלך</div>}
                  
                  <div className="plan-header">
                    <h3 style={{ color: tier.color }}>{tier.name}</h3>
                    <div className="plan-price">
                      {tier.price === 0 ? (
                        <span className="price">חינם</span>
                      ) : (
                        <>
                          <span className="price">₪{tier.price}</span>
                          <span className="duration">/{tier.duration}</span>
                          {tier.originalPrice && (
                            <span className="original-price">₪{tier.originalPrice}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="plan-features">
                    <div className="feature">
                      <i className="fas fa-heart"></i>
                      <span>
                        {tier.features.dailyLikes === 'unlimited' ? 'לייקים ללא הגבלה' : `${tier.features.dailyLikes} לייkים ליום`}
                      </span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-star"></i>
                      <span>{tier.features.superLikes} סופר לייקים לחודש</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-rocket"></i>
                      <span>{tier.features.boosts} בוסטים לחודש</span>
                    </div>
                    
                    {tier.features.seeWhoLikesYou && (
                      <div className="feature">
                        <i className="fas fa-eye"></i>
                        <span>ראה מי עשה לך לייק</span>
                      </div>
                    )}
                    
                    {tier.features.unlimitedMessages && (
                      <div className="feature">
                        <i className="fas fa-comments"></i>
                        <span>הודעות ללא הגבלה</span>
                      </div>
                    )}
                    
                    {tier.features.advancedFilters && (
                      <div className="feature">
                        <i className="fas fa-filter"></i>
                        <span>פילטרים מתקדמים</span>
                      </div>
                    )}
                    
                    {tier.features.readReceipts && (
                      <div className="feature">
                        <i className="fas fa-check-double"></i>
                        <span>אישורי קריאה</span>
                      </div>
                    )}
                    
                    {tier.features.undoSwipes && (
                      <div className="feature">
                        <i className="fas fa-undo"></i>
                        <span>ביטול החלטות</span>
                      </div>
                    )}
                    
                    {tier.features.invisibleMode && (
                      <div className="feature">
                        <i className="fas fa-user-secret"></i>
                        <span>מצב חשאי</span>
                      </div>
                    )}
                    
                    {tier.features.adFree && (
                      <div className="feature">
                        <i className="fas fa-ban"></i>
                        <span>ללא פרסומות</span>
                      </div>
                    )}
                  </div>

                  <div className="plan-action">
                    {stats.currentTier === tier.name ? (
                      <button className="plan-btn current" disabled>
                        התוכנית הנוכחית
                      </button>
                    ) : tier.price === 0 ? (
                      <button className="plan-btn free" disabled>
                        תוכנית חינם
                      </button>
                    ) : (
                      <button 
                        className="plan-btn premium"
                        style={{ backgroundColor: tier.color }}
                        onClick={() => {
                          setSelectedPlan(tier);
                          setCurrentView('payment');
                        }}
                      >
                        בחר תוכנית
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {stats.isPremium && (
              <div className="subscription-management">
                <button className="cancel-subscription" onClick={handleCancelSubscription}>
                  בטל מנוי
                </button>
              </div>
            )}
          </div>
        )}

        {/* Single Purchases */}
        {currentView === 'single' && (
          <div className="single-purchases">
            <h3>רכישות חד-פעמיות</h3>
            
            {/* Quick Boost Button */}
            <div className="quick-boost">
              <button 
                className="boost-button"
                onClick={handleActivateBoost}
                disabled={stats.remainingBoosts === 0 || stats.isBoostActive}
              >
                <i className="fas fa-rocket"></i>
                <span>הפעל בוסט עכשיו</span>
                <small>
                  {stats.isBoostActive ? 'בוסט פעיל' : 
                   stats.remainingBoosts === 0 ? 'אין בוסטים' : 
                   `${stats.remainingBoosts} בוסטים זמינים`}
                </small>
              </button>
            </div>

            <div className="purchases-grid">
              {Object.values(premiumSystem.singlePurchases).map(item => (
                <div key={item.id} className={`purchase-card ${item.popular ? 'popular' : ''}`}>
                  {item.popular && <div className="popular-badge">פופולרי</div>}
                  
                  <div className="purchase-icon">
                    <i className={
                      item.type === 'superLikes' ? 'fas fa-star' :
                      item.type === 'boost' ? 'fas fa-rocket' :
                      'fas fa-heart'
                    }></i>
                  </div>
                  
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  
                  <div className="purchase-price">
                    <span className="price">₪{item.price}</span>
                  </div>
                  
                  <button 
                    className="purchase-btn"
                    onClick={() => {
                      setSelectedItem(item);
                      setCurrentView('payment');
                    }}
                  >
                    קנה עכשיו
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchase History */}
        {currentView === 'history' && (
          <div className="purchase-history">
            <h3>היסטוריית רכישות</h3>
            
            <div className="total-spent">
              <span>סך הכל הוצאת: ₪{stats.totalSpent}</span>
            </div>

            <div className="history-list">
              {purchaseHistory.length === 0 ? (
                <div className="empty-history">
                  <i className="fas fa-receipt"></i>
                  <p>עדיין לא ביצעת רכישות</p>
                </div>
              ) : (
                purchaseHistory.map(purchase => (
                  <div key={purchase.id} className="history-item">
                    <div className="history-icon">
                      <i className={
                        purchase.type === 'subscription' ? 'fas fa-crown' :
                        'fas fa-shopping-cart'
                      }></i>
                    </div>
                    
                    <div className="history-details">
                      <h4>
                        {purchase.type === 'subscription' ? 
                          `מנוי ${premiumSystem.subscriptionTiers[purchase.item]?.name}` :
                          premiumSystem.singlePurchases[purchase.item]?.name
                        }
                      </h4>
                      <p>{new Date(purchase.date).toLocaleDateString('he-IL')}</p>
                      {purchase.quantity && <small>{purchase.quantity} יחידות</small>}
                    </div>
                    
                    <div className="history-price">
                      ₪{purchase.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Payment View */}
        {currentView === 'payment' && (selectedPlan || selectedItem) && (
          <div className="payment-view">
            <div className="payment-header">
              <button className="back-btn" onClick={() => setCurrentView(selectedPlan ? 'plans' : 'single')}>
                <i className="fas fa-arrow-right"></i>
                חזור
              </button>
              <h3>סיום הזמנה</h3>
            </div>

            <div className="payment-summary">
              <h4>סיכום הזמנה:</h4>
              <div className="summary-item">
                <span>{selectedPlan ? selectedPlan.name : selectedItem.name}</span>
                <span>₪{selectedPlan ? selectedPlan.price : selectedItem.price}</span>
              </div>
              <div className="summary-total">
                <span>סה"כ לתשלום:</span>
                <span>₪{selectedPlan ? selectedPlan.price : selectedItem.price}</span>
              </div>
            </div>

            <div className="payment-methods">
              <h4>אמצעי תשלום:</h4>
              <div className="method-options">
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <i className="fas fa-credit-card"></i>
                  <span>כרטיס אשראי</span>
                </label>
                
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <i className="fab fa-paypal"></i>
                  <span>PayPal</span>
                </label>
                
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="googlePay"
                    checked={paymentMethod === 'googlePay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <i className="fab fa-google-pay"></i>
                  <span>Google Pay</span>
                </label>
              </div>
            </div>

            <div className="payment-actions">
              <button 
                className="complete-payment-btn"
                onClick={() => selectedPlan ? 
                  handlePurchaseSubscription(selectedPlan.id) : 
                  handlePurchaseItem(selectedItem.id)
                }
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    מעבד תשלום...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    שלם ₪{selectedPlan ? selectedPlan.price : selectedItem.price}
                  </>
                )}
              </button>
              
              <p className="security-note">
                <i className="fas fa-shield-alt"></i>
                התשלום מאובטח ומוצפן
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumUI;