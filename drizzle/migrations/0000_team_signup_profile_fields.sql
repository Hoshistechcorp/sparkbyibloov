ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS registration_type text,
  ADD COLUMN IF NOT EXISTS team_name text,
  ADD COLUMN IF NOT EXISTS interests text,
  ADD COLUMN IF NOT EXISTS consent_contact boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS profiles_team_name_lower_idx ON public.profiles (lower(team_name));
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE m jsonb := COALESCE(new.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, full_name, phone, language, location, registration_type, team_name, interests, consent_contact)
  VALUES (
    new.id,
    COALESCE(NULLIF(m->>'full_name',''), m->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    left(NULLIF(m->>'full_name',''), 100),
    left(NULLIF(m->>'phone',''), 30),
    left(NULLIF(m->>'language',''), 50),
    left(COALESCE(NULLIF(m->>'location',''), NULLIF(m->>'country','')), 150),
    CASE WHEN m->>'registration_type' IN ('team','individual') THEN m->>'registration_type' ELSE NULL END,
    left(NULLIF(trim(m->>'team_name'),''), 80),
    left(COALESCE(NULLIF(m->>'interests',''), NULLIF(m->>'interest','')), 1000),
    COALESCE((m->>'consent_contact')::boolean, false)
  );
  RETURN new;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;