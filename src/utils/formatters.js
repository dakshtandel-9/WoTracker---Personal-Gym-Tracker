/**
 * Format a timestamp to a readable date
 */
export function formatDate(timestamp, options = {}) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (options.relative) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: diffDays > 365 ? 'numeric' : undefined,
        ...options,
    });
}

/**
 * Format time (HH:MM)
 */
export function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format a duration in milliseconds
 */
export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

/**
 * Format weight with unit
 */
export function formatWeight(weight, unit = 'kg') {
    if (!weight || weight === 0) return '—';
    return `${weight}${unit}`;
}

/**
 * Format sets × reps
 */
export function formatSetsReps(sets, reps) {
    return `${sets} × ${reps}`;
}

/**
 * Format exercise target
 */
export function formatExerciseTarget(exercise) {
    let target = formatSetsReps(exercise.plannedSets, exercise.plannedReps);
    if (exercise.targetWeight) {
        target += ` @ ${formatWeight(exercise.targetWeight)}`;
    }
    return target;
}

/**
 * Format session duration
 */
export function formatSessionDuration(session) {
    if (!session.startedAt) return '—';

    const start = new Date(session.startedAt);
    const end = session.completedAt ? new Date(session.completedAt) : new Date();
    const duration = end - start;

    return formatDuration(duration);
}

/**
 * Format timer display (MM:SS)
 */
export function formatTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Pluralize a word
 */
export function pluralize(count, singular, plural) {
    return count === 1 ? singular : (plural || singular + 's');
}

/**
 * Format number with suffix (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
