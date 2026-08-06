-- 1. spark_media: hide created_by from public/authenticated readers
REVOKE SELECT ON public.spark_media FROM anon, authenticated;
GRANT SELECT (id, title, file_url, file_type, file_size, created_at) ON public.spark_media TO anon, authenticated;

-- 2. quiz_questions: hide correct_answer_index from learners
REVOKE SELECT ON public.quiz_questions FROM anon, authenticated;
GRANT SELECT (id, quiz_id, question_text, options, sort_order, created_at) ON public.quiz_questions TO authenticated;

-- 3. Admin-only access to full question rows (including answer key)
CREATE OR REPLACE FUNCTION public.admin_get_quiz_questions(_quiz_ids uuid[])
RETURNS TABLE (
  id uuid,
  quiz_id uuid,
  question_text text,
  options jsonb,
  correct_answer_index integer,
  sort_order integer,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
  SELECT q.id, q.quiz_id, q.question_text, q.options, q.correct_answer_index, q.sort_order, q.created_at
  FROM public.quiz_questions q
  WHERE q.quiz_id = ANY(_quiz_ids)
  ORDER BY q.sort_order;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_quiz_questions(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_quiz_questions(uuid[]) TO authenticated;

-- 4. Server-side quiz grading
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(_quiz_id uuid, _answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _total integer;
  _correct integer := 0;
  _percentage integer;
  _passing integer;
  _max_attempts integer;
  _used integer;
  _already_passed boolean;
  _passed boolean;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT passing_score, max_attempts INTO _passing, _max_attempts
  FROM public.module_quizzes WHERE id = _quiz_id;

  IF _passing IS NULL THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;

  SELECT count(*), coalesce(bool_or(passed), false)
  INTO _used, _already_passed
  FROM public.quiz_attempts WHERE quiz_id = _quiz_id AND user_id = _uid;

  IF _already_passed THEN
    RAISE EXCEPTION 'Quiz already passed';
  END IF;

  IF _used >= _max_attempts THEN
    RAISE EXCEPTION 'No attempts remaining';
  END IF;

  SELECT count(*) INTO _total FROM public.quiz_questions WHERE quiz_id = _quiz_id;
  IF _total = 0 THEN
    RAISE EXCEPTION 'Quiz has no questions';
  END IF;

  SELECT count(*) INTO _correct
  FROM (
    SELECT q.correct_answer_index,
           (row_number() OVER (ORDER BY q.sort_order, q.id) - 1)::text AS idx
    FROM public.quiz_questions q
    WHERE q.quiz_id = _quiz_id
  ) ranked
  WHERE (_answers ->> ranked.idx) IS NOT NULL
    AND (_answers ->> ranked.idx)::integer = ranked.correct_answer_index;

  _percentage := round((_correct::numeric / _total) * 100);
  _passed := _percentage >= _passing;

  INSERT INTO public.quiz_attempts (quiz_id, user_id, score, total_questions, passed, answers)
  VALUES (_quiz_id, _uid, _correct, _total, _passed, _answers);

  RETURN jsonb_build_object(
    'score', _correct,
    'total', _total,
    'percentage', _percentage,
    'passed', _passed
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quiz_attempt(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb) TO authenticated;

-- 5. Prevent client-side inserts of self-graded attempts
DROP POLICY IF EXISTS "Users can create own attempts" ON public.quiz_attempts;