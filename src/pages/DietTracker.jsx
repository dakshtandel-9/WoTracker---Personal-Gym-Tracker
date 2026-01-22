import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFoodEntries, getDailyCalories, deleteFoodEntry } from '../lib/database';
import AddFoodModal from '../components/AddFoodModal';
import './DietTracker.css';

export default function DietTracker() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [foodEntries, setFoodEntries] = useState([]);
    const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedDate, user]);

    const loadData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [entries, totals] = await Promise.all([
                fetchFoodEntries(user.id, selectedDate),
                getDailyCalories(user.id, selectedDate)
            ]);

            setFoodEntries(entries);
            setDailyTotals(totals);
        } catch (error) {
            console.error('Error loading diet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm('Delete this food entry?')) return;

        const success = await deleteFoodEntry(entryId);
        if (success) {
            loadData();
        }
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const isToday = () => {
        const today = new Date();
        return selectedDate.toDateString() === today.toDateString();
    };

    const formatDate = (date) => {
        if (isToday()) return 'Today';

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getMealIcon = (mealType) => {
        const icons = {
            breakfast: '🌅',
            lunch: '☀️',
            dinner: '🌙',
            snack: '🍎'
        };
        return icons[mealType] || '🍽️';
    };

    const groupByMealType = () => {
        const groups = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };

        foodEntries.forEach(entry => {
            if (groups[entry.meal_type]) {
                groups[entry.meal_type].push(entry);
            }
        });

        return groups;
    };

    const calorieGoal = 2000; // Could be made configurable later
    const calorieProgress = Math.min((dailyTotals.calories / calorieGoal) * 100, 100);

    return (
        <div className="page diet-tracker">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">
                        🍎 <span className="accent">Diet Tracker</span>
                    </h1>
                    <p className="page-subtitle">Track your daily nutrition</p>
                </div>

                {/* Date Selector */}
                <div className="date-selector">
                    <button className="date-nav-btn" onClick={() => changeDate(-1)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="date-display">
                        <span className="date-text">{formatDate(selectedDate)}</span>
                        {!isToday() && (
                            <button className="btn-today" onClick={() => setSelectedDate(new Date())}>
                                Today
                            </button>
                        )}
                    </div>
                    <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={isToday()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Daily Summary */}
                <div className="daily-summary">
                    <div className="summary-header">
                        <h2>Daily Summary</h2>
                        <span className="calorie-count">
                            {dailyTotals.calories} / {calorieGoal} cal
                        </span>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${calorieProgress}%` }}
                        />
                    </div>

                    <div className="macros-grid">
                        <div className="macro-card">
                            <div className="macro-icon">🥩</div>
                            <div className="macro-info">
                                <span className="macro-value">{dailyTotals.protein.toFixed(1)}g</span>
                                <span className="macro-label">Protein</span>
                            </div>
                        </div>
                        <div className="macro-card">
                            <div className="macro-icon">🍞</div>
                            <div className="macro-info">
                                <span className="macro-value">{dailyTotals.carbs.toFixed(1)}g</span>
                                <span className="macro-label">Carbs</span>
                            </div>
                        </div>
                        <div className="macro-card">
                            <div className="macro-icon">🥑</div>
                            <div className="macro-info">
                                <span className="macro-value">{dailyTotals.fats.toFixed(1)}g</span>
                                <span className="macro-label">Fats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Food Button */}
                <button className="btn btn-primary btn-lg btn-add-food" onClick={() => setIsModalOpen(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Food
                </button>

                {/* Food Entries */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading entries...</p>
                    </div>
                ) : foodEntries.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🍽️</div>
                        <h3 className="empty-state-title">No food entries yet</h3>
                        <p className="empty-state-text">
                            Start tracking by adding your first meal
                        </p>
                    </div>
                ) : (
                    <div className="meals-section">
                        {Object.entries(groupByMealType()).map(([mealType, entries]) => {
                            if (entries.length === 0) return null;

                            return (
                                <div key={mealType} className="meal-group">
                                    <h3 className="meal-type-header">
                                        {getMealIcon(mealType)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                    </h3>
                                    <div className="food-entries-list">
                                        {entries.map(entry => (
                                            <div key={entry.id} className="food-entry-card">
                                                {entry.image_url && (
                                                    <div className="food-image">
                                                        <img src={entry.image_url} alt={entry.name} />
                                                    </div>
                                                )}
                                                <div className="food-details">
                                                    <div className="food-header">
                                                        <h4 className="food-name">{entry.name}</h4>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDeleteEntry(entry.id)}
                                                            title="Delete entry"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="food-nutrition">
                                                        <span className="nutrition-item calories">
                                                            {entry.calories} cal
                                                        </span>
                                                        {entry.protein > 0 && (
                                                            <span className="nutrition-item">P: {entry.protein}g</span>
                                                        )}
                                                        {entry.carbs > 0 && (
                                                            <span className="nutrition-item">C: {entry.carbs}g</span>
                                                        )}
                                                        {entry.fats > 0 && (
                                                            <span className="nutrition-item">F: {entry.fats}g</span>
                                                        )}
                                                    </div>
                                                    {entry.ai_analysis && (
                                                        <p className="food-analysis">{entry.ai_analysis}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Food Modal */}
            <AddFoodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={loadData}
            />
        </div>
    );
}
