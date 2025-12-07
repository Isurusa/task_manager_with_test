import type { Task, CreateTaskDto } from './tasks.interface';

export interface ITaskApiService {
    getTasks(): Promise<Task[]>;
    createTask(taskData: CreateTaskDto): Promise<Task>;
    completeTask(id: number): Promise<any>;
}