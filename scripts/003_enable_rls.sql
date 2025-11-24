-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Ad views policies
-- Users can view their own ad history
CREATE POLICY "Users can view own ad views" ON ad_views
  FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- Users can insert their own ad views
CREATE POLICY "Users can insert own ad views" ON ad_views
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
