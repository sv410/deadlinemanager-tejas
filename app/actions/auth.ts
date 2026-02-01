"use server"

import { redirect } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  try {
    // Register user via backend API
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name: fullName,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { error: error.detail || 'Registration failed' }
    }

    // Login after successful registration
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!loginResponse.ok) {
      return { error: "Account created but could not sign in. Please try logging in manually." }
    }

    redirect("/dashboard")
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' }
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { error: error.detail || 'Login failed' }
    }

    redirect("/dashboard")
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Login failed' }
  }
}

export async function logoutAction() {
  redirect("/")
}

// Demo mode - instant access without registration
export async function quickStartDemo() {
  const demoEmail = `demo_${Date.now()}@deadlinesync.demo`
  const demoPassword = `demo${Math.random().toString(36).substring(7)}`

  try {
    // Create demo account via backend API
    const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: demoEmail,
        password: demoPassword,
        name: "Demo User",
      }),
    })

    if (!registerResponse.ok) {
      return { error: "Could not create demo account" }
    }

    // Auto-login to demo account
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: demoEmail,
        password: demoPassword,
      }),
    })

    if (loginResponse.ok) {
      redirect("/dashboard?demo=true")
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Demo mode failed' }
  }

  return { success: true }
}
