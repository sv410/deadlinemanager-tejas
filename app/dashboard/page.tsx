import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const { data: deadlines } = await supabase
    .from("deadlines")
    .select("*")
    .eq("user_id", data.user.id)
    .order("deadline_date", { ascending: true })

  return <DashboardContent user={data.user} profile={profile} initialDeadlines={deadlines || []} />
}
