import { useState, useCallback } from 'react';
import { TaskApiService } from '../api/services/TaskApiService';
import type { Task, CreateTaskDto } from '../api/interfaces/tasks.interface';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState({
    tasks: false,
    create: false,
    complete: false
  });
  const [error, setError] = useState<string | null>(null);

  const apiService = new TaskApiService();

  const loadTasks = useCallback(async () => {
    setLoading(prev => ({ ...prev, tasks: true }));
    setError(null);
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  }, []);

  const addTask = useCallback(async (taskData: CreateTaskDto) => {
    setLoading(prev => ({ ...prev, create: true }));
    setError(null);
    try {
      const newTask = await apiService.createTask(taskData);

      // Option A: Optimistic + refetch (recommended)
      setTasks(prev => [newTask, ...prev]);
      await loadTasks(); // Ensures sync with server (e.g. g. correct ID, timestamps, etc.)

      // Trigger event so other components can react (optional but nice)
      window.dispatchEvent(new Event('task:added'));

      return newTask;
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      // On error: revert optimistic update
      await loadTasks(); // Refresh to correct state
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  }, [loadTasks]);

  const completeTask = useCallback(async (id: number) => {
    setLoading(prev => ({ ...prev, complete: true }));
    setError(null);

    // Optimistically remove
    const previousTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const response = await apiService.completeTask(id);

      // Success → refetch to be 100% sure (or trust optimistic)
      await loadTasks();

      window.dispatchEvent(new Event('task:completed'));

      return response;
    } catch (err: any) {
      // Revert on error
      setTasks(previousTasks);
      setError(err.message || 'Failed to complete task');
      await loadTasks(); // Sync with server anyway
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, complete: false }));
    }
  }, [tasks, loadTasks]);

  return {
    tasks,
    loading, // Now an object: { tasks, create, complete }
    error,
    loadTasks,
    addTask,
    completeTask,
    setTasks
  };
}