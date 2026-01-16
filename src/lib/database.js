// Supabase Database Functions
import { supabase } from './supabaseClient';

// ===== WORKOUT PLANS =====

export async function fetchPlans(userId) {
    const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching plans:', error);
        return [];
    }

    // Transform from DB format to app format
    return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        days: plan.days || [],
        isActive: plan.is_active,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
    }));
}

export async function savePlan(plan, userId) {
    const { data, error } = await supabase
        .from('workout_plans')
        .upsert({
            id: plan.id,
            user_id: userId,
            name: plan.name,
            description: plan.description,
            days: plan.days,
            is_active: plan.isActive || false,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving plan:', error);
        return null;
    }

    return data;
}

export async function deletePlan(planId) {
    const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId);

    if (error) {
        console.error('Error deleting plan:', error);
        return false;
    }
    return true;
}

export async function setActivePlan(planId, userId) {
    // First, deactivate all plans for this user
    await supabase
        .from('workout_plans')
        .update({ is_active: false })
        .eq('user_id', userId);

    // Then activate the selected plan
    if (planId) {
        await supabase
            .from('workout_plans')
            .update({ is_active: true })
            .eq('id', planId);
    }
}

export async function getActivePlan(userId) {
    const { data } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

    return data?.id || null;
}

// ===== WORKOUT SESSIONS =====

export async function fetchSessions(userId) {
    const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

    if (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }

    return data.map(session => ({
        id: session.id,
        dayId: session.day_id,
        dayName: session.day_name,
        planName: session.plan_name,
        startedAt: session.started_at,
        completedAt: session.completed_at,
        status: session.status,
        exerciseLogs: session.exercise_logs || [],
        notes: session.notes || '',
    }));
}

export async function saveSession(session, userId) {
    const { data, error } = await supabase
        .from('workout_sessions')
        .upsert({
            id: session.id,
            user_id: userId,
            day_id: session.dayId,
            day_name: session.dayName,
            plan_name: session.planName,
            started_at: session.startedAt,
            completed_at: session.completedAt,
            status: session.status,
            exercise_logs: session.exerciseLogs,
            notes: session.notes,
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving session:', error);
        return null;
    }

    return data;
}

export async function getActiveSession(userId) {
    const { data } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'in_progress')
        .single();

    if (!data) return null;

    return {
        id: data.id,
        dayId: data.day_id,
        dayName: data.day_name,
        planName: data.plan_name,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        status: data.status,
        exerciseLogs: data.exercise_logs || [],
        notes: data.notes || '',
    };
}

// ===== USER SETTINGS =====

export async function fetchSettings(userId) {
    const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!data) {
        return {
            weightUnit: 'kg',
            restTimerDefault: 90,
            showRestTimer: true,
        };
    }

    return {
        weightUnit: data.weight_unit,
        restTimerDefault: data.rest_timer_default,
        showRestTimer: data.show_rest_timer,
    };
}

export async function saveSettings(settings, userId) {
    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: userId,
            weight_unit: settings.weightUnit,
            rest_timer_default: settings.restTimerDefault,
            show_rest_timer: settings.showRestTimer,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error('Error saving settings:', error);
    }
}

// ===== HELPER =====
export function generateId() {
    return crypto.randomUUID();
}
