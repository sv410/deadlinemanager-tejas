import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We&apos;ve sent you a confirmation email. Please click the link in the email to verify your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
                <p className="mb-2">Didn&apos;t receive the email?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your spam folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>
              <Button asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
