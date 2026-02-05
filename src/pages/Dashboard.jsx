import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import DayCard from '../components/DayCard';
import SessionCard from '../components/SessionCard';
import StatsDonut from '../components/StatsDonut';
import { formatDate } from '../utils/formatters';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { activePlan, plans } = useWorkoutPlans();
    const { startSession, isSessionActive, activeSession } = useWorkoutSession();
    const { sessions } = useExerciseHistory();

    // Generate week dates
    const today = new Date();
    const weekDays = getWeekDays(today);
    const [selectedDate, setSelectedDate] = useState(today.toDateString());

    const handleStartWorkout = (dayId) => {
        if (isSessionActive) {
            if (window.confirm('You have an active workout. Start a new one?')) {
                startSession(dayId);
                navigate('/workout');
            }
        } else {
            startSession(dayId);
            navigate('/workout');
        }
    };

    const recentSessions = sessions.slice(0, 3);
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const thisWeekCount = getThisWeekCount(sessions);
    const streak = getStreak(sessions);

    // Get last performed date for each day
    const getLastPerformedForDay = (dayId) => {
        const session = sessions.find(s => s.dayId === dayId);
        return session ? formatDate(session.completedAt || session.startedAt, { relative: true }) : null;
    };

    // Calculate completion stats for donut
    const totalWorkoutsGoal = 20; // Monthly goal
    const completionPercentage = Math.min(100, Math.round((completedSessions.length / totalWorkoutsGoal) * 100));

    return (
        <div className="page dashboard">
            <div className="container">
                {/* Active Session Banner */}
                {isSessionActive && activeSession && (
                    <Link to="/workout" className="active-session-banner animate-fadeIn">
                        <div className="banner-content">
                            <span className="pulse-dot" />
                            <div className="banner-text">
                                <strong>Workout in Progress</strong>
                                <span>{activeSession.dayName}</span>
                            </div>
                        </div>
                        <span className="banner-action">
                            Continue
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                )}

                <div className="dashboard-grid">
                    {/* Left Sidebar - Stats */}
                    <aside className="sidebar-left animate-slideInLeft">
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">📊 Quick Stats</h3>
                            <div className="stats-mini-grid">
                                <div className="stat-mini">
                                    <div className="stat-mini-icon" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)' }}>
                                        🏋️
                                    </div>
                                    <div className="stat-mini-content">
                                        <span className="stat-mini-value">{sessions.length}</span>
                                        <span className="stat-mini-label">Total Workouts</span>
                                    </div>
                                </div>
                                <div className="stat-mini">
                                    <div className="stat-mini-icon" style={{ background: 'linear-gradient(135deg, #00c853 0%, #00e676 100%)' }}>
                                        ✅
                                    </div>
                                    <div className="stat-mini-content">
                                        <span className="stat-mini-value">{completedSessions.length}</span>
                                        <span className="stat-mini-label">Completed</span>
                                    </div>
                                </div>
                                <div className="stat-mini">
                                    <div className="stat-mini-icon" style={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)' }}>
                                        📅
                                    </div>
                                    <div className="stat-mini-content">
                                        <span className="stat-mini-value">{thisWeekCount}</span>
                                        <span className="stat-mini-label">This Week</span>
                                    </div>
                                </div>
                                <div className="stat-mini">
                                    <div className="stat-mini-icon" style={{ background: 'linear-gradient(135deg, #f44336 0%, #ff5252 100%)' }}>
                                        🔥
                                    </div>
                                    <div className="stat-mini-content">
                                        <span className="stat-mini-value">{streak}</span>
                                        <span className="stat-mini-label">Day Streak</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        {recentSessions.length > 0 && (
                            <div className="sidebar-card">
                                <div className="sidebar-header">
                                    <h3 className="sidebar-title">🕐 Recent</h3>
                                    <Link to="/history" className="see-all">See All</Link>
                                </div>
                                <div className="recent-list">
                                    {recentSessions.slice(0, 3).map(session => (
                                        <div key={session.id} className="recent-item">
                                            <div className={`recent-status ${session.status}`} />
                                            <div className="recent-info">
                                                <span className="recent-name">{session.dayName || 'Workout'}</span>
                                                <span className="recent-date">
                                                    {formatDate(session.completedAt || session.startedAt, { relative: true })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main className="main-content animate-fadeIn">
                        {/* Welcome Section */}
                        <section className="welcome-section">
                            <h1 className="welcome-title">
                                {getGreeting()}, <span className="accent-text">Lifter</span> 💪
                            </h1>
                            <p className="welcome-subtitle">Ready to crush today's workout?</p>
                        </section>

                        {/* Date Navigation */}
                        <div className="date-nav-wrapper">
                            <button className="date-nav-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="date-nav">
                                {weekDays.map((day, index) => (
                                    <button
                                        key={index}
                                        className={`date-pill ${day.dateString === selectedDate ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
                                        onClick={() => setSelectedDate(day.dateString)}
                                    >
                                        <span className="day-name">{day.dayName}</span>
                                        <span className="day-number">{day.dayNumber}</span>
                                    </button>
                                ))}
                            </div>
                            <button className="date-nav-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>

                        {/* Active Plan Section */}
                        {activePlan ? (
                            <section className="section">
                                <div className="section-header">
                                    <h2 className="section-title">
                                        <span className="section-icon">📋</span>
                                        {activePlan.name}
                                    </h2>
                                    <Link to="/plans" className="btn btn-ghost btn-sm">
                                        Change Plan
                                    </Link>
                                </div>

                                <div className="days-grid">
                                    {activePlan.days.map((day, index) => (
                                        <div key={day.id} className={`stagger-${index + 1}`}>
                                            <DayCard
                                                day={day}
                                                planId={activePlan.id}
                                                onStartWorkout={handleStartWorkout}
                                                lastPerformed={getLastPerformedForDay(day.id)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {activePlan.days.length === 0 && (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📝</div>
                                        <h3 className="empty-state-title">No workout days yet</h3>
                                        <p className="empty-state-text">Add some days to your plan to get started</p>
                                        <Link to={`/plans/${activePlan.id}`} className="btn btn-primary">
                                            Edit Plan
                                        </Link>
                                    </div>
                                )}
                            </section>
                        ) : (
                            <section className="section">
                                <div className="empty-state-large">
                                    <div className="empty-state-icon animate-float">🏋️</div>
                                    <h3 className="empty-state-title">No Active Plan</h3>
                                    <p className="empty-state-text">
                                        {plans.length > 0
                                            ? 'Select a plan to start tracking your workouts'
                                            : 'Create your first workout plan to get started'}
                                    </p>
                                    <Link to="/plans" className="btn btn-primary btn-lg">
                                        {plans.length > 0 ? 'Choose a Plan' : 'Create Plan'}
                                    </Link>
                                </div>
                            </section>
                        )}
                    </main>

                    {/* Right Sidebar - Progress */}
                    <aside className="sidebar-right animate-slideInRight">
                        {/* Progress Donut */}
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">🎯 Monthly Goal</h3>
                            <StatsDonut
                                value={completedSessions.length}
                                total={totalWorkoutsGoal}
                                label="Workouts"
                                segments={[
                                    { value: completedSessions.length, color: '#1a73e8', label: 'Completed' },
                                    { value: sessions.length - completedSessions.length, color: '#ff9800', label: 'Abandoned' },
                                    { value: Math.max(0, totalWorkoutsGoal - sessions.length), color: '#e2e8f0', label: 'Remaining' }
                                ]}
                            />
                        </div>

                        {/* Achievement Cards */}
                        <div className="sidebar-card">
                            <div className="sidebar-header">
                                <h3 className="sidebar-title">🏆 Achievements</h3>
                                <Link to="/progress" className="see-all">See all</Link>
                            </div>
                            <div className="achievement-list">
                                {streak >= 3 && (
                                    <div className="achievement-card">
                                        <div className="achievement-icon">🔥</div>
                                        <div className="achievement-content">
                                            <h4>{streak} Day Streak!</h4>
                                            <p>Keep up the consistency</p>
                                        </div>
                                    </div>
                                )}
                                {completedSessions.length >= 5 && (
                                    <div className="achievement-card">
                                        <div className="achievement-icon">💪</div>
                                        <div className="achievement-content">
                                            <h4>Dedicated Athlete</h4>
                                            <p>{completedSessions.length} workouts completed</p>
                                        </div>
                                    </div>
                                )}
                                {thisWeekCount >= 3 && (
                                    <div className="achievement-card">
                                        <div className="achievement-icon">⚡</div>
                                        <div className="achievement-content">
                                            <h4>Weekly Warrior</h4>
                                            <p>{thisWeekCount} workouts this week</p>
                                        </div>
                                    </div>
                                )}
                                {streak < 3 && completedSessions.length < 5 && thisWeekCount < 3 && (
                                    <div className="achievement-card muted">
                                        <div className="achievement-icon">🎯</div>
                                        <div className="achievement-content">
                                            <h4>Start Your Journey</h4>
                                            <p>Complete workouts to earn badges</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Motivation Card */}
                        <div className="promo-card">
                            <div className="promo-icon">💡</div>
                            <div className="promo-content">
                                <h4>Pro Tip</h4>
                                <p>Consistency beats intensity. Show up every day, even for a short workout!</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function getWeekDays(today) {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
            dayName: dayNames[date.getDay()],
            dayNumber: date.getDate(),
            dateString: date.toDateString(),
            isToday: i === 0
        });
    }
    return days;
}

function getThisWeekCount(sessions) {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return sessions.filter(s => {
        const sessionDate = new Date(s.completedAt || s.startedAt);
        return sessionDate >= weekStart;
    }).length;
}

function getStreak(sessions) {
    if (sessions.length === 0) return 0;

    const completed = sessions
        .filter(s => s.status === 'completed')
        .map(s => {
            const date = new Date(s.completedAt);
            return date.toDateString();
        });

    const uniqueDates = [...new Set(completed)].sort((a, b) =>
        new Date(b) - new Date(a)
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);

        if (uniqueDates.includes(checkDate.toDateString())) {
            streak++;
        } else if (i === 0) {
            continue;
        } else {
            break;
        }
    }

    return streak;
}
