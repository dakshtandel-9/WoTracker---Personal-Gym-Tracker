import { Link, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import DayCard from '../components/DayCard';
import SessionCard from '../components/SessionCard';
import { formatDate } from '../utils/formatters';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { activePlan, plans } = useWorkoutPlans();
    const { startSession, isSessionActive, activeSession } = useWorkoutSession();
    const { sessions } = useExerciseHistory();

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

    // Get last performed date for each day
    const getLastPerformedForDay = (dayId) => {
        const session = sessions.find(s => s.dayId === dayId);
        return session ? formatDate(session.completedAt || session.startedAt, { relative: true }) : null;
    };

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
                        <span className="banner-action">Continue →</span>
                    </Link>
                )}

                {/* Welcome Section */}
                <section className="welcome-section">
                    <h1 className="page-title">
                        {getGreeting()}, <span className="accent">Lifter</span> 💪
                    </h1>
                    <p className="page-subtitle">Ready to crush today's workout?</p>
                </section>

                {/* Active Plan Section */}
                {activePlan ? (
                    <section className="section">
                        <div className="section-header">
                            <h2 className="section-title">
                                📋 {activePlan.name}
                            </h2>
                            <Link to="/plans" className="btn btn-ghost btn-sm">
                                Change Plan
                            </Link>
                        </div>

                        <div className="days-grid">
                            {activePlan.days.map(day => (
                                <DayCard
                                    key={day.id}
                                    day={day}
                                    planId={activePlan.id}
                                    onStartWorkout={handleStartWorkout}
                                    lastPerformed={getLastPerformedForDay(day.id)}
                                />
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
                        <div className="empty-state">
                            <div className="empty-state-icon">🏋️</div>
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

                {/* Recent Workouts */}
                {recentSessions.length > 0 && (
                    <section className="section">
                        <div className="section-header">
                            <h2 className="section-title">📊 Recent Workouts</h2>
                            <Link to="/history" className="btn btn-ghost btn-sm">
                                View All
                            </Link>
                        </div>

                        <div className="sessions-list">
                            {recentSessions.map(session => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Quick Actions */}
                <section className="quick-actions">
                    <Link to="/plans" className="quick-action">
                        <span className="action-icon">📋</span>
                        <span className="action-label">Plans</span>
                    </Link>
                    <Link to="/history" className="quick-action">
                        <span className="action-icon">📈</span>
                        <span className="action-label">History</span>
                    </Link>
                    <Link to="/progress" className="quick-action">
                        <span className="action-icon">🏆</span>
                        <span className="action-label">Progress</span>
                    </Link>
                </section>
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
