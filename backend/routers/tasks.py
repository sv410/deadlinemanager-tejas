from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models import (
    User,
    Task,
    TaskStatus,
    TaskPriority,
    GoogleToken,
    Notification,
    NotificationChannel,
    NotificationStatus,
)
from schemas import (
    TaskCreate, TaskUpdate, TaskResponse, TaskDetailedResponse,
    TaskAnalytics, PrioritizedTasksResponse, GoogleTokenUpsert, NotificationResponse,
)
from database import get_db
from auth import get_current_user
from services.google_integration import send_gmail_deadline, upsert_calendar_event

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


def calculate_priority_score(task: Task) -> float:
    """
    Calculate priority score for a task (0-100).
    
    Factors:
    - Time remaining (more urgent = higher score)
    - Task priority level
    - Status
    """
    now = datetime.now(timezone.utc)
    base_priority = {
        TaskPriority.LOW: 20,
        TaskPriority.MEDIUM: 50,
        TaskPriority.HIGH: 75,
        TaskPriority.CRITICAL: 100
    }
    
    # Start with base priority
    score = base_priority.get(task.priority, 50)
    
    # Reduce score for completed/missed tasks
    if task.status == TaskStatus.COMPLETED:
        score *= 0.1
    elif task.status == TaskStatus.MISSED:
        score *= 0.05
    
    # Boost score based on urgency (time remaining)
    time_remaining = task.time_remaining
    if time_remaining:
        hours_left = time_remaining.total_seconds() / 3600
        if hours_left < 1:  # Less than 1 hour
            score *= 2.0
        elif hours_left < 24:  # Less than 1 day
            score *= 1.5
        elif hours_left < 7 * 24:  # Less than 1 week
            score *= 1.2
    else:  # Overdue
        score *= 2.0 if task.status != TaskStatus.COMPLETED else 0.1
    
    # Cap at 100
    return min(score, 100)


def get_urgency_level(score: float) -> str:
    """Get urgency level based on priority score"""
    if score >= 75:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"


def task_to_detailed_response(task: Task) -> TaskDetailedResponse:
    """Convert Task model to detailed response with calculations"""
    score = calculate_priority_score(task)
    return TaskDetailedResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        deadline=task.deadline,
        status=task.status,
        priority=task.priority,
        calendar_event_id=task.calendar_event_id,
        created_at=task.created_at,
        updated_at=task.updated_at,
        completed_at=task.completed_at,
        time_remaining=task.hours_until_deadline if task.time_remaining else 0,
        is_overdue=task.is_overdue,
        hours_until_deadline=task.hours_until_deadline,
        priority_score=score,
        urgency_level=get_urgency_level(score)
    )


