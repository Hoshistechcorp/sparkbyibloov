CREATE POLICY "Users can delete their own progress"
  ON public.lesson_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);