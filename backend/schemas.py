from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from models import TaskStatus, TaskPriority


# User Schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    password: str = Field(..., min_length=8)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    deadline: datetime
    priority: TaskPriority = TaskPriority.MEDIUM

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project report",
                "description": "Finish the Q4 project report and submit to manager",
                "deadline": "2026-02-28T17:00:00Z",
                "priority": "high"
            }
        }


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    deadline: Optional[datetime] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None

    class Config:
        json_schema_extra = {
            "example": {
                "status": "completed",
                "priority": "critical"
            }
        }


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    deadline: datetime
    status: TaskStatus
    priority: TaskPriority
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    time_remaining: Optional[float] = None
    is_overdue: bool = False
    hours_until_deadline: float = 0

    class Config:
        from_attributes = True


class TaskDetailedResponse(TaskResponse):
    """Extended task response with analysis"""
    priority_score: float = Field(description="Calculated priority score (0-100)")
    urgency_level: str = Field(description="CRITICAL, HIGH, MEDIUM, LOW")


# Authentication Schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "is_active": True,
                    "created_at": "2026-01-23T10:00:00"
                }
            }
        }


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Analytics Schemas
class TaskAnalytics(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    missed_tasks: int
    in_progress_tasks: int
    completion_rate: float = Field(description="Percentage of completed tasks")
    average_completion_time: Optional[float] = Field(None, description="Hours to complete tasks")
    overdue_count: int
    upcoming_count: int = Field(description="Tasks due in next 7 days")


class PrioritizedTasksResponse(BaseModel):
    recommended_next_task: Optional[TaskDetailedResponse] = Field(
        None, 
        description="The most urgent task to work on"
    )
    upcoming_tasks: List[TaskDetailedResponse] = Field(
        default_factory=list,
        description="Tasks sorted by priority and deadline"
    )
    past_tasks: List[TaskDetailedResponse] = Field(
        default_factory=list,
        description="Completed and missed tasks"
    )


# Error Response
class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
