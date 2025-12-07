import type { ITaskApiService } from '../interfaces/ITaskApiService';
import type { Task, CreateTaskDto } from '../interfaces/tasks.interface';
import axios from 'axios';
import { config } from '../config';

export class TaskApiService implements ITaskApiService {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || config.api.baseUrl;
    }

    async getTasks(): Promise<Task[]> {
        const response = await axios.get<Task[]>(`${this.baseUrl}/tasks`);
        return response.data;
    }

    async createTask(taskData: CreateTaskDto): Promise<Task> {
        const response = await axios.post<Task>(`${this.baseUrl}/tasks`, taskData);
        return response.data;
    }

    async completeTask(id: number): Promise<any> {
        const response = await axios.put(`${this.baseUrl}/tasks/${id}/complete`);
        return response.data;
    }
}