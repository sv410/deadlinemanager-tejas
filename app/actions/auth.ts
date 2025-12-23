"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  const supabase = await createServerClient()

  // Create user with auto-confirmation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If user was created, sign them in immediately
  if (data.user) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { error: "Account created but could not sign in. Please try logging in manually." }
    }

    redirect("/dashboard")
  }

  return { success: true }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function logoutAction() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/")
}

// Demo mode - instant access without registration
export async function quickStartDemo() {
  const demoEmail = `demo_${Date.now()}@deadlinesync.demo`
  const demoPassword = `demo${Math.random().toString(36).substring(7)}`

  const supabase = await createServerClient()

  // Create demo account
  const { data, error } = await supabase.auth.signUp({
    email: demoEmail,
    password: demoPassword,
    options: {
      data: {
        full_name: "Demo User",
        is_demo: true,
      },
    },
  })

  if (error) {
    return { error: "Could not create demo account" }
  }

  // Auto sign in
  if (data.user) {
    await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    })

    redirect("/dashboard?demo=true")
  }

  return { success: true }
}
