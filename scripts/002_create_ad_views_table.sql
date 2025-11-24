-- Create ad_views table to track ad watching for points
CREATE TABLE IF NOT EXISTS ad_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('video', 'banner', 'interstitial')),
  points_earned INTEGER NOT NULL DEFAULT 0,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ad metadata
  ad_provider TEXT,
  ad_id TEXT,
  completed BOOLEAN DEFAULT TRUE
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_ad_views_user_id ON ad_views(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_views_viewed_at ON ad_views(viewed_at);
