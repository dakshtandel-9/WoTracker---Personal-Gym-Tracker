import { useWorkout } from '../context/WorkoutContext';
import { getPersonalBest, getLastPerformance, getTrend, getMaxWeight } from '../utils/calculations';

export function useExerciseHistory() {
    const { state, getExerciseHistory } = useWorkout();

    const getHistory = (exerciseName) => {
        return getExerciseHistory(exerciseName);
    };

    const getPersonalBestForExercise = (exerciseName) => {
        const history = getExerciseHistory(exerciseName);
        return getPersonalBest(history);
    };

    const getLastPerformanceForExercise = (exerciseName) => {
        const history = getExerciseHistory(exerciseName);
        return getLastPerformance(history);
    };

    const getTrendForExercise = (exerciseName) => {
        const history = getExerciseHistory(exerciseName);
        return getTrend(history);
    };

    // Get all exercise names from both plans AND sessions
    const getAllExerciseNames = () => {
        const names = new Set();

        // From plans - exercises the user has defined
        state.plans.forEach(plan => {
            plan.days.forEach(day => {
                day.exercises.forEach(exercise => {
                    if (exercise.name) {
                        names.add(exercise.name);
                    }
                });
            });
        });

        // Also from sessions - includes swapped/new exercises
        state.sessions.forEach(session => {
            session.exerciseLogs?.forEach(log => {
                if (log.exerciseName) {
                    names.add(log.exerciseName);
                }
            });
        });

        return Array.from(names).sort();
    };

    const getExerciseStats = (exerciseName) => {
        const history = getExerciseHistory(exerciseName);

        if (history.length === 0) {
            return {
                totalSessions: 0,
                personalBest: null,
                lastPerformance: null,
                trend: 'stable',
            };
        }

        return {
            totalSessions: history.length,
            personalBest: getPersonalBest(history),
            lastPerformance: getLastPerformance(history),
            trend: getTrend(history),
        };
    };

    return {
        sessions: state.sessions,
        getHistory,
        getPersonalBestForExercise,
        getLastPerformanceForExercise,
        getTrendForExercise,
        getAllExerciseNames,
        getExerciseStats,
    };
}
