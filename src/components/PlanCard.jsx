import { Link } from 'react-router-dom';
import { pluralize } from '../utils/formatters';
import './PlanCard.css';

export default function PlanCard({ plan, isActive, onSetActive, onDelete }) {
    const dayCount = plan.days.length;
    const exerciseCount = plan.days.reduce((acc, day) => acc + day.exercises.length, 0);

    return (
        <div className={`plan-card ${isActive ? 'active' : ''}`}>
            <div className="plan-card-header">
                <div className="plan-card-info">
                    <h3 className="plan-card-title">{plan.name}</h3>
                    {plan.description && (
                        <p className="plan-card-description">{plan.description}</p>
                    )}
                </div>
                {isActive && <span className="badge badge-primary">Active</span>}
            </div>

            <div className="plan-card-stats">
                <div className="stat">
                    <span className="stat-value">{dayCount}</span>
                    <span className="stat-label">{pluralize(dayCount, 'Day')}</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{exerciseCount}</span>
                    <span className="stat-label">{pluralize(exerciseCount, 'Exercise')}</span>
                </div>
            </div>

            <div className="plan-card-actions">
                <Link to={`/plans/${plan.id}`} className="btn btn-secondary">
                    Edit
                </Link>
                {!isActive && (
                    <button
                        className="btn btn-primary"
                        onClick={() => onSetActive(plan.id)}
                    >
                        Set Active
                    </button>
                )}
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => onDelete(plan.id)}
                    title="Delete plan"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
