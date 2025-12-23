-- Add gamification and sharing features
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gamification_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Deadline sharing table
CREATE TABLE IF NOT EXISTS deadline_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID REFERENCES deadlines(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  shared_with TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- Productivity insights table
CREATE TABLE IF NOT EXISTS productivity_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  deadlines_completed INTEGER DEFAULT 0,
  deadlines_missed INTEGER DEFAULT 0,
  productivity_score FLOAT DEFAULT 0,
  focus_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI suggestions table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deadline_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view shared deadlines"
  ON deadline_shares FOR SELECT
  USING (auth.uid()::text = ANY(shared_with) OR 
         auth.uid() IN (SELECT user_id FROM deadlines WHERE id = deadline_id));

CREATE POLICY "Users can manage their productivity insights"
  ON productivity_insights FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their AI suggestions"
  ON ai_suggestions FOR ALL
  USING (auth.uid() = user_id);
