/**
 * Tasks API Service
 * Handles all task-related API calls to the FastAPI backend
 */

import { getAccessToken, getRefreshToken, refreshToken, storeTokens } from './auth';

// Use relative paths for API calls (proxied through Next.js to backend)
const API_URL = '/api';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DetailedTask extends Task {
  time_remaining?: number;
  is_overdue: boolean;
  hours_until_deadline?: number;
  priority_score: number;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TaskCreate {
  title: string;
  description?: string;
  deadline: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'missed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface TaskAnalytics {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  missed_tasks: number;
  in_progress_tasks: number;
  completion_rate: number;
  average_completion_time?: number;
  overdue_count: number;
  upcoming_count: number;
}

export interface PrioritizedTasks {
  recommended_next_task?: DetailedTask;
  upcoming_tasks: DetailedTask[];
  past_tasks: DetailedTask[];
}

/**
 * Make authenticated API request with automatic token refresh
 */
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  // First attempt with current token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // If unauthorized, try refreshing token
  if (response.status === 401) {
    const refreshTokenValue = getRefreshToken();
    if (refreshTokenValue) {
      try {
        const authResponse = await refreshToken(refreshTokenValue);
        storeTokens(authResponse.access_token, authResponse.refresh_token, authResponse.user);
        accessToken = authResponse.access_token;

        // Retry request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        throw new Error('Session expired. Please login again.');
      }
    } else {
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
}

/**
 * Get all tasks with optional filters
 */
export async function getTasks(
  status?: Task['status'],
  priority?: Task['priority']
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);

  const url = `${API_URL}/api/tasks/${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

/**
 * Get a single task by ID
 */
export async function getTask(taskId: number): Promise<DetailedTask> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/${taskId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return response.json();
}

/**
 * Create a new task
 */
export async function createTask(task: TaskCreate): Promise<Task> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/`, {
    method: 'POST',
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create task');
  }

  return response.json();
}

/**
 * Update an existing task
 */
export async function updateTask(taskId: number, updates: TaskUpdate): Promise<Task> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update task');
  }

  return response.json();
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: number): Promise<void> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

/**
 * Get task analytics
 */
export async function getTaskAnalytics(): Promise<TaskAnalytics> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/analytics/dashboard`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
}

/**
 * Get prioritized tasks with recommendations
 */
export async function getPrioritizedTasks(): Promise<PrioritizedTasks> {
  const response = await authenticatedFetch(`${API_URL}/api/tasks/prioritized/all`);

  if (!response.ok) {
    throw new Error('Failed to fetch prioritized tasks');
  }

  return response.json();
}
