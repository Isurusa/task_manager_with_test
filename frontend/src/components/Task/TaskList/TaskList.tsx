import { useState, useEffect } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import { TaskListSkeleton } from './TaskList.skeleton';
import ConfirmModal from '../../modals/ConfirmModal';
import InfoModal from '../../modals/InfoModal';
import NoTasksIcon from '../../../assets/no_tasks.svg';
import './TaskList.css';

function TaskList() {
    const { tasks, loading, completeTask, loadTasks } = useTasks();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoType, setInfoType] = useState<"success" | "error">("success");
    const [infoMessage, setInfoMessage] = useState("");

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    useEffect(() => {
        const handleRefresh = () => loadTasks();

        window.addEventListener('task:added', handleRefresh);
        window.addEventListener('task:completed', handleRefresh);

        return () => {
            window.removeEventListener('task:added', handleRefresh);
            window.removeEventListener('task:completed', handleRefresh);
        };
    }, [loadTasks]);

    const openConfirm = (id: number) => {
        setSelectedTaskId(id);
        setConfirmOpen(true);
    };

    const confirmDone = async () => {
        if (selectedTaskId == null) return;

        try {
            const res = await completeTask(selectedTaskId);

            if (res?.success) {
                showInfo("success", res.message || "Task completed successfully!");
            } else {
                showInfo("error", res?.message || "Task completed!");
            }
        } catch (error: any) {
            showInfo("error", error.message || "Failed to update task!");
        }

        setConfirmOpen(false);
        setSelectedTaskId(null);
    };

    const showInfo = (type: "success" | "error", message: string) => {
        setInfoType(type);
        setInfoMessage(message);
        setInfoOpen(true);
        setTimeout(() => setInfoOpen(false), 2500);
    };

    if (loading.tasks) {
        return <TaskListSkeleton count={5} />;
    }

    if (tasks.length === 0 && !loading.tasks) {
        return (
            <div className="empty-state">
                <img
                    src={NoTasksIcon}
                    alt="No tasks"
                    className="empty-state-icon"
                />
                <p>No tasks found. Create your first task!</p>
            </div>
        );
    }

    return (
        <>
            {tasks.map((task) => (
                <div key={task.id} className="task-card">
                    <h3>{task.title}</h3>

                    <div className="task-row">
                        <p className="task-desc">{task.description || "No description provided"}</p>

                        <div className="task-actions">
                            <button
                                onClick={() => openConfirm(task.id)}
                                disabled={loading.complete}
                                className={loading.complete ? 'loading' : ''}
                            >
                                {loading.complete ? (
                                    <>
                                        Completing...
                                    </>
                                ) : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <ConfirmModal
                open={confirmOpen}
                title="Mark as Completed"
                message="Are you sure you want to mark this task as done?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmDone}
                isLoading={loading.complete}
                cancelText="Cancel"
                confirmText="Yes"
            />

            <InfoModal
                open={infoOpen}
                type={infoType}
                message={infoMessage}
                onClose={() => setInfoOpen(false)}
            />
        </>
    );
}

export default TaskList;