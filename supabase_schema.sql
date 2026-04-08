-- Hostel Care: Supabase Database Schema
-- Project Prefix: hc_ (Hostel Care)
-- Branded: Gold & Black Elite Management

-- 1. PROFILES TABLE
-- Stores extended user information for both Students and Wardens
CREATE TABLE public.hc_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CONSTRAINT chk_hc_role CHECK (role IN ('student', 'warden')),
    room_number TEXT, -- Used by students
    department_id TEXT, -- Used by wardens
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COMPLAINTS TABLE
-- Core engine for maintenance requests
CREATE TABLE public.hc_complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.hc_profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CONSTRAINT chk_hc_category CHECK (category IN ('Electrical', 'Plumbing', 'Carpentry', 'Safety', 'Facility', 'Other')),
    status TEXT DEFAULT 'pending' CONSTRAINT chk_hc_status CHECK (status IN ('pending', 'in-progress', 'resolved', 'declined')),
    priority TEXT DEFAULT 'normal' CONSTRAINT chk_hc_priority CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
    warden_id UUID REFERENCES public.hc_profiles(id), -- The warden assigned or who resolved it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPLAINT COMMENTS
-- Two-way communication thread for specific tickets
CREATE TABLE public.hc_complaint_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.hc_complaints(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.hc_profiles(id) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ANNOUNCEMENTS (BULLETINS)
-- Warden-to-Student broadcasts
CREATE TABLE public.hc_announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    warden_id UUID REFERENCES public.hc_profiles(id) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) SETTINGS
ALTER TABLE public.hc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_announcements ENABLE ROW LEVEL SECURITY;

-- hc_profiles: Users can view all profiles but only edit their own
CREATE POLICY "hc_profiles_view_all" ON public.hc_profiles FOR SELECT USING (true);
CREATE POLICY "hc_profiles_update_own" ON public.hc_profiles FOR UPDATE USING (auth.uid() = id);

-- hc_complaints: 
-- Students can only see their own complaints
-- Wardens can see ALL complaints
CREATE POLICY "hc_complaints_select" ON public.hc_complaints FOR SELECT USING (
    auth.uid() = student_id OR (SELECT role FROM public.hc_profiles WHERE id = auth.uid()) = 'warden'
);
CREATE POLICY "hc_complaints_insert_student" ON public.hc_complaints FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "hc_complaints_update_warden" ON public.hc_complaints FOR UPDATE USING (
    (SELECT role FROM public.hc_profiles WHERE id = auth.uid()) = 'warden'
);

-- hc_complaint_comments:
CREATE POLICY "hc_comments_select" ON public.hc_complaint_comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.hc_complaints c 
        WHERE c.id = complaint_id 
        AND (c.student_id = auth.uid() OR (SELECT role FROM public.hc_profiles WHERE id = auth.uid()) = 'warden')
    )
);
CREATE POLICY "hc_comments_insert" ON public.hc_complaint_comments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.hc_complaints c 
        WHERE c.id = complaint_id 
        AND (c.student_id = auth.uid() OR (SELECT role FROM public.hc_profiles WHERE id = auth.uid()) = 'warden')
    )
);

-- hc_announcements:
CREATE POLICY "hc_announcements_view_all" ON public.hc_announcements FOR SELECT USING (true);
CREATE POLICY "hc_announcements_insert_warden" ON public.hc_announcements FOR INSERT WITH CHECK (
    (SELECT role FROM public.hc_profiles WHERE id = auth.uid()) = 'warden'
);
