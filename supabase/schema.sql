-- ==============================================================================
-- SCHOOLDIT DATABASE SCHEMA (Supabase PostgreSQL)
-- Tempat ngomong tanpa nama & forum komunitas.
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMMUNITIES / SCHOOLS
CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    city TEXT DEFAULT 'Indonesia',
    category TEXT DEFAULT 'Hobi',
    badge_color TEXT DEFAULT '#0284c7',
    description TEXT,
    banner_image TEXT,
    member_count INT DEFAULT 1,
    post_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ANONYMOUS SESSIONS
CREATE TABLE IF NOT EXISTS anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token TEXT UNIQUE NOT NULL,
    pseudonym TEXT NOT NULL,
    avatar TEXT NOT NULL,
    color TEXT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. POSTS
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id TEXT REFERENCES schools(id) ON DELETE SET NULL,
    school_name TEXT DEFAULT 's/semua',
    school_slug TEXT DEFAULT 'all',
    author_pseudonym TEXT NOT NULL,
    author_avatar TEXT NOT NULL,
    author_color TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    flair TEXT NOT NULL DEFAULT 'NGOBROL',
    post_type TEXT NOT NULL DEFAULT 'text',
    votes INT DEFAULT 1,
    comments_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    link_url TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration safety: ensure attachments column exists
ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- 4. ATTACHMENTS
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. POLLS & POLL OPTIONS
CREATE TABLE IF NOT EXISTS polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    total_votes INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    votes_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (poll_id, session_id)
);

-- 6. COMMENTS (Nested Hierarchy)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_pseudonym TEXT NOT NULL,
    author_avatar TEXT NOT NULL,
    author_color TEXT NOT NULL,
    content TEXT NOT NULL,
    votes INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. VOTES (Post & Comment Voting Tracking)
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    session_id TEXT NOT NULL,
    vote_direction INT NOT NULL CHECK (vote_direction IN (1, -1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (target_id, target_type, session_id)
);

-- 8. REPORTS (Moderation)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    post_title TEXT,
    target_content TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR SPEED
CREATE INDEX IF NOT EXISTS idx_posts_school ON posts(school_id);
CREATE INDEX IF NOT EXISTS idx_posts_flair ON posts(flair);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_id, target_type);

-- Row Level Security (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow Public Anonymous CRUD Policies
CREATE POLICY "Public Read Schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Public Insert Schools" ON schools FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Public Insert Posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Posts" ON posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete Posts" ON posts FOR DELETE USING (true);

CREATE POLICY "Public Read Comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public Insert Comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Comments" ON comments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete Comments" ON comments FOR DELETE USING (true);

CREATE POLICY "Public Read Polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Public Read Poll Options" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Public Vote" ON votes FOR ALL USING (true);
CREATE POLICY "Public Poll Vote" ON poll_votes FOR ALL USING (true);
CREATE POLICY "Public Read Reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Public Insert Reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Reports" ON reports FOR UPDATE USING (true);
CREATE POLICY "Public Delete Reports" ON reports FOR DELETE USING (true);

-- REALTIME REPLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE schools;

-- STORAGE BUCKET FOR VIDEOS & IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Media Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Public Media Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');
