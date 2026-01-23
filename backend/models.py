from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    MISSED = "missed"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=False, index=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False, index=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title={self.title}, status={self.status}, priority={self.priority})>"

    @property
    def time_remaining(self) -> Optional[timedelta]:
        """Calculate time remaining until deadline"""
        now = datetime.now(timezone.utc)
        if self.deadline > now:
            return self.deadline - now
        return None

    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue"""
        now = datetime.now(timezone.utc)
        return self.deadline < now and self.status != TaskStatus.COMPLETED

    @property
    def hours_until_deadline(self) -> float:
        """Get hours until deadline (negative if overdue)"""
        time_left = self.time_remaining
        if time_left:
            return time_left.total_seconds() / 3600
        else:
            return -1  # Overdue
