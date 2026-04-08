
-- Modules table (sections within a program)
CREATE TABLE public.spark_program_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.spark_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spark_program_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone"
ON public.spark_program_modules FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all modules"
ON public.spark_program_modules FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Lessons table
CREATE TABLE public.spark_program_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.spark_program_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 0,
  lesson_type TEXT NOT NULL DEFAULT 'video',
  content_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spark_program_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
ON public.spark_program_lessons FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all lessons"
ON public.spark_program_lessons FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_spark_program_modules_updated_at
BEFORE UPDATE ON public.spark_program_modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spark_program_lessons_updated_at
BEFORE UPDATE ON public.spark_program_lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
