import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/backend-proxy/notify - send email/calendar notification
 * Body: { taskId: number, channel: 'email' | 'calendar' }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { taskId, channel } = body;

    if (!taskId || !channel) {
      return NextResponse.json(
        { error: 'taskId and channel are required' },
        { status: 400 }
      );
    }

    let endpoint = '';
    if (channel === 'email') {
      endpoint = `/api/tasks/${taskId}/notify/email`;
    } else if (channel === 'calendar') {
      endpoint = `/api/tasks/${taskId}/calendar`;
    } else {
      return NextResponse.json(
        { error: 'Invalid channel. Use "email" or "calendar"' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Backend error' }));
      return NextResponse.json(
        { error: error.detail },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
