import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, Award, RotateCcw, Lock, ChevronRight } from 'lucide-react';

interface ModuleQuizProps {
  moduleId: string;
  moduleName: string;
  moduleIndex: number;
  programColor: string;
  userId: string | undefined;
  isEnrolled: boolean;
  onQuizPassed: () => void;
}

export const ModuleQuiz = ({ moduleId, moduleName, moduleIndex, programColor, userId, isEnrolled, onQuizPassed }: ModuleQuizProps) => {
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; total: number; passed: boolean; percentage: number } | null>(null);

  const { data: quiz } = useQuery({
    queryKey: ['module-quiz', moduleId],
    queryFn: async () => {
      const { data } = await supabase.from('module_quizzes').select('*').eq('module_id', moduleId).maybeSingle();
      return data;
    },
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['quiz-questions', quiz?.id],
    queryFn: async () => {
      const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz!.id).order('sort_order');
      return data || [];
    },
    enabled: !!quiz?.id,
  });

  const { data: attempts = [] } = useQuery({
    queryKey: ['quiz-attempts', quiz?.id, userId],
    queryFn: async () => {
      const { data } = await supabase.from('quiz_attempts').select('*').eq('quiz_id', quiz!.id).eq('user_id', userId!).order('attempted_at', { ascending: false });
      return data || [];
    },
    enabled: !!quiz?.id && !!userId,
  });

  const hasPassed = attempts.some((a: any) => a.passed);
  const attemptsUsed = attempts.length;
  const maxAttempts = quiz?.max_attempts || 3;
  const canRetake = !hasPassed && attemptsUsed < maxAttempts;
  const lastFailedAttempt = !hasPassed && attemptsUsed > 0;

  const submitMutation = useMutation({
    mutationFn: async () => {
      let correct = 0;
      questions.forEach((q: any, i: number) => {
        if (selectedAnswers[i] === q.correct_answer_index) correct++;
      });
      const percentage = Math.round((correct / questions.length) * 100);
      const passed = percentage >= (quiz?.passing_score || 70);

      const { error } = await supabase.from('quiz_attempts').insert({
        quiz_id: quiz!.id,
        user_id: userId!,
        score: correct,
        total_questions: questions.length,
        passed,
        answers: selectedAnswers,
      });
      if (error) throw error;
      return { score: correct, total: questions.length, passed, percentage };
    },
    onSuccess: (result) => {
      setLastResult(result);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', quiz?.id, userId] });
      if (result.passed) onQuizPassed();
    },
  });

  if (!quiz || questions.length === 0) return null;
  if (!isEnrolled) return null;

  // Already passed
  if (hasPassed && !showResults) {
    return (
      <div className="mx-5 md:mx-6 mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-700">Quiz Passed!</p>
          <p className="text-xs text-emerald-600">You've passed the {moduleName} quiz. Next module is unlocked.</p>
        </div>
      </div>
    );
  }

  // Must retake course
  if (!canRetake && !hasPassed && !showResults) {
    return (
      <div className="mx-5 md:mx-6 mb-5 p-4 rounded-xl bg-red-50 border border-red-200">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Quiz Failed — Retake Required</p>
            <p className="text-xs text-red-600">You've used all {maxAttempts} attempts. Please review the course material and contact support to reset your attempts.</p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz not started
  if (!quizStarted && !showResults) {
    return (
      <div className="mx-5 md:mx-6 mb-5 p-5 rounded-xl border-2 border-dashed" style={{ borderColor: programColor + '40', backgroundColor: programColor + '08' }}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: programColor }} />
              {quiz.title || 'Module Quiz'}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {questions.length} questions · Pass with {quiz.passing_score}% · {attemptsUsed}/{maxAttempts} attempts used
            </p>
            {lastFailedAttempt && (
              <p className="text-xs text-orange-600 mt-1 font-semibold">
                Previous attempt failed. Review the lessons above before retrying.
              </p>
            )}
          </div>
          <button
            onClick={() => { setQuizStarted(true); setCurrentQuestion(0); setSelectedAnswers({}); setShowResults(false); setLastResult(null); }}
            className="text-[11px] tracking-[0.1em] uppercase font-extrabold px-5 py-2.5 rounded-full text-white transition-all hover:scale-105"
            style={{ backgroundColor: programColor }}>
            {lastFailedAttempt ? 'Retry Quiz' : 'Start Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Results modal
  if (showResults && lastResult) {
    return (
      <div className="mx-5 md:mx-6 mb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-2xl border-2 text-center ${lastResult.passed ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
          
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${lastResult.passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {lastResult.passed ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500" />
            )}
          </motion.div>

          <h3 className={`text-2xl font-extrabold mb-1 ${lastResult.passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {lastResult.passed ? '🎉 Congratulations!' : '😔 Not Quite'}
          </h3>
          <p className={`text-sm mb-4 ${lastResult.passed ? 'text-emerald-600' : 'text-red-600'}`}>
            {lastResult.passed
              ? 'You passed the quiz! The next module is now unlocked.'
              : `You scored ${lastResult.percentage}%. You need ${quiz.passing_score}% to pass.`}
          </p>

          <div className="flex items-center justify-center gap-6 mb-5">
            <div className="text-center">
              <p className={`text-3xl font-extrabold ${lastResult.passed ? 'text-emerald-700' : 'text-red-700'}`}>{lastResult.percentage}%</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-700">{lastResult.score}/{lastResult.total}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Correct</p>
            </div>
          </div>

          {lastResult.passed ? (
            <button onClick={() => setShowResults(false)}
              className="text-[11px] tracking-[0.1em] uppercase font-extrabold px-6 py-2.5 rounded-full text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
              Continue Learning →
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {canRetake || attemptsUsed < maxAttempts ? (
                <button onClick={() => { setQuizStarted(true); setCurrentQuestion(0); setSelectedAnswers({}); setShowResults(false); setLastResult(null); }}
                  className="text-[11px] tracking-[0.1em] uppercase font-extrabold px-6 py-2.5 rounded-full text-white flex items-center gap-2"
                  style={{ backgroundColor: programColor }}>
                  <RotateCcw className="w-4 h-4" /> Retry Quiz ({maxAttempts - attemptsUsed} attempts left)
                </button>
              ) : (
                <p className="text-xs text-red-600 font-semibold">No attempts remaining. Please review the course material.</p>
              )}
              <button onClick={() => setShowResults(false)} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Review Lessons
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Quiz in progress
  const question = questions[currentQuestion] as any;
  const options = (question?.options || []) as string[];
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="mx-5 md:mx-6 mb-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border bg-white shadow-lg" style={{ borderColor: programColor + '30' }}>
        
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: programColor }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold">
            {Object.keys(selectedAnswers).length}/{questions.length} answered
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, backgroundColor: programColor }} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h4 className="text-base font-bold text-gray-900 mb-4">{question.question_text}</h4>
            <div className="space-y-2">
              {options.map((opt: string, i: number) => (
                <button key={i}
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: i })}
                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedAnswers[currentQuestion] === i
                      ? 'border-current bg-opacity-10'
                      : 'border-gray-100 hover:border-gray-200 text-gray-700'
                  }`}
                  style={selectedAnswers[currentQuestion] === i ? { borderColor: programColor, backgroundColor: programColor + '10', color: programColor } : undefined}>
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === i ? '' : 'border-gray-200 text-gray-400'
                    }`}
                      style={selectedAnswers[currentQuestion] === i ? { borderColor: programColor, backgroundColor: programColor, color: 'white' } : undefined}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors">
            ← Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="text-[11px] tracking-[0.08em] uppercase font-extrabold px-5 py-2 rounded-full text-white disabled:opacity-40 transition-all hover:scale-105 flex items-center gap-1"
              style={{ backgroundColor: programColor }}>
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => submitMutation.mutate()}
              disabled={!allAnswered || submitMutation.isPending}
              className="text-[11px] tracking-[0.08em] uppercase font-extrabold px-6 py-2.5 rounded-full text-white disabled:opacity-40 transition-all hover:scale-105"
              style={{ backgroundColor: programColor }}>
              {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {questions.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrentQuestion(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQuestion ? 'scale-125' : 'opacity-50'
              }`}
              style={{
                backgroundColor: selectedAnswers[i] !== undefined ? programColor : '#d1d5db',
                ...(i === currentQuestion ? { boxShadow: `0 0 0 3px ${programColor}30` } : {}),
              }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Lock overlay for modules that require previous quiz to pass
export const ModuleLockOverlay = ({ moduleIndex, programColor }: { moduleIndex: number; programColor: string }) => (
  <div className="mx-5 md:mx-6 mb-5 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
    <div>
      <p className="text-sm font-bold text-gray-600">Module Locked</p>
      <p className="text-xs text-gray-500">Pass the Module {moduleIndex} quiz to unlock this module.</p>
    </div>
  </div>
);
