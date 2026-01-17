import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import { formatExerciseTarget, formatDate, formatWeight } from '../utils/formatters';
import './DayView.css';

export default function DayView() {
    const { planId, dayId } = useParams();
    const navigate = useNavigate();
    const { getPlanById } = useWorkoutPlans();
    const { startSession, isSessionActive } = useWorkoutSession();
    const { getLastPerformanceForExercise } = useExerciseHistory();

    const plan = getPlanById(planId);
    const day = plan?.days.find(d => d.id === dayId);

    if (!plan || !day) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <h3 className="empty-state-title">Day Not Found</h3>
                        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleStartWorkout = () => {
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

    return (
        <div className="page day-view">
            <div className="container">
                {/* Header */}
                <header className="day-header">
                    <span className="day-label">Day {day.dayNumber}</span>
                    <h1 className="page-title">{day.name || `Day ${day.dayNumber}`}</h1>
                    <p className="page-subtitle">{plan.name}</p>
                </header>

                {/* Exercises List */}
                <section className="exercises-section">
                    <h2 className="section-title">
                        Exercises ({day.exercises.length})
                    </h2>

                    {day.exercises.length > 0 ? (
                        <div className="exercises-list">
                            {day.exercises.map((exercise, index) => {
                                const lastPerformance = getLastPerformanceForExercise(exercise.name);

                                return (
                                    <div key={exercise.id} className="exercise-card">
                                        <div className="exercise-header">
                                            <span className="exercise-number">{index + 1}</span>
                                            <div className="exercise-main">
                                                <h3 className="exercise-name">{exercise.name}</h3>
                                                <span className="exercise-target">
                                                    {formatExerciseTarget(exercise)}
                                                </span>
                                            </div>
                                        </div>

                                        {lastPerformance && (
                                            <div className="exercise-last">
                                                <span className="last-label">Last time:</span>
                                                <span className="last-value">
                                                    {formatWeight(lastPerformance.weight)} × {lastPerformance.sets[0]?.reps || '—'}
                                                </span>
                                            </div>
                                        )}

                                        {exercise.notes && (
                                            <p className="exercise-notes">{exercise.notes}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">No exercises added to this day</p>
                            <Link to={`/plans/${planId}`} className="btn btn-secondary">
                                Edit Plan
                            </Link>
                        </div>
                    )}
                </section>

                {/* Start Workout Button */}
                {day.exercises.length > 0 && (
                    <div className="start-workout-section">
                        <button
                            className="btn btn-primary btn-lg start-btn"
                            onClick={handleStartWorkout}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Start Workout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
