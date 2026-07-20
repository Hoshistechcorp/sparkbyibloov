CREATE TABLE public.program_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.spark_programs(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.program_interest TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.program_interest TO authenticated;
GRANT ALL ON public.program_interest TO service_role;

ALTER TABLE public.program_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
  ON public.program_interest FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND length(name) <= 100
    AND length(trim(email)) > 0 AND length(email) <= 255
    AND length(trim(location)) > 0 AND length(location) <= 200
  );

CREATE POLICY "Admins can view all interest submissions"
  ON public.program_interest FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage interest submissions"
  ON public.program_interest FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_program_interest_program_id ON public.program_interest(program_id);
CREATE INDEX idx_program_interest_created_at ON public.program_interest(created_at DESC);