/**
 * Auth API Proxy Routes
 * Proxies authentication requests from frontend to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function handleRequest(req: NextRequest, path: string) {
  try {
    const method = req.method;
    const headers = new Headers(req.headers);
    
    // Remove host header to avoid conflicts
    headers.delete('host');
    
    // Get the request body if it exists
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await req.text();
      } catch (e) {
        // No body
      }
    }

    const backendUrl = `${BACKEND_URL}/api/auth${path}`;
    
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Get the response body
    const responseBody = await response.text();

    // Create response with proper headers
    const proxyResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant headers from backend response
    response.headers.forEach((value, key) => {
      if (
        !['content-encoding', 'transfer-encoding', 'content-length'].includes(
          key.toLowerCase()
        )
      ) {
        proxyResponse.headers.set(key, value);
      }
    });

    // Ensure correct content type
    if (!proxyResponse.headers.has('content-type')) {
      proxyResponse.headers.set('content-type', 'application/json');
    }

    return proxyResponse;
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path ? `/${params.path.join('/')}` : '';
  return handleRequest(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path ? `/${params.path.join('/')}` : '';
  return handleRequest(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path ? `/${params.path.join('/')}` : '';
  return handleRequest(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path ? `/${params.path.join('/')}` : '';
  return handleRequest(req, path);
}
