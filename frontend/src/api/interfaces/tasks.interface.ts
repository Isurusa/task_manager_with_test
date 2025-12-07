export interface Task {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    is_completed: boolean;
    // Add if using Laravel Resources
    updated_at?: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}