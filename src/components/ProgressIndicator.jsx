import './ProgressIndicator.css';

export default function ProgressIndicator({ trend }) {
    const getIcon = () => {
        switch (trend) {
            case 'up':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                );
            case 'down':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                );
            default:
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                    </svg>
                );
        }
    };

    const getLabel = () => {
        switch (trend) {
            case 'up':
                return 'Improving';
            case 'down':
                return 'Declining';
            default:
                return 'Stable';
        }
    };

    return (
        <div className={`progress-indicator ${trend}`}>
            {getIcon()}
            <span className="progress-label">{getLabel()}</span>
        </div>
    );
}
