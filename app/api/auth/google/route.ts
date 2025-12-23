"use server"

import { redirect } from "next/navigation"
import { googleAuthUrl } from "@/lib/google-config"

export async function GET() {
  const authUrl = googleAuthUrl()
  redirect(authUrl)
}
