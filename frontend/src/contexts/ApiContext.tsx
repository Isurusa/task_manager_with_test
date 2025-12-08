import { createContext, useContext, type ReactNode } from 'react';
import type { ITaskApiService } from '../api/interfaces/ITaskApiService';
import { TaskApiService } from '../api/services/TaskApiService';

const ApiContext = createContext<ITaskApiService | null>(null);

export function ApiProvider({ children, service }: {
    children: ReactNode;
    service?: ITaskApiService
}) {
    const apiService = service || new TaskApiService();

    return (
        <ApiContext.Provider value={apiService}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApi(): ITaskApiService {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within ApiProvider');
    }
    return context;
}