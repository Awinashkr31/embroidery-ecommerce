CREATE TABLE IF NOT EXISTS public.admin_fcm_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, token)
);

ALTER TABLE public.admin_fcm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert their own tokens" ON public.admin_fcm_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view their own tokens" ON public.admin_fcm_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete their own tokens" ON public.admin_fcm_tokens
    FOR DELETE USING (auth.uid() = user_id);
