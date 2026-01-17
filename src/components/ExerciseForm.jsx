import { useState } from 'react';
import './ExerciseForm.css';

export default function ExerciseForm({ exercise, onSave, onCancel, onDelete }) {
    const [formData, setFormData] = useState({
        name: exercise?.name || '',
        plannedSets: exercise?.plannedSets || 3,
        plannedReps: exercise?.plannedReps || 0, // Default to 0
        targetReps: exercise?.targetReps || '', // Rep range like "6-8"
        notes: exercise?.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        onSave({
            ...formData,
            targetReps: formData.targetReps.trim() || null,
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form className="exercise-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Bench Press"
                    autoFocus
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Sets</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.plannedSets}
                        onChange={(e) => handleChange('plannedSets', Number(e.target.value))}
                        min="1"
                        max="20"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Target Reps</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.targetReps}
                        onChange={(e) => handleChange('targetReps', e.target.value)}
                        placeholder="e.g., 6-8 or 12"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="e.g., Pause at bottom"
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
                {exercise && onDelete && (
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(exercise.id)}
                    >
                        Delete
                    </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={!formData.name.trim()}>
                    {exercise ? 'Update' : 'Add Exercise'}
                </button>
            </div>
        </form>
    );
}
