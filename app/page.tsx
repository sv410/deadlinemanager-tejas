import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import Link from "next/link"
import {
  Clock,
  TrendingUp,
  Bell,
  BarChart3,
  Calendar,
  Zap,
  Shield,
  Target,
  ArrowRight,
  CheckCheck,
  Layers,
  Timer,
  Mail,
  Video,
  Smartphone,
  Globe,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-4 z-50 mx-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container mx-auto bg-zinc-900/80 backdrop-blur-2xl border border-orange-500/30 rounded-full shadow-2xl shadow-orange-500/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Features
              </Link>
              <Link
                href="#integrations"
                className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Integrations
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Benefits
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Testimonials
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                asChild
                className="transition-all hover:scale-105 hover:text-orange-500 rounded-full"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button
                asChild
                className="transition-all hover:scale-105 shadow-xl shadow-orange-500/30 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-black font-semibold rounded-full"
              >
                <Link href="/auth/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-white">Now with Email & Calendar Integration</span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-[1.1] text-white">
              Keep Your Team{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Aligned
              </span>
              <br />
              in Minutes
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 text-balance leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 max-w-3xl mx-auto">
              Never miss a deadline again. Get instant notifications via email, calendar, and Microsoft Teams—perfect
              for students and professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Button
                size="lg"
                asChild
                className="text-base px-10 py-7 transition-all hover:scale-105 shadow-2xl shadow-orange-500/40 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-black font-semibold rounded-2xl"
              >
                <Link href="/auth/sign-up">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base px-10 py-7 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 border-orange-500/30 hover:border-orange-500/50 text-white hover:bg-white/10 rounded-2xl"
              >
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>

            <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <div className="relative rounded-3xl border border-orange-500/20 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-orange-500/20 overflow-hidden">
                <div className="bg-black/60 p-4 border-b border-orange-500/20">
                  <div className="flex items-center gap-3 max-w-2xl mx-auto">
                    <div className="flex-1 h-11 bg-zinc-800/50 rounded-2xl flex items-center px-4 text-sm text-gray-400 border border-orange-500/20">
                      <Calendar className="h-4 w-4 mr-3 text-orange-500" />
                      Search projects
                    </div>
                    <Button
                      size="sm"
                      className="whitespace-nowrap h-11 px-5 bg-gradient-to-r from-orange-500 to-amber-600 text-black font-semibold hover:from-orange-600 hover:to-amber-700 rounded-2xl"
                    >
                      <span className="mr-1">+</span> Add Project
                    </Button>
                  </div>
                </div>

                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Timer, label: "Ongoing", value: "12", color: "from-orange-500 to-amber-500" },
                    { icon: Clock, label: "Pending", value: "8", color: "from-blue-500 to-cyan-500" },
                    { icon: Layers, label: "Total", value: "45", color: "from-orange-500 to-amber-600" },
                    { icon: CheckCheck, label: "Completed", value: "25", color: "from-green-500 to-emerald-500" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-zinc-800/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:scale-[1.02] hover:border-orange-500/40"
                    >
                      <div
                        className={`inline-flex h-9 w-9 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 shadow-lg`}
                      >
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="p-6 pt-0">
                  <div className="bg-zinc-800/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Ongoing Projects</h3>
                      <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        12
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        {
                          name: "Website Redesign",
                          progress: 75,
                          color: "bg-gradient-to-r from-amber-500 to-orange-500",
                        },
                        {
                          name: "Mobile App Development",
                          progress: 45,
                          color: "bg-gradient-to-r from-orange-500 to-amber-600",
                        },
                        {
                          name: "Marketing Campaign",
                          progress: 90,
                          color: "bg-gradient-to-r from-blue-500 to-cyan-500",
                        },
                      ].map((project, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-xl transition-all duration-200 hover:bg-zinc-700/50 border border-transparent hover:border-orange-500/20"
                        >
                          <div className={`h-2 w-2 rounded-full ${project.color} shrink-0 shadow-lg`} />
                          <span className="text-sm flex-1 text-gray-200">{project.name}</span>
                          <span className="text-xs text-gray-400">{project.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
              Built For Everyone
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-5 text-white">
              Perfect for Students & Professionals
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Whether you're managing assignments or leading teams, DeadlineSync adapts to your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-zinc-900 border border-orange-500/20 p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/40">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center mb-5 shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3 text-white">For Students</h3>
              <p className="text-gray-400 leading-relaxed mb-5">
                Manage assignments, group projects, and exam schedules effortlessly
              </p>
              <ul className="space-y-3">
                {[
                  "Track multiple course deadlines",
                  "Sync with academic calendar",
                  "Collaborate on group projects",
                  "Get reminders before due dates",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900 border border-orange-500/20 p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/40">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 items-center justify-center mb-5 shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3 text-white">For Professionals</h3>
              <p className="text-gray-400 leading-relaxed mb-5">
                Keep your team aligned with enterprise-grade project management
              </p>
              <ul className="space-y-3">
                {[
                  "Manage client deliverables",
                  "Microsoft Teams integration",
                  "Team collaboration features",
                  "Advanced analytics & reporting",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with rounded cards */}
      <section id="features" className="py-24 relative bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
              Features
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-5 text-white">Everything You Need</h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Powerful tools designed to help you stay organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: "Smart Tracking",
                description: "Intelligent deadline categorization with priority levels and custom tags",
              },
              {
                icon: Bell,
                title: "Multi-Channel Notifications",
                description: "Get alerts via email, push notifications, and Microsoft Teams",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Visual insights into productivity patterns and completion rates",
              },
              {
                icon: Calendar,
                title: "Calendar Sync",
                description: "Seamless integration with Google Calendar and Outlook",
              },
              {
                icon: Mail,
                title: "Email Reminders",
                description: "Automated email notifications before deadlines approach",
              },
              {
                icon: Video,
                title: "Teams Integration",
                description: "Direct notifications to Microsoft Teams channels",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-zinc-900 border border-orange-500/20 p-7 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/40 hover:-translate-y-1"
              >
                <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 items-center justify-center mb-5 transition-all group-hover:scale-110 shadow-lg shadow-orange-500/30">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="integrations" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
              Integrations
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-5 text-white">
              Connect With Your Favorite Tools
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Seamlessly integrate with the tools you already use every day
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Mail, name: "Email Notifications", desc: "Gmail, Outlook & more" },
              { icon: Calendar, name: "Calendar Sync", desc: "Google & Outlook Calendar" },
              { icon: Video, name: "Microsoft Teams", desc: "Direct channel notifications" },
              { icon: Smartphone, name: "Mobile Apps", desc: "iOS & Android push alerts" },
            ].map((integration, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-orange-500/20 p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:border-orange-500/40 hover:-translate-y-1"
              >
                <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 items-center justify-center mb-4 shadow-lg">
                  <integration.icon className="h-7 w-7 text-black" />
                </div>
                <h3 className="font-semibold text-white mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-400">{integration.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
              Simple Process
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5 text-white">Get Started in 3 Steps</h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Start managing deadlines effectively in just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up instantly—no email confirmation required. Start using immediately.",
              },
              {
                step: "02",
                title: "Add Your Deadlines",
                description: "Input tasks with dates, priorities, and categories. Connect your calendar.",
              },
              {
                step: "03",
                title: "Get Notified",
                description: "Receive smart alerts via email, Teams, and calendar before deadlines hit.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-500/60 to-transparent" />
                )}
                <div className="relative bg-zinc-900 border border-orange-500/20 p-8 rounded-3xl transition-all hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1 hover:border-orange-500/40">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-black text-xl font-bold mb-5 shadow-xl shadow-orange-500/40">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
              Success Stories
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-5 text-white">Loved by Thousands</h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              See what students and professionals are saying about DeadlineSync
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                role: "Computer Science Student",
                content:
                  "DeadlineSync helped me manage 5 courses and never miss a single assignment. The calendar integration is a game-changer!",
                rating: 5,
              },
              {
                name: "Michael Rodriguez",
                role: "Project Manager",
                content:
                  "Our team's productivity increased 40% since using DeadlineSync. The Teams integration keeps everyone aligned effortlessly.",
                rating: 5,
              },
              {
                name: "Emily Watson",
                role: "Graduate Student",
                content:
                  "The email reminders and mobile notifications ensure I never forget important research deadlines. Absolutely essential!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-orange-500/20 p-7 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:border-orange-500/40"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <div key={j} className="h-5 w-5 rounded-full bg-orange-500" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-5 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm font-medium text-orange-400 mb-4">
                Benefits
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5 text-white">Why Choose DeadlineSync?</h2>
              <p className="text-lg md:text-xl text-gray-400">Built for professionals who value their time</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Enterprise-grade encryption. Your data is protected and never shared.",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Built with modern tech for instant updates and smooth performance.",
                },
                {
                  icon: TrendingUp,
                  title: "Proven Results",
                  description: "Users report 40% improvement in meeting deadlines consistently.",
                },
                {
                  icon: Globe,
                  title: "Works Everywhere",
                  description: "Access from any device—desktop, mobile, or tablet. Always in sync.",
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 bg-zinc-900 border border-orange-500/20 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-0.5 hover:border-orange-500/40"
                >
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                    <benefit.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with smooth curves */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-amber-500/30 to-orange-600/30 rounded-[3rem] blur-3xl" />
            <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-[3rem] p-16 shadow-2xl shadow-orange-500/40">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5 text-balance text-black">
                Ready to Never Miss Another Deadline?
              </h2>
              <p className="text-xl mb-10 text-balance leading-relaxed text-black/80">
                Join thousands of students and professionals who stay on track with DeadlineSync
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-lg px-12 py-7 transition-all hover:scale-110 shadow-xl bg-black text-orange-500 hover:bg-zinc-900 border border-black/20 rounded-2xl font-semibold"
                >
                  <Link href="/auth/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-12 py-7 transition-all hover:scale-110 shadow-xl bg-white/10 backdrop-blur text-black hover:bg-white/20 border-2 border-black/20 rounded-2xl font-semibold"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-500/20 py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo />
            <div className="flex gap-6">
              <Link href="#features" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Features
              </Link>
              <Link href="#integrations" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Integrations
              </Link>
              <Link href="#benefits" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Benefits
              </Link>
            </div>
            <p className="text-sm text-gray-400">© 2025 DeadlineSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
