-- Create Deadline Sharing and Collaboration Tables

-- Deadline Sharing Table
CREATE TABLE IF NOT EXISTS deadline_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID NOT NULL REFERENCES deadlines(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  share_type VARCHAR(50) NOT NULL DEFAULT 'viewer', -- 'viewer', 'editor', 'manager'
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(deadline_id, shared_with_user_id)
);

-- Deadline Comments/Collaboration Table
CREATE TABLE IF NOT EXISTS deadline_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID NOT NULL REFERENCES deadlines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Collaboration Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'member', 'viewer'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- AI Insights and Recommendations Table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50), -- 'recommendation', 'warning', 'celebration', 'suggestion'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  recommendation_action VARCHAR(255),
  priority VARCHAR(20), -- 'low', 'medium', 'high'
  is_actioned BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, insight_type, created_at)
);

-- Productivity Analytics Table
CREATE TABLE IF NOT EXISTS productivity_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  deadlines_created INT DEFAULT 0,
  deadlines_completed INT DEFAULT 0,
  deadlines_missed INT DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  avg_completion_time_minutes INT,
  peak_productivity_hour INT,
  total_work_minutes INT DEFAULT 0,
  focus_score INT DEFAULT 0, -- 0-100
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Deadline Timeline View Metadata
CREATE TABLE IF NOT EXISTS deadline_timeline_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID NOT NULL REFERENCES deadlines(id) ON DELETE CASCADE,
  urgency_score INT DEFAULT 50, -- 0-100, higher = more urgent
  category VARCHAR(100),
  estimated_effort_minutes INT,
  priority_level INT DEFAULT 3, -- 1-5, 1 = critical
  dependencies JSONB DEFAULT '[]'::jsonb,
  related_deadlines JSONB DEFAULT '[]'::jsonb,
  ai_risk_level VARCHAR(20), -- 'low', 'medium', 'high'
  ai_suggestion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_deadline_shares_deadline_id ON deadline_shares(deadline_id);
CREATE INDEX idx_deadline_shares_owner_id ON deadline_shares(owner_id);
CREATE INDEX idx_deadline_shares_shared_with ON deadline_shares(shared_with_user_id);
CREATE INDEX idx_deadline_comments_deadline_id ON deadline_comments(deadline_id);
CREATE INDEX idx_deadline_comments_user_id ON deadline_comments(user_id);
CREATE INDEX idx_deadline_comments_created ON deadline_comments(created_at DESC);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX idx_ai_insights_created ON ai_insights(created_at DESC);
CREATE INDEX idx_productivity_analytics_user_id ON productivity_analytics(user_id);
CREATE INDEX idx_productivity_analytics_date ON productivity_analytics(date DESC);
CREATE INDEX idx_deadline_timeline_deadline_id ON deadline_timeline_metadata(deadline_id);
CREATE INDEX idx_deadline_timeline_urgency ON deadline_timeline_metadata(urgency_score DESC);
