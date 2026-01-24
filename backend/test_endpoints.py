#!/usr/bin/env python3
"""
Test script for backend API endpoints
Run with: python test_endpoints.py
"""

import requests
import json
from datetime import datetime, timedelta, timezone

BASE_URL = "http://localhost:8000"

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
END = '\033[0m'

def print_success(msg):
    print(f"{GREEN}✓{END} {msg}")

def print_error(msg):
    print(f"{RED}✗{END} {msg}")

def print_info(msg):
    print(f"{BLUE}ℹ{END} {msg}")

def print_warning(msg):
    print(f"{YELLOW}⚠{END} {msg}")

# Test data
test_user = {
    "name": "Test User",
    "email": f"test_{datetime.now().timestamp()}@example.com",
    "password": "testpassword123"
}

def test_health():
    """Test health check endpoint"""
    print_info("Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    if response.status_code == 200:
        print_success(f"Health check passed: {response.json()}")
        return True
    else:
        print_error(f"Health check failed: {response.status_code}")
        return False

def test_register():
    """Test user registration"""
    print_info("Testing user registration...")
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=test_user
    )
    if response.status_code == 201:
        data = response.json()
        print_success(f"User registered: {data['user']['email']}")
        return data
    else:
        print_error(f"Registration failed: {response.status_code} - {response.text}")
        return None

def test_login(email, password):
    """Test user login"""
    print_info("Testing user login...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": email, "password": password}
    )
    if response.status_code == 200:
        data = response.json()
        print_success(f"Login successful, token: {data['access_token'][:20]}...")
        return data['access_token']
    else:
        print_error(f"Login failed: {response.status_code} - {response.text}")
        return None

def test_create_task(token):
    """Test task creation"""
    print_info("Testing task creation...")
    deadline = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    task_data = {
        "title": "Test Deadline",
        "description": "This is a test deadline from API test script",
        "deadline": deadline,
        "priority": "high"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/api/tasks/",
        json=task_data,
        headers=headers
    )
    
    if response.status_code == 201:
        data = response.json()
        print_success(f"Task created: ID={data['id']}, Title={data['title']}")
        return data
    else:
        print_error(f"Task creation failed: {response.status_code} - {response.text}")
        return None

def test_get_tasks(token):
    """Test fetching all tasks"""
    print_info("Testing get all tasks...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/tasks/", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Fetched {len(data)} tasks")
        return data
    else:
        print_error(f"Fetch tasks failed: {response.status_code} - {response.text}")
        return None

def test_get_upcoming_tasks(token):
    """Test fetching upcoming tasks"""
    print_info("Testing get upcoming tasks...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/tasks/upcoming?days=30", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Fetched {len(data)} upcoming tasks")
        for task in data:
            print(f"  - {task['title']} (Due: {task['deadline']}, Priority Score: {task['priority_score']})")
        return data
    else:
        print_error(f"Fetch upcoming tasks failed: {response.status_code} - {response.text}")
        return None

def test_get_past_tasks(token):
    """Test fetching past tasks"""
    print_info("Testing get past tasks...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/tasks/past", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Fetched {len(data)} past tasks")
        return data
    else:
        print_error(f"Fetch past tasks failed: {response.status_code} - {response.text}")
        return None

def test_update_task(token, task_id):
    """Test task update"""
    print_info(f"Testing task update for ID={task_id}...")
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "status": "in_progress",
        "priority": "critical"
    }
    
    response = requests.put(
        f"{BASE_URL}/api/tasks/{task_id}",
        json=update_data,
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Task updated: Status={data['status']}, Priority={data['priority']}")
        return data
    else:
        print_error(f"Task update failed: {response.status_code} - {response.text}")
        return None

def test_analytics(token):
    """Test analytics endpoint"""
    print_info("Testing analytics...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/tasks/analytics/dashboard", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print_success("Analytics retrieved:")
        print(f"  Total tasks: {data.get('total_tasks', 0)}")
        print(f"  Completed: {data.get('completed_tasks', 0)}")
        print(f"  Completion rate: {data.get('completion_rate', 0):.1f}%")
        return data
    else:
        print_error(f"Analytics failed: {response.status_code} - {response.text}")
        return None

def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*60)
    print("Backend API Endpoint Testing")
    print("="*60 + "\n")
    
    # Test health
    if not test_health():
        print_error("Backend is not running. Start it with: uvicorn main:app --reload")
        return
    
    print("\n" + "-"*60 + "\n")
    
    # Test registration
    user_data = test_register()
    if not user_data:
        return
    
    print("\n" + "-"*60 + "\n")
    
    # Test login
    token = test_login(test_user["email"], test_user["password"])
    if not token:
        return
    
    print("\n" + "-"*60 + "\n")
    
    # Test task creation
    task = test_create_task(token)
    if not task:
        return
    
    print("\n" + "-"*60 + "\n")
    
    # Test get all tasks
    test_get_tasks(token)
    
    print("\n" + "-"*60 + "\n")
    
    # Test get upcoming tasks
    test_get_upcoming_tasks(token)
    
    print("\n" + "-"*60 + "\n")
    
    # Test get past tasks
    test_get_past_tasks(token)
    
    print("\n" + "-"*60 + "\n")
    
    # Test task update
    if task:
        test_update_task(token, task['id'])
    
    print("\n" + "-"*60 + "\n")
    
    # Test analytics
    test_analytics(token)
    
    print("\n" + "="*60)
    print(f"{GREEN}All tests completed!{END}")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_all_tests()
