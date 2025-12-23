import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { googleOAuthConfig } from "@/lib/google-config"
import { OAuth2Client } from "google-auth-library"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.json({ error: "No authorization code received" }, { status: 400 })
  }

  try {
    const oauth2Client = new OAuth2Client(
      googleOAuthConfig.clientId,
      googleOAuthConfig.clientSecret,
      googleOAuthConfig.redirectUri,
    )

    // Get tokens from authorization code
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens || !tokens.access_token) {
      return NextResponse.json({ error: "Failed to get tokens" }, { status: 400 })
    }

    // Set credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token || "",
      audience: googleOAuthConfig.clientId,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Failed to get user info" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Check if user exists
    let user = await supabase.from("users").select("id").eq("email", payload.email).single()

    if (user.error) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: payload.email,
          full_name: payload.name || "",
          avatar_url: payload.picture || null,
          google_id: payload.sub,
        })
        .select("id")
        .single()

      if (createError) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
      }

      user = { data: newUser }
    }

    // Store Google tokens in database
    if (user.data) {
      await supabase.from("google_tokens").upsert({
        user_id: user.data.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        updated_at: new Date(),
      })
    }

    // Redirect to dashboard
    const response = NextResponse.redirect(new URL("/dashboard", request.url))

    // Set auth cookie or session here as needed
    return response
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 },
    )
  }
}
