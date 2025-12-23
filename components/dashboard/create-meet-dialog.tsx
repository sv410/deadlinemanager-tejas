"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Video, Copy, Loader2 } from "lucide-react"

interface CreateMeetDialogProps {
  deadlineId: string
  deadlineTitle: string
  userId: string
  onMeetCreated?: (meetLink: string) => void
}

export function CreateMeetDialog({ deadlineId, deadlineTitle, userId, onMeetCreated }: CreateMeetDialogProps) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [meetLink, setMeetLink] = useState<string | null>(null)

  const handleCreateMeet = async () => {
    try {
      setIsCreating(true)
      const response = await fetch("/api/calendar/meet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          deadlineId,
          title: deadlineTitle,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMeetLink(data.meetLink)
        toast.success("Google Meet created successfully!")
        onMeetCreated?.(data.meetLink)
      } else {
        toast.error("Failed to create Google Meet")
      }
    } catch (error) {
      toast.error("Error creating Google Meet")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = () => {
    if (meetLink) {
      navigator.clipboard.writeText(meetLink)
      toast.success("Meet link copied to clipboard!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Video className="h-4 w-4" />
        Create Meet
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Google Meet</DialogTitle>
          <DialogDescription>Create a Google Meet link for "{deadlineTitle}"</DialogDescription>
        </DialogHeader>

        {!meetLink ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create a Google Meet link and add it to your calendar event. Share this link with team members
              to collaborate on this deadline.
            </p>

            <Button onClick={handleCreateMeet} disabled={isCreating} className="w-full">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Meet...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Create Google Meet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">✓ Google Meet created successfully!</p>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Meet Link:</p>
              <Input value={meetLink} readOnly className="mb-3" />
              <Button onClick={handleCopyLink} variant="outline" className="w-full" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>

            <Button onClick={() => setOpen(false)} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
