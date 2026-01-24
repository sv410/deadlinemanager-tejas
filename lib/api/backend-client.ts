/**
 * Backend API Client for Python FastAPI Backend
 * Handles communication with the deadline management API
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface BackendTask {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  time_remaining: number | null;
  is_overdue: boolean;
  hours_until_deadline: number;
  priority_score: number;
  urgency_level: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  deadline: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'missed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface GoogleTokenPayload {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
  token_type?: string;
}

export interface NotificationResponse {
  channel: string;
  status: string;
  message_id?: string;
  calendar_event_id?: string;
}

class BackendAPIClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  // Task CRUD endpoints
  async getTasks(statusFilter?: string, priorityFilter?: string): Promise<BackendTask[]> {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    if (priorityFilter) params.append('priority_filter', priorityFilter);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<BackendTask[]>(`/api/tasks${query}`);
  }

  async getUpcomingTasks(days: number = 30): Promise<BackendTask[]> {
    return this.request<BackendTask[]>(`/api/tasks/upcoming?days=${days}`);
  }

  async getPastTasks(): Promise<BackendTask[]> {
    return this.request<BackendTask[]>('/api/tasks/past');
  }

  async getTask(taskId: number): Promise<BackendTask> {
    return this.request<BackendTask>(`/api/tasks/${taskId}`);
  }

  async createTask(payload: CreateTaskPayload): Promise<BackendTask> {
    return this.request<BackendTask>('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateTask(taskId: number, payload: UpdateTaskPayload): Promise<BackendTask> {
    return this.request<BackendTask>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    await this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Google integration endpoints
  async upsertGoogleTokens(payload: GoogleTokenPayload): Promise<GoogleTokenPayload> {
    return this.request<GoogleTokenPayload>('/api/tasks/google/tokens', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async sendEmailNotification(taskId: number): Promise<NotificationResponse> {
    return this.request<NotificationResponse>(`/api/tasks/${taskId}/notify/email`, {
      method: 'POST',
    });
  }

  async syncToCalendar(taskId: number): Promise<NotificationResponse> {
    return this.request<NotificationResponse>(`/api/tasks/${taskId}/calendar`, {
      method: 'POST',
    });
  }

  // Analytics endpoint
  async getAnalytics() {
    return this.request('/api/tasks/analytics/dashboard');
  }
}

export const backendClient = new BackendAPIClient();