@router.post("/", response_model=TaskDetailedResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new task for the current user.
    
    The priority is calculated based on deadline and urgency.
    """
    new_task = Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        deadline=task_data.deadline,
        priority=task_data.priority,
        status=TaskStatus.PENDING
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return task_to_detailed_response(new_task)


@router.get("/upcoming", response_model=List[TaskDetailedResponse])
async def get_upcoming_tasks(
    days: int = Query(30, ge=1, le=365, description="Days ahead to include"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    cutoff = now + timedelta(days=days)
    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .filter(Task.deadline >= now)
        .filter(Task.deadline <= cutoff)
        .order_by(Task.deadline.asc())
        .all()
    )
    return [task_to_detailed_response(t) for t in tasks]


@router.get("/past", response_model=List[TaskDetailedResponse])
async def get_past_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .filter(Task.deadline < now)
        .order_by(Task.deadline.desc())
        .all()
    )
    return [task_to_detailed_response(t) for t in tasks]


@router.get("/", response_model=List[TaskDetailedResponse])
async def get_all_tasks(
    status_filter: TaskStatus = Query(None, description="Filter by status"),
    priority_filter: TaskPriority = Query(None, description="Filter by priority"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all tasks for the current user.
    
    Optional filters:
    - status: pending, in_progress, completed, missed
    - priority: low, medium, high, critical
    """
    query = db.query(Task).filter(Task.user_id == current_user.id)
    
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority_filter:
        query = query.filter(Task.priority == priority_filter)
    
    tasks = query.order_by(Task.deadline).all()
    return [task_to_detailed_response(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskDetailedResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific task by ID (only accessible to owner)"""
    task = db.query(Task).filter(
        and_(Task.id == task_id, Task.user_id == current_user.id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task_to_detailed_response(task)


@router.put("/{task_id}", response_model=TaskDetailedResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a task (only accessible to owner).
    
    If status is changed to 'completed', completed_at is automatically set.
    """
    task = db.query(Task).filter(
        and_(Task.id == task_id, Task.user_id == current_user.id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.deadline is not None:
        task.deadline = task_update.deadline
    if task_update.priority is not None:
        task.priority = task_update.priority
    if task_update.status is not None:
        task.status = task_update.status
        # Set completed_at when task is marked complete
        if task_update.status == TaskStatus.COMPLETED:
            task.completed_at = datetime.now(timezone.utc)
        elif task_update.status == TaskStatus.MISSED:
            task.completed_at = datetime.now(timezone.utc)
    
    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    
    return task_to_detailed_response(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task (only accessible to owner)"""
    task = db.query(Task).filter(
        and_(Task.id == task_id, Task.user_id == current_user.id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    return None


# --- Google Integrations ---


@router.post("/google/tokens", response_model=GoogleTokenUpsert)
async def upsert_google_tokens(
    payload: GoogleTokenUpsert,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    token = db.query(GoogleToken).filter(GoogleToken.user_id == current_user.id).first()
    if token:
        token.access_token = payload.access_token
        token.refresh_token = payload.refresh_token
        token.expires_at = payload.expires_at
        token.scope = payload.scope
        token.token_type = payload.token_type
    else:
        token = GoogleToken(
            user_id=current_user.id,
            access_token=payload.access_token,
            refresh_token=payload.refresh_token,
            expires_at=payload.expires_at,
            scope=payload.scope,
            token_type=payload.token_type,
        )
        db.add(token)
    db.commit()
    return payload


def _get_task_for_user(task_id: int, user: User, db: Session) -> Task:
    task = db.query(Task).filter(and_(Task.id == task_id, Task.user_id == user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def _get_google_token(user: User, db: Session) -> GoogleToken:
    token = db.query(GoogleToken).filter(GoogleToken.user_id == user.id).first()
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google token not found for user")
    return token


@router.post("/{task_id}/notify/email", response_model=NotificationResponse)
async def notify_via_email(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = _get_task_for_user(task_id, current_user, db)
    token = _get_google_token(current_user, db)
    message_id = send_gmail_deadline(current_user, task, token)
    notification = Notification(
        user_id=current_user.id,
        task_id=task.id,
        channel=NotificationChannel.EMAIL,
        status=NotificationStatus.SENT,
        error_message=None,
    )
    db.add(notification)
    db.commit()
    return NotificationResponse(channel="email", status="sent", message_id=message_id)


@router.post("/{task_id}/calendar", response_model=NotificationResponse)
async def upsert_task_calendar(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = _get_task_for_user(task_id, current_user, db)
    token = _get_google_token(current_user, db)
    event_id = upsert_calendar_event(current_user, task, token, task.calendar_event_id)
    task.calendar_event_id = event_id
    notification = Notification(
        user_id=current_user.id,
        task_id=task.id,
        channel=NotificationChannel.CALENDAR,
        status=NotificationStatus.SENT,
        error_message=None,
    )
    db.add(notification)
    db.commit()
    return NotificationResponse(channel="calendar", status="sent", calendar_event_id=event_id)


@router.get("/analytics/dashboard", response_model=TaskAnalytics)
async def get_task_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive task analytics for the current user.
    
    Includes completion rate, overdue count, and average completion time.
    """
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    
    total = len(tasks)
    completed = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
    pending = len([t for t in tasks if t.status == TaskStatus.PENDING])
    in_progress = len([t for t in tasks if t.status == TaskStatus.IN_PROGRESS])
    missed = len([t for t in tasks if t.status == TaskStatus.MISSED])
    
    completion_rate = (completed / total * 100) if total > 0 else 0
    
    # Calculate average completion time
    completed_tasks = [t for t in tasks if t.completed_at and t.created_at]
    avg_completion_hours = None
    if completed_tasks:
        total_hours = sum(
            (t.completed_at - t.created_at).total_seconds() / 3600
            for t in completed_tasks
        )
        avg_completion_hours = total_hours / len(completed_tasks)
    
    now = datetime.now(timezone.utc)
    overdue = len([t for t in tasks if t.is_overdue])
    upcoming = len([
        t for t in tasks
        if t.status in [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]
        and t.deadline < now + timedelta(days=7)
        and t.deadline > now
    ])
    
    return TaskAnalytics(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        missed_tasks=missed,
        in_progress_tasks=in_progress,
        completion_rate=completion_rate,
        average_completion_time=avg_completion_hours,
        overdue_count=overdue,
        upcoming_count=upcoming
    )


@router.get("/prioritized/all", response_model=PrioritizedTasksResponse)
async def get_prioritized_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all tasks organized by priority and deadline.
    
    Returns:
    - recommended_next_task: The most urgent task to work on
    - upcoming_tasks: All pending/in-progress tasks sorted by urgency
    - past_tasks: Completed and missed tasks
    """
    now = datetime.now(timezone.utc)
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    
    # Separate active and past tasks
    active_tasks = [
        t for t in tasks
        if t.status in [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]
    ]
    past_tasks = [
        t for t in tasks
        if t.status in [TaskStatus.COMPLETED, TaskStatus.MISSED]
    ]
    
    # Sort active tasks by priority score (highest first)
    active_tasks.sort(
        key=lambda t: (calculate_priority_score(t), -t.deadline.timestamp()),
        reverse=True
    )
    
    # Sort past tasks by completion date (newest first)
    past_tasks.sort(key=lambda t: t.completed_at or t.deadline, reverse=True)
    
    recommended = None
    if active_tasks:
        recommended = task_to_detailed_response(active_tasks[0])
    
    return PrioritizedTasksResponse(
        recommended_next_task=recommended,
        upcoming_tasks=[task_to_detailed_response(t) for t in active_tasks],
        past_tasks=[task_to_detailed_response(t) for t in past_tasks[:50]]  # Limit to 50
    )
