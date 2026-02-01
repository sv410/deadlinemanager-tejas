import type { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // Simplified proxy - no session handling needed for backend-only setup
  const { NextResponse } = await import("next/server")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
