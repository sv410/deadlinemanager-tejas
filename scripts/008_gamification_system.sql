-- Create Gamification System Tables

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  achievement_description TEXT,
  badge_icon VARCHAR(50),
  points_awarded INT DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User Gamification Points Table
CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_completed INT DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  level INT DEFAULT 1,
  level_progress INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Activity Log Table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  points_earned INT DEFAULT 0,
  deadline_id UUID REFERENCES deadlines(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Challenge Table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_name VARCHAR(255) NOT NULL,
  challenge_description TEXT,
  challenge_type VARCHAR(50),
  target_count INT,
  points_reward INT DEFAULT 100,
  difficulty VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Challenge Progress Table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, challenge_id, date)
);

-- Create Indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);
CREATE INDEX idx_user_gamification_user_id ON user_gamification(user_id);
CREATE INDEX idx_user_gamification_points ON user_gamification(total_points DESC);
CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created ON user_activity_log(created_at DESC);
CREATE INDEX idx_daily_challenges_active ON daily_challenges(is_active);
CREATE INDEX idx_user_challenge_progress_user_id ON user_challenge_progress(user_id);
CREATE INDEX idx_user_challenge_progress_date ON user_challenge_progress(date DESC);

-- Insert default daily challenges
INSERT INTO daily_challenges (challenge_name, challenge_description, challenge_type, target_count, points_reward, difficulty) VALUES
('Early Bird', 'Complete 2 deadlines before 9 AM', 'time-based', 2, 150, 'medium'),
('Productivity Master', 'Complete 5 deadlines in one day', 'volume', 5, 200, 'hard'),
('Calendar Sync Pro', 'Sync 3 deadlines to Google Calendar', 'integration', 3, 100, 'easy'),
('Meet Organizer', 'Create 2 Google Meet meetings', 'collaboration', 2, 150, 'medium'),
('Emailer', 'Send 5 email notifications', 'email', 5, 100, 'easy'),
('Night Owl', 'Complete 2 deadlines after 8 PM', 'time-based', 2, 150, 'medium'),
('Consistent Streak', 'Maintain a 7-day completion streak', 'habit', 7, 300, 'hard'),
('Team Player', 'Share 3 deadlines with team members', 'collaboration', 3, 200, 'medium');
