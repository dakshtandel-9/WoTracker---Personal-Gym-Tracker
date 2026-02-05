import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import SessionCard from '../components/SessionCard';
import StatsDonut from '../components/StatsDonut';
import { formatDate } from '../utils/formatters';
import './History.css';

export default function History() {
    const { sessions } = useExerciseHistory();
    const [expandedSession, setExpandedSession] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return true;
        return session.status === filter;
    });

    // Sort sessions
    const sortedSessions = [...filteredSessions].sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt);
        }
        return 0;
    });

    // Group sessions by date
    const groupedSessions = sortedSessions.reduce((groups, session) => {
        const date = formatDate(session.completedAt || session.startedAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(session);
        return groups;
    }, {});

    const toggleExpand = (sessionId) => {
        setExpandedSession(prev => prev === sessionId ? null : sessionId);
    };

    // Calculate stats
    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const abandonedCount = sessions.filter(s => s.status === 'abandoned').length;
    const thisWeekCount = getThisWeekCount(sessions);
    const streak = getStreak(sessions);

    return (
        <div className="page history">
            <div className="container">
                <header className="page-header">
                    <div className="page-header-content">
                        <h1 className="page-title">Workout History</h1>
                        <p className="page-subtitle">
                            {sessions.length} workouts logged
                        </p>
                    </div>
                </header>

                <div className="history-grid">
                    {/* Left Filter Panel */}
                    <aside className="filter-panel animate-slideInLeft">
                        <div className="filter-header">
                            <h3 className="filter-title">Filter</h3>
                            <button className="filter-reset" onClick={() => setFilter('all')}>
                                Reset
                            </button>
                        </div>

                        <div className="filter-section">
                            <div className="filter-section-title">
                                Status
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <div className="filter-options">
                                <label className={`filter-option ${filter === 'all' ? 'active' : ''}`}>
                                    <div className="filter-checkbox">
                                        {filter === 'all' && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span>All</span>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={filter === 'all'}
                                        onChange={() => setFilter('all')}
                                        hidden
                                    />
                                </label>
                                <label className={`filter-option ${filter === 'completed' ? 'active' : ''}`}>
                                    <div className="filter-checkbox">
                                        {filter === 'completed' && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-success">Completed</span>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={filter === 'completed'}
                                        onChange={() => setFilter('completed')}
                                        hidden
                                    />
                                </label>
                                <label className={`filter-option ${filter === 'abandoned' ? 'active' : ''}`}>
                                    <div className="filter-checkbox">
                                        {filter === 'abandoned' && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-warning">Abandoned</span>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={filter === 'abandoned'}
                                        onChange={() => setFilter('abandoned')}
                                        hidden
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-section-title">
                                Sort By
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <div className="filter-options">
                                <label className={`filter-option ${sortBy === 'recent' ? 'active' : ''}`}>
                                    <div className="filter-checkbox">
                                        {sortBy === 'recent' && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span>Most Recent</span>
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === 'recent'}
                                        onChange={() => setSortBy('recent')}
                                        hidden
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Quick Stats in Filter */}
                        <div className="filter-stats">
                            <h4 className="filter-stats-title">Quick Stats</h4>
                            <div className="filter-stat-item">
                                <span className="filter-stat-icon">🔥</span>
                                <span className="filter-stat-label">Streak</span>
                                <span className="filter-stat-value">{streak} days</span>
                            </div>
                            <div className="filter-stat-item">
                                <span className="filter-stat-icon">📅</span>
                                <span className="filter-stat-label">This Week</span>
                                <span className="filter-stat-value">{thisWeekCount}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="history-main animate-fadeIn">
                        {/* Mobile Filters */}
                        <div className="filters-mobile">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                ✅ Completed
                            </button>
                            <button
                                className={`filter-btn ${filter === 'abandoned' ? 'active' : ''}`}
                                onClick={() => setFilter('abandoned')}
                            >
                                ⚠️ Abandoned
                            </button>
                        </div>

                        {/* Results Header */}
                        <div className="results-header">
                            <span className="results-count">
                                {sortedSessions.length} workout{sortedSessions.length !== 1 ? 's' : ''} found
                            </span>
                        </div>

                        {/* Sessions List */}
                        {Object.keys(groupedSessions).length > 0 ? (
                            <div className="sessions-grouped">
                                {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                                    <div key={date} className="date-group">
                                        <h3 className="date-header">
                                            <span className="date-icon">📅</span>
                                            {date}
                                        </h3>
                                        <div className="sessions-list">
                                            {dateSessions.map((session, index) => (
                                                <div
                                                    key={session.id}
                                                    className={`session-wrapper stagger-${Math.min(index + 1, 5)}`}
                                                    onClick={() => toggleExpand(session.id)}
                                                >
                                                    <SessionCard
                                                        session={session}
                                                        expanded={expandedSession === session.id}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon animate-float">📊</div>
                                <h3 className="empty-state-title">No Workouts Yet</h3>
                                <p className="empty-state-text">
                                    Complete your first workout to see it here
                                </p>
                                <Link to="/dashboard" className="btn btn-primary">
                                    Start a Workout
                                </Link>
                            </div>
                        )}
                    </main>

                    {/* Right Stats Panel */}
                    <aside className="stats-panel animate-slideInRight">
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">📈 Completion Rate</h3>
                            <StatsDonut
                                value={completedCount}
                                total={sessions.length || 1}
                                label="Complete"
                                segments={[
                                    { value: completedCount, color: '#00c853', label: 'Completed' },
                                    { value: abandonedCount, color: '#ff9800', label: 'Abandoned' }
                                ]}
                            />
                        </div>

                        <div className="sidebar-card">
                            <h3 className="sidebar-title">📊 Overview</h3>
                            <div className="stats-list">
                                <div className="stat-row">
                                    <span className="stat-row-label">Total Workouts</span>
                                    <span className="stat-row-value">{sessions.length}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row-label">Completed</span>
                                    <span className="stat-row-value text-success">{completedCount}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row-label">Abandoned</span>
                                    <span className="stat-row-value text-warning">{abandonedCount}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row-label">This Week</span>
                                    <span className="stat-row-value text-accent">{thisWeekCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="promo-card">
                            <div className="promo-icon">🎯</div>
                            <div className="promo-content">
                                <h4>Keep Going!</h4>
                                <p>You're {streak > 0 ? `on a ${streak} day streak!` : 'building your workout habit!'}</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
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
