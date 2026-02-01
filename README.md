# 🎯 DeadlineSync - Never Miss Another Deadline

![DeadlineSync](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)

Smart deadline management for students and professionals. Track, prioritize, and complete tasks with intelligent insights and notifications.

## ✨ Features

- 📅 **Smart Deadline Management** - Create, track, and manage deadlines with ease
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📊 **Multiple View Modes** - List, Calendar, and Analytics views
- 🎨 **Modern UI** - Beautiful dark theme with orange accents
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔔 **Notifications** - Email and Teams integration support
- 📈 **Analytics** - Track your productivity and deadline completion
- 🗓️ **Calendar Integration** - Sync with Google Calendar and Outlook (coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A Supabase account ([Sign up here](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/sv410/deadline-manager.git
cd deadline-manager
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your **Project URL** and **anon public key**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up Database

Run the SQL scripts in your Supabase SQL Editor (in order):

1. Navigate to **SQL Editor** in Supabase Dashboard
2. Execute `scripts/001_create_tables.sql` to create the database schema
3. Execute `scripts/002_update_auth_settings.sql` to configure authentication

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Production

Ready to deploy? We've made it simple!

### Quick Deployment (Under 30 Minutes)

**👉 See [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) for the complete step-by-step process.**

This guide covers:
- Setting up Supabase (Database & Auth)
- Configuring Google OAuth
- Deploying to Vercel (Free!)
- All at $0/month cost

### Alternative Deployment Options

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment options (Vercel, Railway, Render)
- **[DEPLOY_NOW.md](DEPLOY_NOW.md)** - Quick reference for experienced developers
- **[GOING_LIVE_CHECKLIST.md](GOING_LIVE_CHECKLIST.md)** - Comprehensive launch checklist

## 📁 Project Structure

```
deadline-manager-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── calendar/sync/        # Calendar integration
│   │   └── notifications/        # Email & Teams notifications
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── sign-up/              # Sign up page
│   │   └── sign-up-success/      # Success page
│   ├── dashboard/                # Main dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── add-deadline-dialog.tsx
│   │   ├── calendar-view.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── deadline-card.tsx
│   │   ├── deadline-list.tsx
│   │   └── deadline-stats.tsx
│   └── ui/                       # Reusable UI components (shadcn/ui)
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase client setup
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── proxy.ts              # Proxy configuration
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── scripts/                      # Database scripts
│   ├── 001_create_tables.sql     # Database schema
│   └── 002_update_auth_settings.sql
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## 🗄️ Database Schema

The application uses the following main tables:

### `profiles`
- User profile information
- Linked to Supabase Auth users

### `deadlines`
- Deadline entries with:
  - Title, description
  - Deadline date and time
  - Priority level
  - Status (pending, completed, overdue)
  - Tags and category
  - User association

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Date Handling**: date-fns

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## 📝 Usage Guide

### Creating a Deadline

1. Log in to your account
2. Click the **"Add Deadline"** button
3. Fill in the details:
   - Title and description
   - Due date and time
   - Priority level (Low, Medium, High, Critical)
   - Category
   - Tags (optional)
4. Click **"Create Deadline"**

### View Modes

- **List View**: See all deadlines in a organized list
- **Calendar View**: Visualize deadlines on a calendar
- **Analytics View**: Track your productivity statistics

### Managing Deadlines

- ✅ Mark as complete
- ✏️ Edit deadline details
- 🗑️ Delete deadlines
- 🏷️ Filter by tags or category
- 🔔 Set up notifications

## 🔐 Authentication

The app uses Supabase Authentication with:
- Email/Password sign-up and login
- Secure session management
- Protected routes with middleware

## 🚧 Roadmap

- [ ] Google Calendar integration
- [ ] Outlook Calendar integration
- [ ] Microsoft Teams notifications
- [ ] Email reminders
- [ ] Recurring deadlines
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Browser extension

## 🐛 Troubleshooting

### Internal Server Error

**Issue**: Getting 500 errors when accessing the app

**Solution**:
1. Ensure `.env.local` has correct Supabase credentials
2. Verify database tables are created (run SQL scripts)
3. Check Supabase project is active and not paused
4. Restart the development server

### Authentication Issues

**Issue**: Can't log in or sign up

**Solution**:
1. Check Supabase auth settings are configured
2. Verify email confirmation is disabled for testing (or check email)
3. Ensure `002_update_auth_settings.sql` was executed

### Database Connection Errors

**Issue**: Can't fetch or create deadlines

**Solution**:
1. Verify Supabase URL and anon key are correct
2. Check Row Level Security (RLS) policies are set up
3. Ensure `001_create_tables.sql` was executed successfully

## 📄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and Auth by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Open an issue on GitHub

---

Made with ❤️ by sv410
