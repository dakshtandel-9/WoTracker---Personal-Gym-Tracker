import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    fetchPlans,
    savePlan,
    deletePlan as dbDeletePlan,
    setActivePlan as dbSetActivePlan,
    getActivePlan,
    fetchSessions,
    saveSession,
    getActiveSession,
    fetchSettings,
    saveSettings as dbSaveSettings,
    generateId,
} from '../lib/database';

// Initial state
const initialState = {
    plans: [],
    sessions: [],
    activePlanId: null,
    activeSession: null,
    settings: {
        weightUnit: 'kg',
        restTimerDefault: 90,
        showRestTimer: true,
    },
    isLoading: true,
    userId: null,
};

// Action types
const ACTIONS = {
    INIT_DATA: 'INIT_DATA',
    RESET_DATA: 'RESET_DATA',
    SET_LOADING: 'SET_LOADING',
    // Plans
    SET_PLANS: 'SET_PLANS',
    ADD_PLAN: 'ADD_PLAN',
    UPDATE_PLAN: 'UPDATE_PLAN',
    DELETE_PLAN: 'DELETE_PLAN',
    SET_ACTIVE_PLAN: 'SET_ACTIVE_PLAN',
    // Sessions
    SET_SESSIONS: 'SET_SESSIONS',
    START_SESSION: 'START_SESSION',
    UPDATE_SESSION: 'UPDATE_SESSION',
    COMPLETE_SESSION: 'COMPLETE_SESSION',
    ABANDON_SESSION: 'ABANDON_SESSION',
    LOG_SET: 'LOG_SET',
    // Settings
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
};

// Reducer
function workoutReducer(state, action) {
    switch (action.type) {
        case ACTIONS.INIT_DATA:
            return {
                ...state,
                plans: action.payload.plans,
                sessions: action.payload.sessions,
                activePlanId: action.payload.activePlanId,
                activeSession: action.payload.activeSession,
                settings: action.payload.settings,
                userId: action.payload.userId,
                isLoading: false,
            };

        case ACTIONS.RESET_DATA:
            return { ...initialState, isLoading: false };

        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.SET_PLANS:
            return { ...state, plans: action.payload };

        case ACTIONS.ADD_PLAN:
            return { ...state, plans: [...state.plans, action.payload] };

        case ACTIONS.UPDATE_PLAN:
            return {
                ...state,
                plans: state.plans.map(plan =>
                    plan.id === action.payload.id ? action.payload : plan
                ),
            };

        case ACTIONS.DELETE_PLAN:
            return {
                ...state,
                plans: state.plans.filter(plan => plan.id !== action.payload),
                activePlanId: state.activePlanId === action.payload ? null : state.activePlanId,
            };

        case ACTIONS.SET_ACTIVE_PLAN:
            return { ...state, activePlanId: action.payload };

        case ACTIONS.SET_SESSIONS:
            return { ...state, sessions: action.payload };

        case ACTIONS.START_SESSION:
            return { ...state, activeSession: action.payload };

        case ACTIONS.UPDATE_SESSION:
            return { ...state, activeSession: action.payload };

        case ACTIONS.COMPLETE_SESSION:
            return {
                ...state,
                sessions: [action.payload, ...state.sessions],
                activeSession: null,
            };

        case ACTIONS.ABANDON_SESSION:
            return {
                ...state,
                sessions: [action.payload, ...state.sessions],
                activeSession: null,
            };

        case ACTIONS.LOG_SET: {
            const { exerciseLogId, setData } = action.payload;
            return {
                ...state,
                activeSession: {
                    ...state.activeSession,
                    exerciseLogs: state.activeSession.exerciseLogs.map(log =>
                        log.id === exerciseLogId
                            ? {
                                ...log,
                                sets: [...log.sets.filter(s => s.setNumber !== setData.setNumber), setData]
                                    .sort((a, b) => a.setNumber - b.setNumber),
                            }
                            : log
                    ),
                },
            };
        }

        case ACTIONS.UPDATE_SETTINGS:
            return { ...state, settings: { ...state.settings, ...action.payload } };

        default:
            return state;
    }
}

// Context
const WorkoutContext = createContext(null);

