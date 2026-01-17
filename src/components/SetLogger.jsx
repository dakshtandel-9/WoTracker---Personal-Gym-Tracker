import { useState, useEffect } from 'react';
import './SetLogger.css';

export default function SetLogger({
    setNumber,
    plannedReps,
    targetWeight,
    lastWeight,
    lastReps,
    existingSet,
    onLog,
    onSkip,
    onFail,
}) {
    const defaultWeight = existingSet?.weight || targetWeight || lastWeight || 0;
    const defaultReps = existingSet?.reps || plannedReps || lastReps || 10;

    const [weight, setWeight] = useState(defaultWeight);
    const [reps, setReps] = useState(defaultReps);

    // Update when switching sets
    useEffect(() => {
        setWeight(existingSet?.weight || targetWeight || lastWeight || 0);
        setReps(existingSet?.reps || plannedReps || lastReps || 10);
    }, [setNumber, existingSet, targetWeight, lastWeight, plannedReps, lastReps]);

    const adjustWeight = (delta) => {
        setWeight(prev => Math.max(0, prev + delta));
    };

    const adjustReps = (delta) => {
        setReps(prev => Math.max(0, prev + delta));
    };

    const handleLog = () => {
        onLog(weight, reps);
    };

    const handleSkip = () => {
        onSkip();
    };

    const handleFail = () => {
        onFail(weight, reps);
    };

    const isCompleted = existingSet?.status === 'completed';
    const isSkipped = existingSet?.status === 'skipped';
    const isFailed = existingSet?.status === 'failed';

    return (
        <div className={`set-logger ${existingSet ? 'logged' : ''}`}>
            <div className="set-header">
                <span className="set-number">Set {setNumber}</span>
                {existingSet && (
                    <span className={`set-status badge badge-${isCompleted ? 'success' : isSkipped ? 'warning' : 'danger'
                        }`}>
                        {existingSet.status}
                    </span>
                )}
            </div>

            <div className="set-inputs">
                <div className="input-group">
                    <label className="input-label">Weight (kg)</label>
                    <div className="input-with-buttons">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => adjustWeight(-2.5)}
                        >
                            -2.5
                        </button>
                        <input
                            type="number"
                            className="form-input form-input-lg"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            min="0"
                            step="0.5"
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => adjustWeight(2.5)}
                        >
                            +2.5
                        </button>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Reps</label>
                    <div className="input-with-buttons">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => adjustReps(-1)}
                        >
                            -1
                        </button>
                        <input
                            type="number"
                            className="form-input form-input-lg"
                            value={reps}
                            onChange={(e) => setReps(Number(e.target.value))}
                            min="0"
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => adjustReps(1)}
                        >
                            +1
                        </button>
                    </div>
                </div>
            </div>

            <div className="set-actions">
                <button
                    className="btn btn-success btn-lg"
                    onClick={handleLog}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Log Set
                </button>
                <button
                    className="btn btn-warning"
                    onClick={handleSkip}
                >
                    Skip
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleFail}
                >
                    Fail
                </button>
            </div>
        </div>
    );
}
