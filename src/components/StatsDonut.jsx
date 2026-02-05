import './StatsDonut.css';

export default function StatsDonut({
    value = 75,
    total = 100,
    label = 'Complete',
    segments = null,
    size = 140
}) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.round((value / total) * 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Default colors
    const defaultColors = {
        primary: '#1a73e8',
        secondary: '#00c853',
        tertiary: '#ff9800'
    };

    // If segments are provided, render multi-segment donut
    if (segments && segments.length > 0) {
        let accumulatedOffset = 0;

        return (
            <div className="stats-donut-container">
                <div className="stats-donut" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 120 120" width={size} height={size}>
                        {/* Background circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="10"
                        />
                        {/* Segment circles */}
                        {segments.map((segment, index) => {
                            const segmentPercentage = (segment.value / total) * 100;
                            const segmentDasharray = circumference;
                            const segmentLength = (segmentPercentage / 100) * circumference;
                            const offset = circumference - accumulatedOffset - segmentLength;

                            accumulatedOffset += segmentLength;

                            return (
                                <circle
                                    key={index}
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="10"
                                    strokeDasharray={`${segmentLength} ${segmentDasharray - segmentLength}`}
                                    strokeDashoffset={circumference / 4 - (accumulatedOffset - segmentLength)}
                                    strokeLinecap="round"
                                    className="donut-segment"
                                    style={{
                                        '--delay': `${index * 100}ms`,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                />
                            );
                        })}
                    </svg>
                    <div className="stats-donut-center">
                        <div className="stats-donut-value">{percentage}%</div>
                        <div className="stats-donut-label">{label}</div>
                    </div>
                </div>
                {segments && (
                    <div className="stats-donut-legend">
                        {segments.map((segment, index) => (
                            <div key={index} className="legend-item">
                                <span
                                    className="legend-dot"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span>{segment.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Simple single-segment donut
    return (
        <div className="stats-donut-container">
            <div className="stats-donut" style={{ width: size, height: size }}>
                <svg viewBox="0 0 120 120" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={defaultColors.primary}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="donut-progress"
                    />
                </svg>
                <div className="stats-donut-center">
                    <div className="stats-donut-value">{percentage}%</div>
                    <div className="stats-donut-label">{label}</div>
                </div>
            </div>
        </div>
    );
}
