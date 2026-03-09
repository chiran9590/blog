-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'professor', 'admin')),
  bio TEXT,
  designation TEXT,
  department TEXT,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[],
  category TEXT DEFAULT 'programming' CHECK (category IN ('programming', 'compiler-construction', 'data-structures', 'artificial-intelligence', 'big-data', 'machine-learning')),
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'programming' CHECK (category IN ('programming', 'compiler-construction', 'data-structures', 'artificial-intelligence', 'big-data', 'machine-learning')),
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  download_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_author_id ON notes(author_id);
CREATE INDEX IF NOT EXISTS idx_notes_published ON notes(published);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
CREATE INDEX IF NOT EXISTS idx_downloads_note_id ON downloads(note_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for notes
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-files', 'notes-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS)

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" ON posts
    FOR SELECT USING (published = true);

CREATE POLICY "Authors can view all their posts" ON posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can delete their comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comments" ON comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Likes table
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage their likes" ON likes
    FOR ALL USING (auth.uid() = user_id);

-- Notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published notes" ON notes
    FOR SELECT USING (published = true);

CREATE POLICY "Authors can view all their notes" ON notes
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Professors and admins can insert notes" ON notes
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('professor', 'admin')
        )
    );

CREATE POLICY "Authors can update their notes" ON notes
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their notes" ON notes
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all notes" ON notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Downloads table
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their downloads" ON downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Professors and admins can view all downloads" ON downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('professor', 'admin')
        )
    );

CREATE POLICY "Authenticated users can insert downloads" ON downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Anyone can view cover images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload cover images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can update their cover images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete their cover images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view notes files" ON storage.objects
    FOR SELECT USING (bucket_id = 'notes-files');

CREATE POLICY "Professors and admins can upload notes files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'notes-files' AND 
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('professor', 'admin')
        )
    );

CREATE POLICY "Professors and admins can update notes files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'notes-files' AND 
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('professor', 'admin')
        )
    );

CREATE POLICY "Professors and admins can delete notes files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'notes-files' AND 
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('professor', 'admin')
        )
    );
