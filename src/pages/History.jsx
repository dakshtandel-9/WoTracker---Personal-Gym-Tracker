import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import SessionCard from '../components/SessionCard';
import { formatDate } from '../utils/formatters';
import './History.css';

export default function History() {
    const { sessions } = useExerciseHistory();
    const [expandedSession, setExpandedSession] = useState(null);
    const [filter, setFilter] = useState('all'); // all, completed, abandoned

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return true;
        return session.status === filter;
    });

    // Group sessions by date
    const groupedSessions = filteredSessions.reduce((groups, session) => {
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

    return (
        <div className="page history">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Workout History</h1>
                    <p className="page-subtitle">
                        {sessions.length} workouts logged
                    </p>
                </header>

                {/* Filters */}
                <div className="filters">
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
                        Completed
                    </button>
                    <button
                        className={`filter-btn ${filter === 'abandoned' ? 'active' : ''}`}
                        onClick={() => setFilter('abandoned')}
                    >
                        Abandoned
                    </button>
                </div>

                {/* Sessions List */}
                {Object.keys(groupedSessions).length > 0 ? (
                    <div className="sessions-grouped">
                        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                            <div key={date} className="date-group">
                                <h3 className="date-header">{date}</h3>
                                <div className="sessions-list">
                                    {dateSessions.map(session => (
                                        <div
                                            key={session.id}
                                            className="session-wrapper"
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
                        <div className="empty-state-icon">📊</div>
                        <h3 className="empty-state-title">No Workouts Yet</h3>
                        <p className="empty-state-text">
                            Complete your first workout to see it here
                        </p>
                        <Link to="/dashboard" className="btn btn-primary">
                            Start a Workout
                        </Link>
                    </div>
                )}

                {/* Stats Summary */}
                {sessions.length > 0 && (
                    <section className="stats-section">
                        <h3 className="section-title">📈 Quick Stats</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-value">{sessions.length}</span>
                                <span className="stat-label">Total Workouts</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">
                                    {sessions.filter(s => s.status === 'completed').length}
                                </span>
                                <span className="stat-label">Completed</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">
                                    {getThisWeekCount(sessions)}
                                </span>
                                <span className="stat-label">This Week</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">
                                    {getStreak(sessions)}
                                </span>
                                <span className="stat-label">Day Streak</span>
                            </div>
                        </div>
                    </section>
                )}
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
            // Allow gap for today
            continue;
        } else {
            break;
        }
    }

    return streak;
}
