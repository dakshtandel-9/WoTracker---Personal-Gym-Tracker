import { useState, useEffect, useRef } from 'react';
import { formatTimer } from '../utils/formatters';
import './RestTimer.css';

export default function RestTimer({ duration = 90, onComplete, autoStart = true }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            onComplete?.();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, onComplete]);

    const reset = () => {
        setTimeLeft(duration);
        setIsRunning(true);
    };

    const toggle = () => {
        setIsRunning(prev => !prev);
    };

    const skip = () => {
        setTimeLeft(0);
        setIsRunning(false);
        onComplete?.();
    };

    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <div className={`rest-timer ${timeLeft === 0 ? 'complete' : ''}`}>
            <div className="timer-circle">
                <svg className="timer-svg" viewBox="0 0 100 100">
                    <circle
                        className="timer-track"
                        cx="50"
                        cy="50"
                        r="45"
                    />
                    <circle
                        className="timer-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        style={{
                            strokeDashoffset: 283 - (283 * progress) / 100
                        }}
                    />
                </svg>
                <div className="timer-display">
                    <span className="timer-value">{formatTimer(timeLeft)}</span>
                    <span className="timer-label">Rest</span>
                </div>
            </div>

            <div className="timer-actions">
                <button className="btn btn-ghost btn-sm" onClick={reset}>
                    Reset
                </button>
                <button className="btn btn-secondary btn-sm" onClick={toggle}>
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={skip}>
                    Skip
                </button>
            </div>
        </div>
    );
}
