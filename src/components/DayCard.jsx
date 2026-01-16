import { Link } from 'react-router-dom';
import { pluralize } from '../utils/formatters';
import './DayCard.css';

export default function DayCard({ day, planId, onStartWorkout, lastPerformed }) {
    const exerciseCount = day.exercises.length;

    return (
        <div className="day-card">
            <div className="day-card-header">
                <div className="day-number">Day {day.dayNumber}</div>
                <h3 className="day-name">{day.name || `Day ${day.dayNumber}`}</h3>
            </div>

            <div className="day-card-meta">
                <span className="exercise-count">
                    {exerciseCount} {pluralize(exerciseCount, 'exercise')}
                </span>
                {lastPerformed && (
                    <span className="last-performed">
                        Last: {lastPerformed}
                    </span>
                )}
            </div>

            <div className="day-exercises">
                {day.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={exercise.id} className="exercise-preview">
                        {exercise.name}
                    </div>
                ))}
                {exerciseCount > 3 && (
                    <div className="exercise-preview more">
                        +{exerciseCount - 3} more
                    </div>
                )}
            </div>

            <div className="day-card-actions">
                <Link
                    to={`/plans/${planId}/days/${day.id}`}
                    className="btn btn-secondary"
                >
                    View
                </Link>
                <button
                    className="btn btn-primary"
                    onClick={() => onStartWorkout(day.id)}
                    disabled={exerciseCount === 0}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start
                </button>
            </div>
        </div>
    );
}
