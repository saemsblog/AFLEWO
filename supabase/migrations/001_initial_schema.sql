-- AFLEWO Initial Schema

-- Chapters Table
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    established TEXT NOT NULL,
    venue TEXT NOT NULL,
    capacity TEXT,
    description TEXT,
    country TEXT DEFAULT 'Kenya',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT,
    end_time TEXT,
    type TEXT, -- Event, Rehearsal, Audition
    chapter_slug TEXT REFERENCES chapters(slug),
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alumni Table
CREATE TABLE alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    organization TEXT,
    bio TEXT,
    year_joined TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Allow public read-only access to chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to alumni" ON alumni FOR SELECT USING (true);
