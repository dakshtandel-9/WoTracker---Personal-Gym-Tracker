import { Link } from 'react-router-dom';
import { formatDate, formatSessionDuration, pluralize } from '../utils/formatters';
import { calculateSessionCompletion } from '../utils/calculations';
import './SessionCard.css';

export default function SessionCard({ session, expanded = false }) {
    const completion = calculateSessionCompletion(session);
    const exerciseCount = session.exerciseLogs?.length || 0;

    return (
        <div className={`session-card ${session.status}`}>
            <div className="session-header">
                <div className="session-date">
                    <span className="date-main">{formatDate(session.completedAt || session.startedAt)}</span>
                    <span className="date-time">{formatSessionDuration(session)}</span>
                </div>
                <span className={`badge badge-${session.status === 'completed' ? 'success' : 'warning'}`}>
                    {session.status === 'completed' ? `${completion}%` : 'Abandoned'}
                </span>
            </div>

            <div className="session-info">
                <h4 className="session-day">{session.dayName || 'Workout'}</h4>
                <span className="session-plan">{session.planName}</span>
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

            {!expanded && (
                <div className="session-summary">
                    {exerciseCount} {pluralize(exerciseCount, 'exercise')}
                </div>
            )}
        </div>
    );
}
