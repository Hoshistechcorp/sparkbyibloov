
CREATE TABLE public.program_live_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.spark_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT NOT NULL DEFAULT 'Spark Instructor',
  day_of_week TEXT NOT NULL DEFAULT 'Wednesday',
  time TEXT NOT NULL DEFAULT '7:00 PM WAT',
  meeting_url TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT true,
  next_session_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.program_live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live classes are viewable by everyone"
ON public.program_live_classes FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage all live classes"
ON public.program_live_classes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_live_classes_updated_at
BEFORE UPDATE ON public.program_live_classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
