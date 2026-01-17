import { useWorkout } from '../context/WorkoutContext';
import { generateId } from '../lib/database';

export function useWorkoutPlans() {
    const {
        state,
        actions,
        getActivePlan,
        getPlanById,
        addPlan,
        updatePlan: contextUpdatePlan,
        removePlan,
        setActivePlanId,
    } = useWorkout();

    const createPlan = async (name, description = '') => {
        const plan = await addPlan({ name, description });
        return plan;
    };

    const updatePlan = async (plan) => {
        await contextUpdatePlan(plan);
    };

    const deletePlan = async (planId) => {
        await removePlan(planId);
    };

    const setActivePlan = async (planId) => {
        await setActivePlanId(planId);
    };

    const addDayToPlan = async (planId, dayName) => {
        const plan = getPlanById(planId);
        if (!plan) return null;

        const newDay = {
            id: generateId(),
            dayNumber: plan.days.length + 1,
            name: dayName,
            exercises: [],
        };

        const updatedPlan = {
            ...plan,
            days: [...plan.days, newDay],
        };

        await contextUpdatePlan(updatedPlan);
        return newDay;
    };

    const updateDay = async (planId, dayId, updates) => {
        const plan = getPlanById(planId);
        if (!plan) return;

        const updatedPlan = {
            ...plan,
            days: plan.days.map(day =>
                day.id === dayId ? { ...day, ...updates } : day
            ),
        };

        await contextUpdatePlan(updatedPlan);
    };

    const deleteDay = async (planId, dayId) => {
        const plan = getPlanById(planId);
        if (!plan) return;

        const updatedPlan = {
            ...plan,
            days: plan.days
                .filter(day => day.id !== dayId)
                .map((day, index) => ({ ...day, dayNumber: index + 1 })),
        };

        await contextUpdatePlan(updatedPlan);
    };

    const addExerciseToDay = async (planId, dayId, exerciseData) => {
        const plan = getPlanById(planId);
        if (!plan) return null;

        const newExercise = {
            id: generateId(),
            name: exerciseData.name || '',
            plannedSets: exerciseData.plannedSets || 3,
            plannedReps: exerciseData.plannedReps || 0,
            targetReps: exerciseData.targetReps || null,
            notes: exerciseData.notes || '',
        };

        const updatedPlan = {
            ...plan,
            days: plan.days.map(day =>
                day.id === dayId
                    ? { ...day, exercises: [...day.exercises, newExercise] }
                    : day
            ),
        };

        await contextUpdatePlan(updatedPlan);
        return newExercise;
    };

    const updateExercise = async (planId, dayId, exerciseId, updates) => {
        const plan = getPlanById(planId);
        if (!plan) return;

        const updatedPlan = {
            ...plan,
            days: plan.days.map(day =>
                day.id === dayId
                    ? {
                        ...day,
                        exercises: day.exercises.map(ex =>
                            ex.id === exerciseId ? { ...ex, ...updates } : ex
                        ),
                    }
                    : day
            ),
        };

        await contextUpdatePlan(updatedPlan);
    };

    const deleteExercise = async (planId, dayId, exerciseId) => {
        const plan = getPlanById(planId);
        if (!plan) return;

        const updatedPlan = {
            ...plan,
            days: plan.days.map(day =>
                day.id === dayId
                    ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) }
                    : day
            ),
        };

        await contextUpdatePlan(updatedPlan);
    };

    const reorderExercises = async (planId, dayId, exercises) => {
        const plan = getPlanById(planId);
        if (!plan) return;

        const updatedPlan = {
            ...plan,
            days: plan.days.map(day =>
                day.id === dayId ? { ...day, exercises } : day
            ),
        };

        await contextUpdatePlan(updatedPlan);
    };

    return {
        plans: state.plans,
        activePlan: getActivePlan(),
        activePlanId: state.activePlanId,
        getPlanById,
        createPlan,
        updatePlan,
        deletePlan,
        setActivePlan,
        addDayToPlan,
        updateDay,
        deleteDay,
        addExerciseToDay,
        updateExercise,
        deleteExercise,
        reorderExercises,
    };
}
