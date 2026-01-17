import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import ExerciseForm from '../components/ExerciseForm';
import { formatExerciseTarget } from '../utils/formatters';
import './PlanEditor.css';

export default function PlanEditor() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const {
        getPlanById,
        updatePlan,
        addDayToPlan,
        updateDay,
        deleteDay,
        addExerciseToDay,
        updateExercise,
        deleteExercise,
        reorderExercises,
    } = useWorkoutPlans();

    const plan = getPlanById(planId);
    const [editingPlanName, setEditingPlanName] = useState(false);
    const [planName, setPlanName] = useState(plan?.name || '');
    const [addingDayName, setAddingDayName] = useState('');
    const [showAddDay, setShowAddDay] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null); // { dayId, exercise }
    const [addingExerciseToDay, setAddingExerciseToDay] = useState(null);
    const [draggedExercise, setDraggedExercise] = useState(null); // { dayId, index }

    if (!plan) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <h3 className="empty-state-title">Plan Not Found</h3>
                        <Link to="/plans" className="btn btn-primary">Back to Plans</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSavePlanName = () => {
        if (planName.trim()) {
            updatePlan({ ...plan, name: planName.trim() });
        }
        setEditingPlanName(false);
    };

    const handleAddDay = () => {
        if (!addingDayName.trim()) return;
        addDayToPlan(planId, addingDayName.trim());
        setAddingDayName('');
        setShowAddDay(false);
    };

    const handleDeleteDay = (dayId) => {
        if (window.confirm('Delete this day and all its exercises?')) {
            deleteDay(planId, dayId);
        }
    };

    const handleSaveExercise = (dayId, exerciseData) => {
        if (editingExercise) {
            updateExercise(planId, dayId, editingExercise.exercise.id, exerciseData);
            setEditingExercise(null);
        } else {
            addExerciseToDay(planId, dayId, exerciseData);
            setAddingExerciseToDay(null);
        }
    };

    const handleDeleteExercise = (dayId, exerciseId) => {
        deleteExercise(planId, dayId, exerciseId);
        setEditingExercise(null);
    };

    // Drag and drop handlers
    const handleDragStart = (dayId, index) => {
        setDraggedExercise({ dayId, index });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dayId, dropIndex) => {
        if (!draggedExercise || draggedExercise.dayId !== dayId) {
            setDraggedExercise(null);
            return;
        }

        const { index: dragIndex } = draggedExercise;
        if (dragIndex === dropIndex) {
            setDraggedExercise(null);
            return;
        }

        const day = plan.days.find(d => d.id === dayId);
        if (!day) return;

        const newExercises = [...day.exercises];
        const [movedExercise] = newExercises.splice(dragIndex, 1);
        newExercises.splice(dropIndex, 0, movedExercise);

        reorderExercises(planId, dayId, newExercises);
        setDraggedExercise(null);
    };

    const handleDragEnd = () => {
        setDraggedExercise(null);
    };

    return (
        <div className="page plan-editor">
            <div className="container">
                {/* Plan Header */}
                <header className="plan-header">
                    {editingPlanName ? (
                        <div className="plan-name-edit">
                            <input
                                type="text"
                                className="form-input"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                autoFocus
                                onBlur={handleSavePlanName}
                                onKeyDown={(e) => e.key === 'Enter' && handleSavePlanName()}
                            />
                        </div>
                    ) : (
                        <h1
                            className="page-title editable"
                            onClick={() => {
                                setPlanName(plan.name);
                                setEditingPlanName(true);
                            }}
                        >
                            {plan.name || 'Untitled Plan'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </h1>
                    )}
                    <p className="page-subtitle">
                        {plan.days.length} days • {plan.days.reduce((acc, d) => acc + d.exercises.length, 0)} exercises
                    </p>
                </header>

                {/* Days */}
                <div className="days-list">
                    {plan.days.map((day) => (
                        <div key={day.id} className="day-block card">
                            <div className="day-header">
                                <div className="day-info">
                                    <span className="day-number">Day {day.dayNumber}</span>
                                    <h3 className="day-name">{day.name || `Day ${day.dayNumber}`}</h3>
                                </div>
                                <button
                                    className="btn btn-ghost btn-icon btn-sm"
                                    onClick={() => handleDeleteDay(day.id)}
                                    title="Delete day"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                            </div>

                            {/* Exercises */}
                            <div className="exercises-list">
                                {day.exercises.map((exercise, idx) => (
                                    <div
                                        key={exercise.id}
                                        className={`exercise-item ${draggedExercise?.dayId === day.id && draggedExercise?.index === idx ? 'dragging' : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(day.id, idx)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(day.id, idx)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="drag-handle" title="Drag to reorder">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="8" y1="6" x2="16" y2="6" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                <line x1="8" y1="18" x2="16" y2="18" />
                                            </svg>
                                        </div>
                                        <span className="exercise-number">{idx + 1}</span>
                                        <div
                                            className="exercise-info"
                                            onClick={() => setEditingExercise({ dayId: day.id, exercise })}
                                        >
                                            <span className="exercise-name">{exercise.name}</span>
                                            <span className="exercise-target">{formatExerciseTarget(exercise)}</span>
                                        </div>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => setEditingExercise({ dayId: day.id, exercise })}>
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                ))}

                                {day.exercises.length === 0 && addingExerciseToDay !== day.id && (
                                    <p className="no-exercises">No exercises yet</p>
                                )}
                            </div>

                            {/* Add/Edit Exercise Form */}
                            {(addingExerciseToDay === day.id || editingExercise?.dayId === day.id) && (
                                <ExerciseForm
                                    exercise={editingExercise?.exercise}
                                    onSave={(data) => handleSaveExercise(day.id, data)}
                                    onCancel={() => {
                                        setAddingExerciseToDay(null);
                                        setEditingExercise(null);
                                    }}
                                    onDelete={editingExercise ? (id) => handleDeleteExercise(day.id, id) : null}
                                />
                            )}

                            {/* Add Exercise Button */}
                            {addingExerciseToDay !== day.id && !editingExercise && (
                                <button
                                    className="btn btn-secondary add-exercise-btn"
                                    onClick={() => setAddingExerciseToDay(day.id)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Add Exercise
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Day */}
                {showAddDay ? (
                    <div className="add-day-form card animate-fadeIn">
                        <input
                            type="text"
                            className="form-input"
                            value={addingDayName}
                            onChange={(e) => setAddingDayName(e.target.value)}
                            placeholder="Day name (e.g., Push Day)"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAddDay()}
                        />
                        <div className="form-actions">
                            <button className="btn btn-ghost" onClick={() => setShowAddDay(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAddDay}
                                disabled={!addingDayName.trim()}
                            >
                                Add Day
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="btn btn-secondary add-day-btn"
                        onClick={() => setShowAddDay(true)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Workout Day
                    </button>
                )}

                {/* Done Button */}
                <div className="done-actions">
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                        Done Editing
                    </Link>
                </div>
            </div>
        </div>
    );
}
