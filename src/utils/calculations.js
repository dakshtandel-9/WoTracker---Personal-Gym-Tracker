/**
 * Calculate total volume for a set of logged sets
 * Volume = weight × reps (for each set)
 */
export function calculateVolume(sets) {
    return sets.reduce((total, set) => {
        if (set.status === 'skipped') return total;
        return total + (set.weight * set.reps);
    }, 0);
}

/**
 * Calculate total sets completed (excluding skipped)
 */
export function calculateCompletedSets(sets) {
    return sets.filter(set => set.status !== 'skipped').length;
}

/**
 * Calculate total reps across all sets
 */
export function calculateTotalReps(sets) {
    return sets.reduce((total, set) => {
        if (set.status === 'skipped') return total;
        return total + set.reps;
    }, 0);
}

/**
 * Get the highest weight from a list of sets
 */
export function getMaxWeight(sets) {
    const weights = sets
        .filter(set => set.status !== 'skipped' && set.weight > 0)
        .map(set => set.weight);
    return weights.length > 0 ? Math.max(...weights) : 0;
}

/**
 * Get personal best from exercise history
 * Personal best = highest weight × reps combo
 */
export function getPersonalBest(history) {
    let best = { weight: 0, reps: 0, date: null };

    history.forEach(session => {
        session.sets.forEach(set => {
            if (set.status !== 'skipped' && set.weight > best.weight) {
                best = {
                    weight: set.weight,
                    reps: set.reps,
                    date: session.date,
                };
            }
        });
    });

    return best.weight > 0 ? best : null;
}

/**
 * Get last performance for an exercise
 */
export function getLastPerformance(history) {
    if (history.length === 0) return null;

    const lastSession = history[0]; // Assuming sorted by date desc
    const maxWeight = getMaxWeight(lastSession.sets);

    return {
        weight: maxWeight,
        sets: lastSession.sets,
        date: lastSession.date,
    };
}

/**
 * Calculate trend based on recent performances
 * Returns: 'up', 'down', or 'stable'
 */
export function getTrend(history, limit = 5) {
    if (history.length < 2) return 'stable';

    const recent = history.slice(0, limit);
    const weights = recent.map(session => getMaxWeight(session.sets));

    // Simple trend: compare first half avg to second half avg
    const midpoint = Math.floor(weights.length / 2);
    const recentAvg = weights.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint || 0;
    const olderAvg = weights.slice(midpoint).reduce((a, b) => a + b, 0) / (weights.length - midpoint) || 0;

    const diff = recentAvg - olderAvg;
    const threshold = olderAvg * 0.05; // 5% change threshold

    if (diff > threshold) return 'up';
    if (diff < -threshold) return 'down';
    return 'stable';
}

/**
 * Calculate session completion percentage
 */
export function calculateSessionCompletion(session) {
    if (!session.exerciseLogs || session.exerciseLogs.length === 0) return 0;

    let totalPlannedSets = 0;
    let completedSets = 0;

    session.exerciseLogs.forEach(log => {
        totalPlannedSets += log.plannedSets;
        completedSets += log.sets.filter(s => s.status !== 'skipped').length;
    });

    return totalPlannedSets > 0 ? Math.round((completedSets / totalPlannedSets) * 100) : 0;
}

/**
 * Check if this is a new personal record
 */
export function isPersonalRecord(weight, history) {
    const pb = getPersonalBest(history);
    return pb ? weight > pb.weight : weight > 0;
}

/**
 * Get suggested weight based on last performance
 */
export function getSuggestedWeight(lastPerformance, targetWeight) {
    if (targetWeight && targetWeight > 0) return targetWeight;
    if (lastPerformance && lastPerformance.weight > 0) return lastPerformance.weight;
    return 0;
}
