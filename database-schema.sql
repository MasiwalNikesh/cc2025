-- Create visitor_submissions table
CREATE TABLE IF NOT EXISTS visitor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  designation VARCHAR(255),
  context VARCHAR(20) NOT NULL CHECK (context IN ('consultation', 'quote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback_submissions table
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_submissions_created_at ON visitor_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_submissions_email ON visitor_submissions(email);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at ON feedback_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_rating ON feedback_submissions(rating);

-- Enable Row Level Security
ALTER TABLE visitor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts from anyone (for form submissions)
CREATE POLICY "Allow public inserts on visitor_submissions"
  ON visitor_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on feedback_submissions"
  ON feedback_submissions
  FOR INSERT
  WITH CHECK (true);

-- Optional: Create policies for reading data (adjust as needed for your auth setup)
-- CREATE POLICY "Allow authenticated reads on visitor_submissions"
--   ON visitor_submissions
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated reads on feedback_submissions"
--   ON feedback_submissions
--   FOR SELECT
--   USING (auth.role() = 'authenticated');
