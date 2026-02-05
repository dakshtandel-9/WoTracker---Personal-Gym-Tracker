import { Link } from 'react-router-dom';
import { pluralize } from '../utils/formatters';
import './DayCard.css';

export default function DayCard({ day, planId, onStartWorkout, lastPerformed }) {
    const exerciseCount = day.exercises.length;

    return (
        <div className="day-card animate-fadeIn">
            <div className="day-card-left">
                <div className="day-badge">
                    <span className="day-badge-number">Day {day.dayNumber}</span>
                </div>
                <div className="day-timeline">
                    <div className="timeline-dot start" />
                    <div className="timeline-line" />
                    <div className="timeline-dot end" />
                </div>
            </div>

            <div className="day-card-content">
                <div className="day-card-header">
                    <div className="day-info">
                        <h3 className="day-name">{day.name || `Day ${day.dayNumber}`}</h3>
                        <div className="day-meta">
                            <span className="exercise-count">
                                {exerciseCount} {pluralize(exerciseCount, 'exercise')}
                            </span>
                            {lastPerformed && (
                                <>
                                    <span className="meta-dot">•</span>
                                    <span className="last-performed">Last: {lastPerformed}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="day-rating">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">4.8</span>
                    </div>
                </div>

                <div className="day-exercises">
                    {day.exercises.slice(0, 4).map((exercise, index) => (
                        <span key={exercise.id} className="exercise-pill">
                            {exercise.name}
                        </span>
                    ))}
                    {exerciseCount > 4 && (
                        <span className="exercise-pill more">+{exerciseCount - 4}</span>
                    )}
                </div>

                <div className="day-card-footer">
                    <div className="day-facilities">
                        <span className="facility-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            ~45 min
                        </span>
                        <span className="facility-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" />
                                <line x1="10" y1="1" x2="10" y2="4" />
                                <line x1="14" y1="1" x2="14" y2="4" />
                            </svg>
                            Intermediate
                        </span>
                    </div>

                    <div className="day-card-actions">
                        <Link
                            to={`/plans/${planId}/days/${day.id}`}
                            className="btn btn-secondary btn-sm"
                        >
                            View
                        </Link>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onStartWorkout(day.id)}
                            disabled={exerciseCount === 0}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Start Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
