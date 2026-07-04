-- 1. Create the gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    chapter TEXT NOT NULL,
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    public_id TEXT, -- For Cloudinary/R2 reference
    width INTEGER,
    height INTEGER,
    is_wide BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true
);

-- 2. Set up RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Anyone can view active gallery images
CREATE POLICY "Gallery images are viewable by everyone." 
    ON public.gallery_images FOR SELECT 
    USING (is_active = true);

-- Only admins can insert
CREATE POLICY "Admins can insert gallery images." 
    ON public.gallery_images FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'chapter_admin')
        )
    );

-- Only admins can update
CREATE POLICY "Admins can update gallery images." 
    ON public.gallery_images FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'chapter_admin')
        )
    );

-- Only admins can delete
CREATE POLICY "Admins can delete gallery images." 
    ON public.gallery_images FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'chapter_admin')
        )
    );
