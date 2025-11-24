-- Create users table to store user profiles and subscription data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'monthly', 'yearly')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'expired', 'cancelled')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Payment tracking
  last_payment_tx_ref TEXT,
  last_payment_amount NUMERIC,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Points and usage
  points INTEGER DEFAULT 0,
  games_played_today INTEGER DEFAULT 0,
  last_game_date DATE,
  total_games_played INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to reset daily game count
CREATE OR REPLACE FUNCTION reset_daily_games()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_game_date IS NULL OR NEW.last_game_date < CURRENT_DATE THEN
    NEW.games_played_today := 0;
    NEW.last_game_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily game reset
DROP TRIGGER IF EXISTS reset_games_trigger ON users;
CREATE TRIGGER reset_games_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION reset_daily_games();
