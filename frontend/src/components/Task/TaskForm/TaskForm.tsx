import { useState, type FormEvent } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import { TaskFormSkeleton } from './TaskForm.skeleton';
import './TaskForm.css';

export default function TaskForm() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const { addTask, loadTasks, loading, error } = useTasks();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        try {
            await addTask({ title: title.trim(), description: description.trim() });
            setTitle("");
            setDescription("");
            // This will trigger re-render in TaskList automatically!
            loadTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // Show skeleton while creating
    if (loading.create) {
        return <TaskFormSkeleton />;
    }

    return (
        <form onSubmit={submitForm} className="task-form">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading.create}
                required
                className={error ? 'error' : ''}
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading.create}
                rows={3}
            />

            {error && <div className="error-message">{error}</div>}

            <button
                type="submit"
                disabled={loading.create || !title.trim()}
                className={loading.create ? 'loading' : ''}
                aria-label={loading.create ? "Adding task..." : "Add task"}
            >
                {loading.create ? (
                    <>
                        <span className="spinner" data-testid="spinner"></span>
                    </>
                ) : 'Add'}
            </button>
        </form>
    );
}