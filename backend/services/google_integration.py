import os
from datetime import datetime
from typing import Optional
from email.mime.text import MIMEText
import base64

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from fastapi import HTTPException, status

from models import GoogleToken, Task, User

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
TOKEN_URI = "https://oauth2.googleapis.com/token"
GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar.events"]


def _ensure_client_config():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google client credentials are missing. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
        )


def _build_credentials(token: GoogleToken, scopes: Optional[list[str]] = None) -> Credentials:
    _ensure_client_config()
    return Credentials(
        token=token.access_token,
        refresh_token=token.refresh_token,
        token_uri=TOKEN_URI,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=scopes or (token.scope.split() if token.scope else None),
    )


def send_gmail_deadline(user: User, task: Task, token: GoogleToken) -> str:
    creds = _build_credentials(token, scopes=GMAIL_SCOPES)
    service = build("gmail", "v1", credentials=creds)

    subject = f"Deadline Reminder: {task.title}"
    deadline_str = task.deadline.strftime("%Y-%m-%d %H:%M UTC")
    body = f"Hello {user.name},\n\nThis is a reminder for your deadline: {task.title}\nDue: {deadline_str}\nStatus: {task.status}\n\nDescription:\n{task.description or 'No description'}\n\n-- Deadline Manager"

    msg = MIMEText(body)
    msg["to"] = user.email
    msg["from"] = user.email
    msg["subject"] = subject

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    message = {"raw": raw}
    sent = service.users().messages().send(userId="me", body=message).execute()
    return sent.get("id")


def upsert_calendar_event(user: User, task: Task, token: GoogleToken, event_id: Optional[str] = None) -> str:
    creds = _build_credentials(token, scopes=CALENDAR_SCOPES)
    service = build("calendar", "v3", credentials=creds)

    start_iso = task.deadline.isoformat()
    end_iso = (task.deadline + (task.deadline - task.deadline.replace(minute=0, second=0, microsecond=0))).isoformat()

    event_body = {
        "summary": task.title,
        "description": task.description or "",
        "start": {"dateTime": start_iso, "timeZone": "UTC"},
        "end": {"dateTime": end_iso, "timeZone": "UTC"},
        "reminders": {"useDefault": True},
    }

    if event_id:
        updated = service.events().update(calendarId="primary", eventId=event_id, body=event_body).execute()
        return updated.get("id")
    created = service.events().insert(calendarId="primary", body=event_body).execute()
    return created.get("id")
