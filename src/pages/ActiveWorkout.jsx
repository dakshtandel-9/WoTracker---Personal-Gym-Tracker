import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import { useWorkout } from '../context/WorkoutContext';
import SetLogger from '../components/SetLogger';
import RestTimer from '../components/RestTimer';
import { formatExerciseTarget, formatWeight, formatSessionDuration } from '../utils/formatters';
import './ActiveWorkout.css';

export default function ActiveWorkout() {
    const navigate = useNavigate();
    const {
        activeSession,
        isSessionActive,
        logSet,
        skipSet,
        failSet,
        completeSession,
        abandonSession,
    } = useWorkoutSession();
    const { getLastPerformanceForExercise, getAllExerciseNames } = useExerciseHistory();
    const { updateSession } = useWorkout();

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [swapExerciseName, setSwapExerciseName] = useState('');

    // Timer for elapsed time
    useEffect(() => {
        if (!activeSession) return;

        const startTime = new Date(activeSession.startedAt).getTime();
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    // Reset set number when changing exercise
    useEffect(() => {
        if (activeSession) {
            const currentLog = activeSession.exerciseLogs[currentExerciseIndex];
            if (currentLog) {
                // Find the next unlogged set
                const loggedSets = currentLog.sets.map(s => s.setNumber);
                for (let i = 1; i <= currentLog.plannedSets; i++) {
                    if (!loggedSets.includes(i)) {
                        setCurrentSetNumber(i);
                        return;
                    }
                }
                // All sets logged, stay on last
                setCurrentSetNumber(currentLog.plannedSets);
            }
        }
    }, [currentExerciseIndex, activeSession]);

    if (!isSessionActive || !activeSession) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">🏋️</div>
                        <h3 className="empty-state-title">No Active Workout</h3>
                        <p className="empty-state-text">Start a workout from the dashboard</p>
                        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const exerciseLogs = activeSession.exerciseLogs;
    const currentLog = exerciseLogs[currentExerciseIndex];
    const lastPerformance = getLastPerformanceForExercise(currentLog.exerciseName);

    const existingSet = currentLog.sets.find(s => s.setNumber === currentSetNumber);
    const completedSetsCount = currentLog.sets.filter(s => s.status !== 'skipped').length;
    const isExerciseComplete = currentLog.sets.length >= currentLog.plannedSets;

    const handleLogSet = (weight, reps) => {
        logSet(currentLog.id, currentSetNumber, weight, reps, 'completed');
        setShowRestTimer(true);

        // Move to next set or exercise
        if (currentSetNumber < currentLog.plannedSets) {
            setCurrentSetNumber(prev => prev + 1);
        }
    };

    const handleSkipSet = () => {
        skipSet(currentLog.id, currentSetNumber);

        if (currentSetNumber < currentLog.plannedSets) {
            setCurrentSetNumber(prev => prev + 1);
        }
    };

    const handleFailSet = (weight, reps) => {
        failSet(currentLog.id, currentSetNumber, weight, reps);
        setShowRestTimer(true);

        if (currentSetNumber < currentLog.plannedSets) {
            setCurrentSetNumber(prev => prev + 1);
        }
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < exerciseLogs.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentSetNumber(1);
            setShowRestTimer(false);
        }
    };

    const handlePrevExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            setCurrentSetNumber(1);
            setShowRestTimer(false);
        }
    };

    const handleComplete = () => {
        if (window.confirm('Complete this workout?')) {
            completeSession();
            navigate('/');
        }
    };

    const handleAbandon = () => {
        if (window.confirm('Abandon this workout? Your progress will be saved.')) {
            abandonSession();
            navigate('/');
        }
    };

    // Swap exercise for today only
    const handleSwapExercise = (newExerciseName) => {
        if (!newExerciseName.trim()) return;

        // Update the exercise name in the current session (doesn't change the plan)
        const updatedLogs = [...activeSession.exerciseLogs];
        updatedLogs[currentExerciseIndex] = {
            ...updatedLogs[currentExerciseIndex],
            exerciseName: newExerciseName.trim(),
        };

        // Update session in context
        updateSession({
            ...activeSession,
            exerciseLogs: updatedLogs,
        });

        setShowSwapModal(false);
        setSwapExerciseName('');
    };

    const totalSets = exerciseLogs.reduce((acc, log) => acc + log.plannedSets, 0);
    const completedTotal = exerciseLogs.reduce((acc, log) =>
        acc + log.sets.filter(s => s.status !== 'skipped').length, 0);
    const progressPercent = (completedTotal / totalSets) * 100;

    return (
        <div className="page active-workout">
            <div className="container">
                {/* Workout Header */}
                <header className="workout-header">
                    <div className="workout-info">
                        <h1 className="workout-day">{activeSession.dayName}</h1>
                        <span className="workout-time">{formatSessionDuration({ startedAt: activeSession.startedAt })}</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={handleAbandon}>
                        End
                    </button>
                </header>

                {/* Progress Bar */}
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="progress-text">
                    {completedTotal} / {totalSets} sets completed
                </p>

                {/* Exercise Navigation */}
                <div className="exercise-nav">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={handlePrevExercise}
                        disabled={currentExerciseIndex === 0}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="exercise-indicator">
                        {currentExerciseIndex + 1} / {exerciseLogs.length}
                    </div>

                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={handleNextExercise}
                        disabled={currentExerciseIndex === exerciseLogs.length - 1}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Current Exercise */}
                <section className="current-exercise animate-fadeIn" key={currentLog.id}>
                    <div className="exercise-header-card">
                        <div className="exercise-header-top">
                            <h2 className="exercise-name">{currentLog.exerciseName}</h2>
                            <button
                                className="btn-swap"
                                onClick={() => {
                                    setSwapExerciseName(currentLog.exerciseName);
                                    setShowSwapModal(true);
                                }}
                                title="Swap exercise for today"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 3l4 4-4 4" />
                                    <path d="M20 7H4" />
                                    <path d="M8 21l-4-4 4-4" />
                                    <path d="M4 17h16" />
                                </svg>
                            </button>
                        </div>
                        <p className="exercise-target">
                            Target: {formatExerciseTarget({
                                plannedSets: currentLog.plannedSets,
                                targetReps: currentLog.targetReps,
                                plannedReps: currentLog.plannedReps,
                            })}
                        </p>
                        {lastPerformance && (
                            <p className="exercise-last">
                                Last: {formatWeight(lastPerformance.weight)} × {lastPerformance.sets[0]?.reps || '—'}
                            </p>
                        )}
                    </div>

                    {/* Swap Exercise Modal */}
                    {showSwapModal && (
                        <div className="swap-modal-overlay" onClick={() => setShowSwapModal(false)}>
                            <div className="swap-modal" onClick={e => e.stopPropagation()}>
                                <h3>Swap Exercise</h3>
                                <p className="swap-modal-hint">Replace "{currentLog.exerciseName}" for today only</p>

                                <div className="autocomplete-container">
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={swapExerciseName}
                                        onChange={(e) => setSwapExerciseName(e.target.value)}
                                        placeholder="Type to search exercises..."
                                        autoFocus
                                    />
                                    {swapExerciseName && (
                                        <div className="autocomplete-dropdown">
                                            {getAllExerciseNames()
                                                .filter(name =>
                                                    name.toLowerCase() !== currentLog.exerciseName.toLowerCase() &&
                                                    name.toLowerCase().includes(swapExerciseName.toLowerCase())
                                                )
                                                .slice(0, 8)
                                                .map(name => (
                                                    <button
                                                        key={name}
                                                        className="autocomplete-item"
                                                        onClick={() => {
                                                            setSwapExerciseName(name);
                                                        }}
                                                    >
                                                        {name}
                                                    </button>
                                                ))}
                                            {getAllExerciseNames()
                                                .filter(name =>
                                                    name.toLowerCase() !== currentLog.exerciseName.toLowerCase() &&
                                                    name.toLowerCase().includes(swapExerciseName.toLowerCase())
                                                ).length === 0 && (
                                                    <div className="autocomplete-new">
                                                        <span>+ Add as new: "{swapExerciseName}"</span>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                <div className="swap-actions">
                                    <button className="btn btn-ghost" onClick={() => setShowSwapModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSwapExercise(swapExerciseName)}
                                        disabled={!swapExerciseName.trim()}
                                    >
                                        Swap
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sets Overview */}
                    <div className="sets-overview">
                        {Array.from({ length: currentLog.plannedSets }, (_, i) => {
                            const set = currentLog.sets.find(s => s.setNumber === i + 1);
                            const isActive = currentSetNumber === i + 1;

                            return (
                                <button
                                    key={i}
                                    className={`set-dot ${set?.status || ''} ${isActive ? 'active' : ''}`}
                                    onClick={() => setCurrentSetNumber(i + 1)}
                                    title={set ? `${set.weight}kg × ${set.reps}` : `Set ${i + 1}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Rest Timer */}
                    {showRestTimer && (
                        <RestTimer
                            duration={90}
                            onComplete={() => setShowRestTimer(false)}
                            autoStart={true}
                        />
                    )}

                    {/* Set Logger */}
                    {!showRestTimer && (
                        <SetLogger
                            setNumber={currentSetNumber}
                            plannedReps={currentLog.plannedReps}
                            targetWeight={currentLog.targetWeight}
                            lastWeight={lastPerformance?.weight}
                            lastReps={lastPerformance?.sets[0]?.reps}
                            existingSet={existingSet}
                            onLog={handleLogSet}
                            onSkip={handleSkipSet}
                            onFail={handleFailSet}
                        />
                    )}

                    {/* Logged Sets Summary */}
                    {currentLog.sets.length > 0 && (
                        <div className="logged-sets">
                            <h4>Logged Sets</h4>
                            <div className="sets-list">
                                {currentLog.sets
                                    .sort((a, b) => a.setNumber - b.setNumber)
                                    .map(set => (
                                        <div key={set.id} className={`logged-set ${set.status}`}>
                                            <span className="set-num">Set {set.setNumber}</span>
                                            <span className="set-data">
                                                {set.status === 'skipped'
                                                    ? 'Skipped'
                                                    : `${set.weight}kg × ${set.reps}`}
                                            </span>
                                            <button
                                                className="btn-edit-set"
                                                onClick={() => {
                                                    setCurrentSetNumber(set.setNumber);
                                                    setShowRestTimer(false);
                                                }}
                                                title="Edit this set"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <span className={`set-badge ${set.status}`}>
                                                {set.status === 'completed' ? '✓' : set.status === 'skipped' ? '—' : '✗'}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Exercise Quick Nav */}
                <section className="exercise-list-mini">
                    {exerciseLogs.map((log, idx) => {
                        const loggedCount = log.sets.filter(s => s.status !== 'skipped').length;
                        const isComplete = log.sets.length >= log.plannedSets;

                        return (
                            <button
                                key={log.id}
                                className={`exercise-mini ${idx === currentExerciseIndex ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                                onClick={() => {
                                    setCurrentExerciseIndex(idx);
                                    setShowRestTimer(false);
                                }}
                            >
                                <span className="mini-name">{log.exerciseName}</span>
                                <span className="mini-progress">{loggedCount}/{log.plannedSets}</span>
                            </button>
                        );
                    })}
                </section>

                {/* Complete Button */}
                <div className="complete-section">
                    <button
                        className="btn btn-success btn-lg complete-btn"
                        onClick={handleComplete}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Complete Workout
                    </button>
                </div>
            </div>
        </div>
    );
}
