import { TaskItemSkeleton } from './TaskItem.skeleton';

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="task-list-skeleton">
            {Array.from({ length: count }).map((_, index) => (
                <TaskItemSkeleton key={index} />
            ))}
        </div>
    );
}