import { useWorkout } from '../context/WorkoutContext';
import { generateId } from '../lib/database';

export function useWorkoutSession() {
    const {
        state,
        getDayById,
        startSession: contextStartSession,
        updateSession: contextUpdateSession,
        completeSession: contextCompleteSession,
        abandonSession: contextAbandonSession,
        logSet: contextLogSet,
    } = useWorkout();

    const createSetLog = (setNumber, weight = 0, reps = 0) => ({
        id: generateId(),
        setNumber,
        weight,
        reps,
        status: 'completed',
        timestamp: new Date().toISOString(),
    });

    const createExerciseLog = (exercise) => ({
        id: generateId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        plannedSets: exercise.plannedSets,
        plannedReps: exercise.plannedReps,
        targetWeight: exercise.targetWeight,
        sets: [],
        completed: false,
    });

    const startSession = async (dayId) => {
        const result = getDayById(dayId);
        if (!result) return null;

        const { day, plan } = result;

        const session = {
            id: generateId(),
            dayId,
            dayName: day.name,
            planName: plan.name,
            startedAt: new Date().toISOString(),
            completedAt: null,
            status: 'in_progress',
            exerciseLogs: day.exercises.map(exercise => createExerciseLog(exercise)),
            notes: '',
        };

        await contextStartSession(session);
        return session;
    };

    const logSet = async (exerciseLogId, setNumber, weight, reps, status = 'completed') => {
        const setData = createSetLog(setNumber, weight, reps);
        setData.status = status;

        await contextLogSet(exerciseLogId, setData);
    };

    const skipSet = async (exerciseLogId, setNumber) => {
        const setData = createSetLog(setNumber, 0, 0);
        setData.status = 'skipped';

        await contextLogSet(exerciseLogId, setData);
    };

    const failSet = async (exerciseLogId, setNumber, weight, reps) => {
        const setData = createSetLog(setNumber, weight, reps);
        setData.status = 'failed';

        await contextLogSet(exerciseLogId, setData);
    };

    const updateSessionNotes = async (notes) => {
        if (!state.activeSession) return;

        await contextUpdateSession({ ...state.activeSession, notes });
    };

    const completeSession = async () => {
        await contextCompleteSession();
    };

    const abandonSession = async () => {
        await contextAbandonSession();
    };

    const getExerciseLogByIndex = (index) => {
        if (!state.activeSession) return null;
        return state.activeSession.exerciseLogs[index] || null;
    };

    const getSetByNumber = (exerciseLogId, setNumber) => {
        if (!state.activeSession) return null;

        const exerciseLog = state.activeSession.exerciseLogs.find(
            log => log.id === exerciseLogId
        );

        if (!exerciseLog) return null;
        return exerciseLog.sets.find(set => set.setNumber === setNumber) || null;
    };

    const isSessionActive = () => {
        return state.activeSession !== null && state.activeSession.status === 'in_progress';
    };

    return {
        activeSession: state.activeSession,
        isSessionActive: isSessionActive(),
        startSession,
        logSet,
        skipSet,
        failSet,
        updateSessionNotes,
        completeSession,
        abandonSession,
        getExerciseLogByIndex,
        getSetByNumber,
    };
}
