
CREATE TABLE public.spark_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cool_name text NOT NULL,
  real_name text NOT NULL,
  tag text NOT NULL DEFAULT 'CORE',
  description text,
  duration text,
  lessons integer DEFAULT 0,
  color text NOT NULL DEFAULT '#ec9f00',
  image_url text,
  youtube_url text,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.spark_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all programs" ON public.spark_programs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published programs are viewable by everyone" ON public.spark_programs
  FOR SELECT TO public
  USING (published = true);

CREATE TABLE public.spark_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size integer,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.spark_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all media" ON public.spark_media
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Media is viewable by everyone" ON public.spark_media
  FOR SELECT TO public
  USING (true);
