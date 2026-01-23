/**
 * Hook for managing deadlines with backend integration
 * Supports both authenticated (API) and guest (localStorage) modes
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getPrioritizedTasks,
  getTaskAnalytics,
  type Task,
  type TaskCreate,
  type TaskUpdate,
  type DetailedTask,
  type TaskAnalytics,
  type PrioritizedTasks,
} from '@/lib/api/tasks';

// Local storage deadline interface (guest mode)
interface LocalDeadline {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  createdAt: string;
  hasTime?: boolean;
  completedAt?: string;
  description?: string;
}

export interface DeadlineWithDetails extends Task {
  hasTime?: boolean;
  priority_score?: number;
  urgency_level?: string;
  is_overdue?: boolean;
}

export function useDeadlines() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [deadlines, setDeadlines] = useState<DeadlineWithDetails[]>([]);
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [prioritized, setPrioritized] = useState<PrioritizedTasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert local deadline to API task format
  const localToApi = (local: LocalDeadline): DeadlineWithDetails => ({
    id: parseInt(local.id) || Date.now(),
    user_id: 0,
    title: local.title,
    description: local.description,
    deadline: local.dueDate,
    status: local.status === 'in_progress' ? 'in_progress' : (local.status as any),
    priority: local.priority,
    completed_at: local.completedAt,
    created_at: local.createdAt,
    updated_at: local.createdAt,
    hasTime: local.hasTime,
  });

  // Convert API task to local deadline format
  const apiToLocal = (api: Task | DetailedTask): LocalDeadline => ({
    id: api.id.toString(),
    title: api.title,
    dueDate: api.deadline,
    priority: api.priority,
    status: api.status,
    createdAt: api.created_at,
    completedAt: api.completed_at,
    description: api.description,
    hasTime: true,
  });

  // Load deadlines
  const loadDeadlines = useCallback(async () => {
    if (authLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        // Authenticated mode: fetch from API
        const [tasks, analyticsData, prioritizedData] = await Promise.all([
          getTasks(),
          getTaskAnalytics(),
          getPrioritizedTasks(),
        ]);

        setDeadlines(tasks.map(task => ({ ...task, hasTime: true })));
        setAnalytics(analyticsData);
        setPrioritized(prioritizedData);
      } else {
        // Guest mode: use localStorage
        const saved = localStorage.getItem('deadlines');
        if (saved) {
          const local: LocalDeadline[] = JSON.parse(saved);
          setDeadlines(local.map(localToApi));
        } else {
          setDeadlines([]);
        }
      }
    } catch (err) {
      console.error('Error loading deadlines:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deadlines');
      
      // Fallback to localStorage on error
      const saved = localStorage.getItem('deadlines');
      if (saved) {
        const local: LocalDeadline[] = JSON.parse(saved);
        setDeadlines(local.map(localToApi));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Save to localStorage (guest mode)
  const saveToLocalStorage = (deadlines: DeadlineWithDetails[]) => {
    const local = deadlines.map(apiToLocal);
    localStorage.setItem('deadlines', JSON.stringify(local));
  };

  // Create deadline
  const addDeadline = async (deadline: {
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    hasTime?: boolean;
    description?: string;
  }) => {
    try {
      if (isAuthenticated) {
        // API mode
        const newTask = await createTask({
          title: deadline.title,
          deadline: deadline.dueDate,
          priority: deadline.priority,
          description: deadline.description,
        });
        setDeadlines(prev => [...prev, { ...newTask, hasTime: deadline.hasTime }]);
      } else {
        // Guest mode
        const newDeadline: DeadlineWithDetails = {
          id: Date.now(),
          user_id: 0,
          title: deadline.title,
          deadline: deadline.dueDate,
          priority: deadline.priority,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          hasTime: deadline.hasTime,
          description: deadline.description,
        };
        const updated = [...deadlines, newDeadline];
        setDeadlines(updated);
        saveToLocalStorage(updated);
      }
      await loadDeadlines(); // Refresh
    } catch (err) {
      throw err;
    }
  };

  // Update deadline
  const updateDeadline = async (
    id: number,
    updates: Partial<TaskUpdate>
  ) => {
    try {
      if (isAuthenticated) {
        // API mode
        await updateTask(id, updates);
        setDeadlines(prev =>
          prev.map(d => (d.id === id ? { ...d, ...updates } : d))
        );
      } else {
        // Guest mode
        const updated = deadlines.map(d =>
          d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d
        );
        setDeadlines(updated);
        saveToLocalStorage(updated);
      }
      await loadDeadlines(); // Refresh
    } catch (err) {
      throw err;
    }
  };

  // Complete deadline
  const completeDeadline = async (id: number) => {
    await updateDeadline(id, {
      status: 'completed',
    });
  };

  // Delete deadline
  const removeDeadline = async (id: number) => {
    try {
      if (isAuthenticated) {
        // API mode
        await deleteTask(id);
        setDeadlines(prev => prev.filter(d => d.id !== id));
      } else {
        // Guest mode
        const updated = deadlines.filter(d => d.id !== id);
        setDeadlines(updated);
        saveToLocalStorage(updated);
      }
    } catch (err) {
      throw err;
    }
  };

  // Load deadlines on mount and when auth changes
  useEffect(() => {
    loadDeadlines();
  }, [loadDeadlines]);

  // Save to localStorage in guest mode whenever deadlines change
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      saveToLocalStorage(deadlines);
    }
  }, [deadlines, isAuthenticated, authLoading]);

  return {
    deadlines,
    analytics,
    prioritized,
    isLoading,
    error,
    isAuthenticated,
    addDeadline,
    updateDeadline,
    completeDeadline,
    removeDeadline,
    reload: loadDeadlines,
  };
}
