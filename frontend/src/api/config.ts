export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
        timeout: 10000,
        retries: 3,
    },
    features: {
        enableNotifications: true,
        autoRefreshInterval: 30000,
    }
};