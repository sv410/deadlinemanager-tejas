/**
 * Unified hook for managing deadlines with backend integration
 * Connects to Python FastAPI backend for all deadline operations
 */

import { useState, useEffect, useCallback } from 'react';
import { backendClient, BackendTask, CreateTaskPayload, UpdateTaskPayload } from '@/lib/api/backend-client';

export interface Deadline {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  priority_score?: number;
  urgency_level?: string;
  is_overdue?: boolean;
  hours_until_deadline?: number;
}

interface UseDeadlinesReturn {
  deadlines: Deadline[];
  upcomingDeadlines: Deadline[];
  pastDeadlines: Deadline[];
  isLoading: boolean;
  error: string | null;
  createDeadline: (data: {
    title: string;
    description?: string;
    deadline: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }) => Promise<void>;
  updateDeadline: (id: string, data: Partial<Deadline>) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  refreshDeadlines: () => Promise<void>;
  sendEmailNotification: (id: string) => Promise<void>;
  syncToCalendar: (id: string) => Promise<void>;
}

function convertBackendTaskToDeadline(task: BackendTask): Deadline {
  return {
    id: task.id.toString(),
    user_id: task.user_id.toString(),
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    status: task.status,
    priority: task.priority,
    calendar_event_id: task.calendar_event_id,
    created_at: task.created_at,
    updated_at: task.updated_at,
    completed_at: task.completed_at,
    priority_score: task.priority_score,
    urgency_level: task.urgency_level,
    is_overdue: task.is_overdue,
    hours_until_deadline: task.hours_until_deadline,
  };
}

export function useDeadlines(token?: string | null): UseDeadlinesReturn {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [pastDeadlines, setPastDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set token when provided
  useEffect(() => {
    if (token) {
      backendClient.setToken(token);
    }
  }, [token]);

  const refreshDeadlines = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all deadlines, upcoming, and past in parallel
      const [allTasks, upcomingTasks, pastTasks] = await Promise.all([
        backendClient.getTasks(),
        backendClient.getUpcomingTasks(30),
        backendClient.getPastTasks(),
      ]);

      setDeadlines(allTasks.map(convertBackendTaskToDeadline));
      setUpcomingDeadlines(upcomingTasks.map(convertBackendTaskToDeadline));
      setPastDeadlines(pastTasks.map(convertBackendTaskToDeadline));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deadlines');
      console.error('Error fetching deadlines:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshDeadlines();
  }, [refreshDeadlines]);

  const createDeadline = async (data: CreateTaskPayload) => {
    try {
      setError(null);
      const newTask = await backendClient.createTask(data);
      
      // Refresh to get updated lists
      await refreshDeadlines();
      
      return newTask;
    } catch (err: any) {
      setError(err.message || 'Failed to create deadline');
      throw err;
    }
  };

  const updateDeadline = async (id: string, data: Partial<Deadline>) => {
    try {
      setError(null);
      
      const updatePayload: UpdateTaskPayload = {
        title: data.title,
        description: data.description === null ? undefined : data.description,
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
      };

      await backendClient.updateTask(parseInt(id), updatePayload);
      
      // Refresh to get updated lists
      await refreshDeadlines();
    } catch (err: any) {
      setError(err.message || 'Failed to update deadline');
      throw err;
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      setError(null);
      await backendClient.deleteTask(parseInt(id));
      
      // Refresh to get updated lists
      await refreshDeadlines();
    } catch (err: any) {
      setError(err.message || 'Failed to delete deadline');
      throw err;
    }
  };

  const sendEmailNotification = async (id: string) => {
    try {
      setError(null);
      await backendClient.sendEmailNotification(parseInt(id));
    } catch (err: any) {
      setError(err.message || 'Failed to send email notification');
      throw err;
    }
  };

  const syncToCalendar = async (id: string) => {
    try {
      setError(null);
      await backendClient.syncToCalendar(parseInt(id));
      
      // Refresh to update calendar_event_id
      await refreshDeadlines();
    } catch (err: any) {
      setError(err.message || 'Failed to sync to calendar');
      throw err;
    }
  };

  return {
    deadlines,
    upcomingDeadlines,
    pastDeadlines,
    isLoading,
    error,
    createDeadline,
    updateDeadline,
    deleteDeadline,
    refreshDeadlines,
    sendEmailNotification,
    syncToCalendar,
  };
}
