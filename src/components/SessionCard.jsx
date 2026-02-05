import { formatDate, formatSessionDuration, pluralize } from '../utils/formatters';
import { calculateSessionCompletion } from '../utils/calculations';
import './SessionCard.css';

export default function SessionCard({ session, expanded = false }) {
    const completion = calculateSessionCompletion(session);
    const exerciseCount = session.exerciseLogs?.length || 0;

    return (
        <div className={`session-card ${session.status} ${expanded ? 'expanded' : ''}`}>
            <div className="session-card-left">
                <div className={`session-status-indicator ${session.status}`}>
                    {session.status === 'completed' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    )}
                </div>
                <div className="session-timeline">
                    <div className="timeline-line-vertical" />
                </div>
            </div>

            <div className="session-card-content">
                <div className="session-card-header">
                    <div className="session-info">
                        <h4 className="session-day">{session.dayName || 'Workout'}</h4>
                        <span className="session-plan">{session.planName}</span>
                    </div>
                    <div className="session-badges">
                        <span className={`badge badge-${session.status === 'completed' ? 'success' : 'warning'}`}>
                            {session.status === 'completed' ? `${completion}%` : 'Abandoned'}
                        </span>
                        <div className="session-rating">
                            <span className="rating-star">⭐</span>
                            <span>{(4 + Math.random()).toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="session-time-row">
                    <div className="session-time">
                        <div className="time-block">
                            <span className="time-value">
                                {formatDate(session.startedAt, { timeOnly: true })}
                            </span>
                            <span className="time-label">Started</span>
                        </div>
                        <div className="time-duration">
                            <span className="duration-line" />
                            <span className="duration-value">{formatSessionDuration(session)}</span>
                            <span className="duration-line" />
                        </div>
                        <div className="time-block">
                            <span className="time-value">
                                {session.completedAt ? formatDate(session.completedAt, { timeOnly: true }) : '--:--'}
                            </span>
                            <span className="time-label">Ended</span>
                        </div>
                    </div>
                    <div className="session-date">
                        {formatDate(session.completedAt || session.startedAt)}
                    </div>
                </div>

                {expanded && session.exerciseLogs && (
                    <div className="session-exercises">
                        {session.exerciseLogs.map(log => (
                            <div key={log.id} className="exercise-log">
                                <span className="exercise-name">{log.exerciseName}</span>
                                <div className="exercise-sets">
                                    {log.sets.map((set, idx) => (
                                        <span
                                            key={set.id}
                                            className={`set-badge ${set.status}`}
                                            title={`Set ${idx + 1}: ${set.weight}kg × ${set.reps}`}
                                        >
                                            {set.status === 'skipped' ? '—' : `${set.weight}×${set.reps}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="session-card-footer">
                    <div className="session-facilities">
                        <span className="facility-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                            </svg>
                            {exerciseCount} {pluralize(exerciseCount, 'exercise')}
                        </span>
                        {completion === 100 && (
                            <span className="facility-badge success">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Full Complete
                            </span>
                        )}
                    </div>
                    <button className="expand-hint">
                        {expanded ? 'Less' : 'Details'}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
