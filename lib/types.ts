export type Priority = "low" | "medium" | "high" | "urgent"
export type Status = "pending" | "in_progress" | "completed" | "overdue"

export interface Deadline {
  id: string
  user_id: string
  title: string
  description: string | null
  deadline_date: string
  priority: Priority
  category: string
  status: Status
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  created_at: string
}
