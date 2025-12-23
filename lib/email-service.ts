import nodemailer from "nodemailer"
import { createServerClient } from "@/lib/supabase/server"

// Initialize Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD, // Use Gmail App Password
  },
})

export interface DeadlineNotification {
  userId: string
  deadlineId: string
  email: string
  deadlineTitle: string
  dueDate: Date
  description?: string
  priority?: string
}

export async function sendDeadlineReminder(notification: DeadlineNotification) {
  try {
    const daysUntil = Math.ceil((notification.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); padding: 20px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0;">DeadlineSync Reminder</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Deadline Alert</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${notification.deadlineTitle}</h3>
            <p style="margin: 10px 0; color: #6b7280;">
              <strong>Due Date:</strong> ${notification.dueDate.toLocaleDateString()} at ${notification.dueDate.toLocaleTimeString()}
            </p>
            ${notification.priority ? `<p style="margin: 10px 0; color: #6b7280;"><strong>Priority:</strong> ${notification.priority}</p>` : ""}
            ${notification.description ? `<p style="margin: 10px 0; color: #6b7280;"><strong>Description:</strong> ${notification.description}</p>` : ""}
            
            <p style="margin: 20px 0 0 0; font-size: 18px; font-weight: bold; color: #f97316;">
              ${daysUntil} days remaining
            </p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); color: black; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View in Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated reminder from DeadlineSync. Don't miss your deadlines!
          </p>
        </div>
      </div>
    `

    const result = await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: notification.email,
      subject: `DeadlineSync: "${notification.deadlineTitle}" due in ${daysUntil} days`,
      html: htmlContent,
      text: `Reminder: ${notification.deadlineTitle} is due on ${notification.dueDate.toLocaleDateString()} (${daysUntil} days remaining)`,
    })

    // Log notification to database
    const supabase = await createServerClient()
    await supabase.from("email_notifications").insert({
      user_id: notification.userId,
      deadline_id: notification.deadlineId,
      email_address: notification.email,
      notification_type: "reminder",
      send_at: new Date(),
      sent_at: new Date(),
      status: "sent",
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Failed to send deadline reminder:", error)

    // Log failure to database
    const supabase = await createServerClient()
    await supabase.from("email_notifications").insert({
      user_id: notification.userId,
      deadline_id: notification.deadlineId,
      email_address: notification.email,
      notification_type: "reminder",
      send_at: new Date(),
      status: "failed",
      error_message: String(error),
    })

    return { success: false, error: String(error) }
  }
}

export async function sendDeadlineCreatedNotification(
  notification: Omit<DeadlineNotification, "priority">,
) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); padding: 20px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0;">New Deadline Created</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <p style="color: #6b7280;">A new deadline has been added to your DeadlineSync dashboard.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${notification.deadlineTitle}</h3>
            <p style="margin: 10px 0; color: #6b7280;">
              <strong>Due Date:</strong> ${notification.dueDate.toLocaleDateString()} at ${notification.dueDate.toLocaleTimeString()}
            </p>
            ${notification.description ? `<p style="margin: 10px 0; color: #6b7280;"><strong>Description:</strong> ${notification.description}</p>` : ""}
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); color: black; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Deadline
            </a>
          </div>
        </div>
      </div>
    `

    const result = await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: notification.email,
      subject: `DeadlineSync: New deadline "${notification.deadlineTitle}"`,
      html: htmlContent,
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Failed to send deadline created notification:", error)
    return { success: false, error: String(error) }
  }
}

export async function sendBulkReminders() {
  try {
    const supabase = await createServerClient()

    // Get all pending reminders that should be sent
    const { data: pendingNotifications, error: queryError } = await supabase
      .from("email_notifications")
      .select("*, users(email), deadlines(title, description, due_date)")
      .eq("status", "pending")
      .lte("send_at", new Date().toISOString())

    if (queryError) {
      console.error("Failed to fetch pending notifications:", queryError)
      return { success: false, error: String(queryError) }
    }

    const results = []
    for (const notification of pendingNotifications || []) {
      const result = await sendDeadlineReminder({
        userId: notification.user_id,
        deadlineId: notification.deadline_id,
        email: notification.users.email,
        deadlineTitle: notification.deadlines.title,
        dueDate: new Date(notification.deadlines.due_date),
        description: notification.deadlines.description,
      })
      results.push(result)
    }

    return { success: true, sentCount: results.filter((r) => r.success).length }
  } catch (error) {
    console.error("Failed to send bulk reminders:", error)
    return { success: false, error: String(error) }
  }
}
