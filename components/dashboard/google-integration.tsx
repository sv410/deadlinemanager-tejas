"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Calendar, Mail, Video, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface GoogleIntegrationProps {
  userId: string
  isConnected: boolean
  onSync?: () => void
}

export function GoogleIntegration({ userId, isConnected, onSync }: GoogleIntegrationProps) {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success("Calendar synced successfully!")
        onSync?.()
      } else {
        toast.error("Failed to sync calendar")
      }
    } catch (error) {
      toast.error("Error syncing calendar")
      console.error(error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Connect Google Services
          </CardTitle>
          <CardDescription>Enable Google integration for enhanced features</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-amber-600">
            <a href="/api/auth/google">Connect Google Account</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Google Services Connected
        </CardTitle>
        <CardDescription>Your deadlines are synced with Google services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div className="text-sm">
              <p className="font-medium">Calendar Sync</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <Mail className="h-5 w-5 text-orange-500" />
            <div className="text-sm">
              <p className="font-medium">Email Reminders</p>
              <p className="text-xs text-gray-500">Enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <Video className="h-5 w-5 text-red-500" />
            <div className="text-sm">
              <p className="font-medium">Google Meet</p>
              <p className="text-xs text-gray-500">Ready</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSync} disabled={isSyncing} className="w-full" variant="outline">
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Sync Deadlines Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
