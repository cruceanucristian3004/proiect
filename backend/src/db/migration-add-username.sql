-- Add username column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Create index for username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update existing users to have username based on email (optional - for existing data)
-- UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL;