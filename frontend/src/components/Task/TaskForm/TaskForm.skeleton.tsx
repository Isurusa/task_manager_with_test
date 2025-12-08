import './TaskForm.css';

export function TaskFormSkeleton() {
    return (
        <div className="skeleton-form" data-testid="task-form-skeleton">
            <div className="skeleton-input"></div>
            <div className="skeleton-textarea"></div>
            <div className="skeleton-footer">
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
}