import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import ProgressIndicator from '../components/ProgressIndicator';
import { formatDate, formatWeight } from '../utils/formatters';
import './ExerciseProgress.css';

export default function ExerciseProgress() {
    const { getAllExerciseNames, getExerciseStats, getHistory } = useExerciseHistory();
    const exerciseNames = getAllExerciseNames();
    const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0] || '');

    const stats = selectedExercise ? getExerciseStats(selectedExercise) : null;
    const history = selectedExercise ? getHistory(selectedExercise) : [];

    return (
        <div className="page exercise-progress">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Exercise Progress</h1>
                    <p className="page-subtitle">Track your gains over time</p>
                </header>

                {exerciseNames.length > 0 ? (
                    <>
                        {/* Exercise Selector */}
                        <div className="form-group">
                            <label className="form-label">Select Exercise</label>
                            <select
                                className="form-input exercise-select"
                                value={selectedExercise}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                            >
                                {exerciseNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        {stats && (
                            <>
                                {/* Stats Overview */}
                                <section className="stats-overview">
                                    <div className="stat-card primary">
                                        <span className="stat-label">Personal Best</span>
                                        <span className="stat-value">
                                            {stats.personalBest
                                                ? `${formatWeight(stats.personalBest.weight)} × ${stats.personalBest.reps}`
                                                : '—'
                                            }
                                        </span>
                                        {stats.personalBest?.date && (
                                            <span className="stat-date">
                                                {formatDate(stats.personalBest.date)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="stats-row">
                                        <div className="stat-card">
                                            <span className="stat-label">Sessions</span>
                                            <span className="stat-value">{stats.totalSessions}</span>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-label">Trend</span>
                                            <ProgressIndicator trend={stats.trend} />
                                        </div>
                                    </div>
                                </section>

                                {/* Last Performance */}
                                {stats.lastPerformance && (
                                    <section className="last-performance">
                                        <h3 className="section-title">Last Performance</h3>
                                        <div className="performance-card">
                                            <div className="performance-header">
                                                <span className="performance-weight">
                                                    {formatWeight(stats.lastPerformance.weight)}
                                                </span>
                                                <span className="performance-date">
                                                    {formatDate(stats.lastPerformance.date, { relative: true })}
                                                </span>
                                            </div>
                                            <div className="performance-sets">
                                                {stats.lastPerformance.sets.map((set, idx) => (
                                                    <span key={idx} className={`set-badge ${set.status}`}>
                                                        {set.status === 'skipped'
                                                            ? '—'
                                                            : `${set.weight}×${set.reps}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* History */}
                                {history.length > 0 && (
                                    <section className="history-section">
                                        <h3 className="section-title">History</h3>
                                        <div className="history-list">
                                            {history.slice(0, 10).map((entry, idx) => {
                                                const maxWeight = Math.max(...entry.sets
                                                    .filter(s => s.status !== 'skipped')
                                                    .map(s => s.weight)
                                                );
                                                const maxReps = entry.sets[0]?.reps || 0;

                                                return (
                                                    <div key={idx} className="history-entry">
                                                        <div className="entry-date">
                                                            <span className="date-main">
                                                                {formatDate(entry.date)}
                                                            </span>
                                                            <span className="date-day">{entry.dayName}</span>
                                                        </div>
                                                        <div className="entry-data">
                                                            <span className="entry-weight">
                                                                {formatWeight(maxWeight)}
                                                            </span>
                                                            <span className="entry-sets">
                                                                {entry.sets.length} sets
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📈</div>
                        <h3 className="empty-state-title">No Data Yet</h3>
                        <p className="empty-state-text">
                            Complete some workouts to see your progress
                        </p>
                        <Link to="/" className="btn btn-primary">
                            Start a Workout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
