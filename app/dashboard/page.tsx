import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = hasSupabase ? await createClient() : null

  let { data, error } = supabase ? await supabase.auth.getUser() : { data: null, error: null }
  let user = supabase && !error && data?.user ? data.user : null

  if (supabase && !user) {
    const demoEmail = `demo_${Date.now()}@deadlinesync.demo`
    const demoPassword = `demo${Math.random().toString(36).substring(7)}`
    const { data: signUpData } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        data: {
          full_name: "Guest",
          is_demo: true,
        },
      },
    })
    if (signUpData?.user) {
      await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword })
      const result = await supabase.auth.getUser()
      user = result.data.user ?? null
    }
  }

  const { data: profile } =
    supabase && user ? await supabase.from("profiles").select("*").eq("id", user.id).single() : { data: null }

  const { data: deadlines } = supabase && user
    ? await supabase
        .from("deadlines")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline_date", { ascending: true })
    : { data: [] }

  return <DashboardContent user={user} profile={profile} initialDeadlines={deadlines || []} />
}
