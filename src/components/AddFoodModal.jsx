import { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../lib/openai';
import { saveFoodEntry, generateId } from '../lib/database';
import { useAuth } from '../context/AuthContext';
import './AddFoodModal.css';

export default function AddFoodModal({ isOpen, onClose, onSave }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingFoods, setPendingFoods] = useState(null);
    const [pendingTotals, setPendingTotals] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: "Hey! 👋 I'm your Diet Buddy! Tell me what you ate and I'll calculate the nutrition for you."
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (forcedMessage = null) => {
        const userMessage = forcedMessage || input.trim();
        if (!userMessage || isLoading) return;

        if (!forcedMessage) setInput('');
        setIsLoading(true);

        try {
            // Check if user is confirming to add food (and we have pending foods)
            const confirmKeywords = ['yes', 'add', 'save', 'y', 'ok', 'yeah', 'sure'];
            const msgLower = String(userMessage || '').toLowerCase();
            const isConfirmation = confirmKeywords.some(keyword =>
                msgLower.includes(keyword)
            );

            console.log('🔍 User message:', userMessage);
            console.log('🔍 isConfirmation:', isConfirmation);
            console.log('🔍 pendingFoods:', pendingFoods);
            console.log('🔍 pendingTotals:', pendingTotals);

            // If user is confirming AND we have pending foods, save them directly without calling AI
            if (isConfirmation && pendingFoods && pendingFoods.length > 0) {
                console.log('✅ User confirmed! Saving foods now...');

                // Add user's confirmation message to chat
                setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

                // Save all pending foods
                let savedCount = 0;
                for (const food of pendingFoods) {
                    const foodName = food.name || 'Unknown Food';
                    const foodQuantity = food.quantity || '';
                    const displayName = foodQuantity ? `${foodName} (${foodQuantity})` : foodName;

                    console.log('💾 Saving food:', { displayName, food });

                    const result = await saveFoodEntry({
                        id: generateId(),
                        name: displayName,
                        calories: parseInt(food.calories) || 0,
                        protein: parseFloat(food.protein) || 0,
                        carbs: parseFloat(food.carbs) || 0,
                        fats: parseFloat(food.fats) || 0,
                        fiber: parseFloat(food.fiber) || 0,
                        mealType: getMealType(),
                        consumedAt: new Date().toISOString(),
                    }, user.id);

                    console.log('💾 Save result:', result);
                    if (result) savedCount++;
                }

                // Show confirmation message
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `✅ Added ${savedCount} item(s)!\n\n📊 ${pendingTotals.calories} cal | P: ${pendingTotals.protein}g | C: ${pendingTotals.carbs}g | F: ${pendingTotals.fats}g\n\nClosing in 2 seconds...`
                }]);

                // Clear pending state
                setPendingFoods(null);
                setPendingTotals(null);

                // Refresh data and close modal
                console.log('📊 Refreshing data...');
                onSave();
                setTimeout(() => {
                    handleClose();
                }, 2000);

                setIsLoading(false);
                return; // Exit early, don't call AI
            }

            // If user is NOT confirming, OR we don't have pending foods, call AI for analysis
            console.log('🤖 Calling AI for food analysis...');

            // Add user message to chat
            setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

            // Get AI response for food analysis
            const chatHistory = messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role, content: m.content }));

            const response = await chatWithAssistant(chatHistory, userMessage);
            console.log('🤖 AI Response:', response);

            // If AI detected foods, save them as pending
            if (response && response.foods && response.foods.length > 0) {
                console.log('📝 Foods detected by AI:', response.foods);
                setPendingFoods(response.foods);
                setPendingTotals({
                    calories: response.totalCalories || 0,
                    protein: response.totalProtein || 0,
                    carbs: response.totalCarbs || 0,
                    fats: response.totalFats || 0,
                    fiber: response.totalFiber || 0
                });
            }

            // Add AI response to chat - ensure message is a string
            var aiMessage = "I couldn't understand that. Please try again with food name and quantity.";
            if (response && response.message) {
                aiMessage = response.message;
            }
            setMessages(function (prev) {
                return prev.concat([{
                    role: 'assistant',
                    content: String(aiMessage)
                }]);
            });
        } catch (error) {
            console.error('❌ Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Sorry, something went wrong: ${error.message}\n\nPlease try again!`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getMealType = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'breakfast';
        if (hour < 15) return 'lunch';
        if (hour < 20) return 'dinner';
        return 'snack';
    };

    const handleClose = () => {
        setMessages([]);
        setPendingFoods(null);
        setPendingTotals(null);
        setInput('');
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="chat-header-info">
                        <span className="chat-avatar">🥗</span>
                        <div>
                            <h2>Diet Buddy</h2>
                            <span className="chat-status">Online</span>
                        </div>
                    </div>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.role}`}>
                            {msg.role === 'assistant' && <span className="message-avatar">🥗</span>}
                            <div className="message-content">
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message assistant">
                            <span className="message-avatar">🥗</span>
                            <div className="message-content typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {pendingFoods && (
                    <div className="quick-actions-bar">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSend('Yes, add it')}
                            disabled={isLoading}
                        >
                            ✓ Yes, add it
                        </button>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                                setPendingFoods(null);
                                setMessages(prev => [...prev, {
                                    role: 'assistant',
                                    content: "No problem! Tell me what else you'd like to log, or correct the amounts."
                                }]);
                            }}
                        >
                            ✗ No, cancel
                        </button>
                    </div>
                )}

                <div className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tell me what you ate..."
                        disabled={isLoading}
                    />
                    <button
                        className="btn-send"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