// Provider
export function WorkoutProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id;

    const [state, dispatch] = useReducer(workoutReducer, initialState);

    // Load data when user changes
    useEffect(() => {
        async function loadData() {
            if (userId) {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });

                const [plans, sessions, activePlanId, activeSession, settings] = await Promise.all([
                    fetchPlans(userId),
                    fetchSessions(userId),
                    getActivePlan(userId),
                    getActiveSession(userId),
                    fetchSettings(userId),
                ]);

                dispatch({
                    type: ACTIONS.INIT_DATA,
                    payload: { plans, sessions, activePlanId, activeSession, settings, userId },
                });
            } else {
                dispatch({ type: ACTIONS.RESET_DATA });
            }
        }
        loadData();
    }, [userId]);

    // Async action creators
    const addPlan = useCallback(async (planData) => {
        const newPlan = {
            id: generateId(),
            name: planData.name,
            description: planData.description || '',
            days: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        dispatch({ type: ACTIONS.ADD_PLAN, payload: newPlan });
        await savePlan(newPlan, userId);
        return newPlan;
    }, [userId]);

    const updatePlan = useCallback(async (plan) => {
        const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
        dispatch({ type: ACTIONS.UPDATE_PLAN, payload: updatedPlan });
        await savePlan(updatedPlan, userId);
    }, [userId]);

    const removePlan = useCallback(async (planId) => {
        dispatch({ type: ACTIONS.DELETE_PLAN, payload: planId });
        await dbDeletePlan(planId);
    }, []);

    const setActivePlanId = useCallback(async (planId) => {
        dispatch({ type: ACTIONS.SET_ACTIVE_PLAN, payload: planId });
        await dbSetActivePlan(planId, userId);
    }, [userId]);

    const startSession = useCallback(async (session) => {
        dispatch({ type: ACTIONS.START_SESSION, payload: session });
        await saveSession(session, userId);
    }, [userId]);

    const updateSession = useCallback(async (session) => {
        dispatch({ type: ACTIONS.UPDATE_SESSION, payload: session });
        await saveSession(session, userId);
    }, [userId]);

    const completeSession = useCallback(async () => {
        const completedSession = {
            ...state.activeSession,
            completedAt: new Date().toISOString(),
            status: 'completed',
        };
        dispatch({ type: ACTIONS.COMPLETE_SESSION, payload: completedSession });
        await saveSession(completedSession, userId);
    }, [state.activeSession, userId]);

    const abandonSession = useCallback(async () => {
        const abandonedSession = {
            ...state.activeSession,
            completedAt: new Date().toISOString(),
            status: 'abandoned',
        };
        dispatch({ type: ACTIONS.ABANDON_SESSION, payload: abandonedSession });
        await saveSession(abandonedSession, userId);
    }, [state.activeSession, userId]);

    const logSet = useCallback(async (exerciseLogId, setData) => {
        dispatch({ type: ACTIONS.LOG_SET, payload: { exerciseLogId, setData } });
        // Save the updated session
        const updatedSession = {
            ...state.activeSession,
            exerciseLogs: state.activeSession.exerciseLogs.map(log =>
                log.id === exerciseLogId
                    ? {
                        ...log,
                        sets: [...log.sets.filter(s => s.setNumber !== setData.setNumber), setData]
                            .sort((a, b) => a.setNumber - b.setNumber),
                    }
                    : log
            ),
        };
        await saveSession(updatedSession, userId);
    }, [state.activeSession, userId]);

    const updateSettings = useCallback(async (newSettings) => {
        dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: newSettings });
        await dbSaveSettings({ ...state.settings, ...newSettings }, userId);
    }, [state.settings, userId]);

    // Context value
    const value = {
        state,
        dispatch,
        actions: ACTIONS,
        // Async actions
        addPlan,
        updatePlan,
        removePlan,
        setActivePlanId,
        startSession,
        updateSession,
        completeSession,
        abandonSession,
        logSet,
        updateSettings,
        // Helper methods
        getActivePlan: () => state.plans.find(p => p.id === state.activePlanId) || null,
        getPlanById: (id) => state.plans.find(p => p.id === id) || null,
        getDayById: (dayId) => {
            for (const plan of state.plans) {
                const day = plan.days.find(d => d.id === dayId);
                if (day) return { day, plan };
            }
            return null;
        },
        getExerciseHistory: (exerciseName) => {
            const history = [];
            state.sessions
                .filter(s => s.status === 'completed')
                .forEach(session => {
                    session.exerciseLogs.forEach(log => {
                        if (log.exerciseName.toLowerCase() === exerciseName.toLowerCase()) {
                            history.push({
                                date: session.completedAt,
                                dayName: session.dayName,
                                sets: log.sets,
                            });
                        }
                    });
                });
            return history;
        },
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
}

// Hook
export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
}

export { ACTIONS };
