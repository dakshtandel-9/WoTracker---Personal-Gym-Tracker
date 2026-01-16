import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import PlanCard from '../components/PlanCard';
import './PlanManager.css';

export default function PlanManager() {
    const navigate = useNavigate();
    const {
        plans,
        activePlanId,
        createPlan,
        deletePlan,
        setActivePlan,
        addDayToPlan,
        addExerciseToDay,
    } = useWorkoutPlans();

    const [isCreating, setIsCreating] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanDescription, setNewPlanDescription] = useState('');

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        if (!newPlanName.trim()) return;

        const plan = await createPlan(newPlanName.trim(), newPlanDescription.trim());
        setNewPlanName('');
        setNewPlanDescription('');
        setIsCreating(false);

        // Navigate to edit the new plan
        if (plan) {
            navigate(`/plans/${plan.id}`);
        }
    };

    const handleDeletePlan = async (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            await deletePlan(planId);
        }
    };

    const handleSetActive = async (planId) => {
        await setActivePlan(planId);
    };

    const createPrebuiltPlan = async (planType) => {
        if (planType === '4day') {
            const plan = await createPlan('4-Day Split', 'Chest/Back/Shoulders/Legs priority program');
            if (!plan) return;

            // Day 1 - Chest + Triceps
            const day1 = await addDayToPlan(plan.id, 'Day 1 - Chest + Triceps');
            await addExerciseToDay(plan.id, day1.id, { name: 'Incline Smith Machine Press', plannedSets: 4, plannedReps: 8, targetWeight: 60, notes: '3 sec down, 1 sec pause' });
            await addExerciseToDay(plan.id, day1.id, { name: 'Incline Dumbbell Press', plannedSets: 3, plannedReps: 10, targetWeight: 30 });
            await addExerciseToDay(plan.id, day1.id, { name: 'Low-to-High Cable Fly', plannedSets: 4, plannedReps: 15, notes: '2 sec squeeze at top' });
            await addExerciseToDay(plan.id, day1.id, { name: 'Overhead Cable Extension', plannedSets: 3, plannedReps: 15 });
            await addExerciseToDay(plan.id, day1.id, { name: 'Rope Pushdown', plannedSets: 3, plannedReps: 12, notes: 'Slow negatives' });
            await addExerciseToDay(plan.id, day1.id, { name: 'Cable Lateral Raise', plannedSets: 4, plannedReps: 20, notes: 'Light weight' });

            // Day 2 - Back + Biceps
            const day2 = await addDayToPlan(plan.id, 'Day 2 - Back + Biceps');
            await addExerciseToDay(plan.id, day2.id, { name: 'Pull-ups', plannedSets: 4, plannedReps: 8, notes: 'Chest to bar' });
            await addExerciseToDay(plan.id, day2.id, { name: 'Wide-Grip Lat Pulldown', plannedSets: 4, plannedReps: 12 });
            await addExerciseToDay(plan.id, day2.id, { name: 'Single-Arm Lat Pulldown', plannedSets: 3, plannedReps: 12, notes: 'Each side' });
            await addExerciseToDay(plan.id, day2.id, { name: 'Chest-Supported Row', plannedSets: 3, plannedReps: 12 });
            await addExerciseToDay(plan.id, day2.id, { name: 'Incline DB Curl', plannedSets: 3, plannedReps: 12 });
            await addExerciseToDay(plan.id, day2.id, { name: 'Cable Curl', plannedSets: 2, plannedReps: 15 });

            // Day 3 - Shoulders + Abs
            const day3 = await addDayToPlan(plan.id, 'Day 3 - Shoulders + Abs');
            await addExerciseToDay(plan.id, day3.id, { name: 'Seated DB Shoulder Press', plannedSets: 4, plannedReps: 8 });
            await addExerciseToDay(plan.id, day3.id, { name: 'Cable Lateral Raise', plannedSets: 4, plannedReps: 20 });
            await addExerciseToDay(plan.id, day3.id, { name: 'DB Lateral Raise Partials', plannedSets: 3, plannedReps: 25, notes: 'Top half only' });
            await addExerciseToDay(plan.id, day3.id, { name: 'Rear Delt Fly', plannedSets: 3, plannedReps: 20 });
            await addExerciseToDay(plan.id, day3.id, { name: 'Pec Deck', plannedSets: 3, plannedReps: 15, notes: 'Pump only' });
            await addExerciseToDay(plan.id, day3.id, { name: 'Hanging Leg Raises', plannedSets: 4, plannedReps: 12 });
            await addExerciseToDay(plan.id, day3.id, { name: 'Cable Crunch', plannedSets: 3, plannedReps: 15 });

            // Day 4 - Legs + Back
            const day4 = await addDayToPlan(plan.id, 'Day 4 - Legs + Back');
            await addExerciseToDay(plan.id, day4.id, { name: 'Squat', plannedSets: 4, plannedReps: 10, notes: 'Ass to grass' });
            await addExerciseToDay(plan.id, day4.id, { name: 'Romanian Deadlift', plannedSets: 3, plannedReps: 10 });
            await addExerciseToDay(plan.id, day4.id, { name: 'Walking Lunges', plannedSets: 3, plannedReps: 20, notes: 'Total steps' });
            await addExerciseToDay(plan.id, day4.id, { name: 'Leg Curl', plannedSets: 3, plannedReps: 15 });
            await addExerciseToDay(plan.id, day4.id, { name: 'Standing Calf Raise', plannedSets: 5, plannedReps: 20, notes: '2 sec pause' });
            await addExerciseToDay(plan.id, day4.id, { name: 'Straight-Arm Pulldown', plannedSets: 3, plannedReps: 15 });

            navigate(`/plans/${plan.id}`);
        } else if (planType === 'ppl') {
            setNewPlanName('Push Pull Legs');
            setNewPlanDescription('Classic 3-day split');
            setIsCreating(true);
        } else if (planType === 'ul') {
            setNewPlanName('Upper Lower');
            setNewPlanDescription('4-day strength program');
            setIsCreating(true);
        }
    };

    return (
        <div className="page plan-manager">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Workout Plans</h1>
                    <p className="page-subtitle">Create and manage your training programs</p>
                </header>

                {/* Create Plan Form */}
                {isCreating ? (
                    <form className="create-plan-form card animate-fadeIn" onSubmit={handleCreatePlan}>
                        <h3>Create New Plan</h3>
                        <div className="form-group">
                            <label className="form-label">Plan Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newPlanName}
                                onChange={(e) => setNewPlanName(e.target.value)}
                                placeholder="e.g., Push Pull Legs"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description (optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newPlanDescription}
                                onChange={(e) => setNewPlanDescription(e.target.value)}
                                placeholder="e.g., 6-day PPL split for hypertrophy"
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!newPlanName.trim()}
                            >
                                Create & Edit
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        className="btn btn-primary btn-lg create-btn"
                        onClick={() => setIsCreating(true)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Create New Plan
                    </button>
                )}

                {/* Plans List */}
                <section className="section">
                    {plans.length > 0 ? (
                        <div className="plans-list">
                            {plans.map(plan => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isActive={plan.id === activePlanId}
                                    onSetActive={handleSetActive}
                                    onDelete={handleDeletePlan}
                                />
                            ))}
                        </div>
                    ) : !isCreating && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h3 className="empty-state-title">No Plans Yet</h3>
                            <p className="empty-state-text">
                                Create your first workout plan to start tracking your progress
                            </p>
                        </div>
                    )}
                </section>

                {/* Sample Plans */}
                {plans.length === 0 && !isCreating && (
                    <section className="section">
                        <h3 className="section-title">💡 Need Inspiration?</h3>
                        <div className="sample-plans">
                            <button
                                className="sample-plan featured"
                                onClick={() => createPrebuiltPlan('4day')}
                            >
                                <span className="sample-name">🔥 4-Day Split (Complete)</span>
                                <span className="sample-desc">Chest/Back/Shoulders/Legs • 27 exercises pre-loaded</span>
                            </button>
                            <button
                                className="sample-plan"
                                onClick={() => createPrebuiltPlan('ppl')}
                            >
                                <span className="sample-name">Push Pull Legs</span>
                                <span className="sample-desc">Classic 3-day split</span>
                            </button>
                            <button
                                className="sample-plan"
                                onClick={() => createPrebuiltPlan('ul')}
                            >
                                <span className="sample-name">Upper Lower</span>
                                <span className="sample-desc">4-day strength program</span>
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
