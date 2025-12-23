"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Plus } from "lucide-react"
import type { Deadline, Priority } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AddDeadlineDialogProps {
  userId: string
  onDeadlineAdded: (deadline: Deadline) => void
}

export function AddDeadlineDialog({ userId, onDeadlineAdded }: AddDeadlineDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadlineDate, setDeadlineDate] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [category, setCategory] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("deadlines")
        .insert({
          user_id: userId,
          title,
          description: description || null,
          deadline_date: new Date(deadlineDate).toISOString(),
          priority,
          category,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          deadlineId: data.id,
          type: "created",
        }),
      })

      onDeadlineAdded(data)
      setOpen(false)
      // Reset form
      setTitle("")
      setDescription("")
      setDeadlineDate("")
      setPriority("medium")
      setCategory("")

      toast({
        title: "Deadline created!",
        description: "Your deadline has been added successfully.",
      })
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create deadline",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full shadow-lg shadow-orange-500/30 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all hover:scale-105">
          <Plus className="h-4 w-4" />
          Add Deadline
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] rounded-3xl border-orange-500/20">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Deadline</DialogTitle>
            <DialogDescription>Create a new deadline to track. Fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Final Project Submission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-2xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this deadline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline Date *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-2xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)} disabled={isLoading}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g., School, Work, Personal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-2xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              {isLoading ? "Creating..." : "Create Deadline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
