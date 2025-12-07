export function TaskItemSkeleton() {
    return (
        <div className="task-card skeleton-card">
            <div className="skeleton-title"></div>

            <div className="skeleton-row">
                <div className="skeleton-description"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
}