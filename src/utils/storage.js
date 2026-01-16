// LocalStorage keys - now user-specific
const getStorageKeys = (userId) => ({
  PLANS: `wotracker_${userId}_plans`,
  SESSIONS: `wotracker_${userId}_sessions`,
  ACTIVE_PLAN: `wotracker_${userId}_active_plan`,
  ACTIVE_SESSION: `wotracker_${userId}_active_session`,
  SETTINGS: `wotracker_${userId}_settings`,
});

// For backwards compatibility, keep the old keys
const STORAGE_KEYS = {
  PLANS: 'wotracker_plans',
  SESSIONS: 'wotracker_sessions',
  ACTIVE_PLAN: 'wotracker_active_plan',
  ACTIVE_SESSION: 'wotracker_active_session',
  SETTINGS: 'wotracker_settings',
};

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Load data from localStorage
 */
export function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return null;
  }
}

/**
 * Save data to localStorage
 */
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
}

/**
 * Remove data from localStorage
 */
export function removeData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
}

// ===== WORKOUT PLANS (USER-SPECIFIC) =====

export function loadPlans(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return loadData(keys.PLANS) || [];
}

export function savePlans(plans, userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return saveData(keys.PLANS, plans);
}

export function getActivePlanId(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return loadData(keys.ACTIVE_PLAN);
}

export function setActivePlanId(planId, userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return saveData(keys.ACTIVE_PLAN, planId);
}

// ===== WORKOUT SESSIONS (USER-SPECIFIC) =====

export function loadSessions(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return loadData(keys.SESSIONS) || [];
}

export function saveSessions(sessions, userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return saveData(keys.SESSIONS, sessions);
}

export function getActiveSession(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return loadData(keys.ACTIVE_SESSION);
}

export function setActiveSession(session, userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return saveData(keys.ACTIVE_SESSION, session);
}

export function clearActiveSession(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return removeData(keys.ACTIVE_SESSION);
}

// ===== SETTINGS (USER-SPECIFIC) =====

export function loadSettings(userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return loadData(keys.SETTINGS) || {
    weightUnit: 'kg',
    restTimerDefault: 90,
    showRestTimer: true,
  };
}

export function saveSettings(settings, userId) {
  const keys = userId ? getStorageKeys(userId) : STORAGE_KEYS;
  return saveData(keys.SETTINGS, settings);
}

// ===== INITIAL DATA =====

export function createInitialPlan() {
  return {
    id: generateId(),
    name: '',
    description: '',
    days: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createDay(dayNumber) {
  return {
    id: generateId(),
    dayNumber,
    name: '',
    exercises: [],
  };
}

export function createExercise() {
  return {
    id: generateId(),
    name: '',
    plannedSets: 3,
    plannedReps: 10,
    targetWeight: null,
    notes: '',
  };
}

export function createSession(dayId, dayName, planName) {
  return {
    id: generateId(),
    dayId,
    dayName,
    planName,
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: 'in_progress',
    exerciseLogs: [],
    notes: '',
  };
}

export function createExerciseLog(exercise) {
  return {
    id: generateId(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    plannedSets: exercise.plannedSets,
    plannedReps: exercise.plannedReps,
    targetWeight: exercise.targetWeight,
    sets: [],
    completed: false,
  };
}

export function createSetLog(setNumber, weight = 0, reps = 0) {
  return {
    id: generateId(),
    setNumber,
    weight,
    reps,
    status: 'completed', // completed, partial, failed, skipped
    timestamp: new Date().toISOString(),
  };
}

export { STORAGE_KEYS };
