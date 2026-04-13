import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { SparkReferDialog } from '@/components/spark/SparkReferDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ChevronDown, Play, Lock, ArrowLeft, Users, Award, CheckCircle2, Download, Video, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MODULE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&h=250&fit=crop',
];

const LESSON_THUMBNAILS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=200&h=120&fit=crop',
];

const SparkProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [referOpen, setReferOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ['spark-program', id],
    queryFn: async () => {
      const { data } = await supabase.from('spark_programs').select('*').eq('id', id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['spark-program-modules', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('spark_program_modules')
        .select('*')
        .eq('program_id', id!)
        .order('sort_order', { ascending: true });
      return data || [];
    },
    enabled: !!id,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['spark-program-lessons', id],
    queryFn: async () => {
      const moduleIds = modules.map((m: any) => m.id);
      if (moduleIds.length === 0) return [];
      const { data } = await supabase
        .from('spark_program_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('sort_order', { ascending: true });
      return data || [];
    },
    enabled: modules.length > 0,
  });

  const { data: enrollment } = useQuery({
    queryKey: ['my-enrollment', id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('program_enrollments')
        .select('*')
        .eq('user_id', user!.id)
        .eq('program_id', id!)
        .maybeSingle();
      return data;
    },
    enabled: !!user && !!id,
  });

  const { data: lessonProgress = [] } = useQuery({
    queryKey: ['my-lesson-progress', id, user?.id],
    queryFn: async () => {
      const lessonIds = lessons.map((l: any) => l.id);
      if (lessonIds.length === 0) return [];
      const { data } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('lesson_id', lessonIds)
        .eq('completed', true);
      return data || [];
    },
    enabled: !!user && lessons.length > 0,
  });

  
  const completedLessonIds = new Set(lessonProgress.map((p: any) => p.lesson_id));
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0;

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('program_enrollments').insert({
        user_id: user!.id,
        program_id: id!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollment', id] });
      toast({ title: 'Enrolled!', description: 'You have successfully enrolled in this program.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Could not enroll. Please try again.', variant: 'destructive' });
    },
  });

  const toggleLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const isCompleted = completedLessonIds.has(lessonId);
      if (isCompleted) {
        await supabase.from('lesson_progress').delete().eq('user_id', user!.id).eq('lesson_id', lessonId);
      } else {
        await supabase.from('lesson_progress').upsert({
          user_id: user!.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-lesson-progress', id] });
    },
  });

  const handleEnroll = () => {
    if (!user) {
      navigate('/spark/auth');
      return;
    }
    enrollMutation.mutate();
  };

  const getLessonsForModule = (moduleId: string) =>
    lessons.filter((l: any) => l.module_id === moduleId);

  const totalLessons = lessons.length;
  const totalDuration = lessons.reduce((acc: number, l: any) => acc + (l.duration_minutes || 0), 0);
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const lessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-3.5 h-3.5" />;
      case 'quiz': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'reading': return <BookOpen className="w-3.5 h-3.5" />;
      case 'exercise': return <Award className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  if (programLoading) {
    return (
      <div className="bg-white min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="programs" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="bg-white min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="programs" />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-extrabold text-gray-900">Program Not Found</h1>
          <Link to="/spark/programs" className="text-[#ec9f00] font-bold hover:underline">← Back to Programs</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={`${program.cool_name} — Spark Programs`} description={program.description || `Learn ${program.real_name} with Spark micro-credentials.`} />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="programs" />

        {/* Hero */}
        <section className="relative pt-20 md:pt-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={program.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop'}
              alt={program.cool_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24">
            <Link to="/spark/programs" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Programs
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-3 py-1 rounded-full border text-white"
                style={{ borderColor: program.color + '80', backgroundColor: program.color + '30' }}>
                {program.tag}
              </span>
              {program.status === 'coming_soon' && (
                <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-3 py-1 rounded-full bg-white/20 text-white/90 border border-white/30">
                  Coming Soon
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 leading-[0.95] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {program.cool_name}
            </h1>
            <p className="text-sm md:text-base uppercase tracking-[0.15em] text-white/60 font-bold mb-4">
              {program.real_name}
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed mb-8">
              {program.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              {program.duration && (
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{program.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/70">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-semibold">{totalLessons || program.lessons || 0} lessons</span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-2 text-white/70">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-semibold">{formatDuration(totalDuration)} total</span>
                </div>
              )}
              {program.price && (
                <div className="flex items-center gap-2 text-white">
                  <span className="text-lg font-extrabold">${Number(program.price).toFixed(0)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {program.status === 'coming_soon' ? (
                <span className="text-[11px] tracking-[0.12em] uppercase font-extrabold px-6 py-3 rounded-full bg-white/20 text-white/90 border border-white/30 backdrop-blur-sm">
                  Coming Soon
                </span>
              ) : enrollment ? (
                <Link to="/spark/my-programs" className="text-[11px] tracking-[0.12em] uppercase font-extrabold px-8 py-3.5 rounded-full text-white shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  style={{ backgroundColor: program.color }}>
                  <CheckCircle2 className="w-4 h-4" /> Enrolled · {progressPercentage}%
                </Link>
              ) : (
                <button onClick={handleEnroll} disabled={enrollMutation.isPending}
                  className="text-[11px] tracking-[0.12em] uppercase font-extrabold px-8 py-3.5 rounded-full text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                  style={{ backgroundColor: program.color }}>
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              {program.youtube_url && (
                <a href={program.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-bold px-6 py-3.5 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-all">
                  <Play className="w-4 h-4" /> Watch About
                </a>
              )}
              <button onClick={() => setReferOpen(true)}
                className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-bold px-6 py-3.5 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-all">
                <Users className="w-4 h-4" /> Refer a Friend
              </button>
            </div>
          </div>
        </section>

        {/* Progress Bar (enrolled users) */}
        {enrollment && (
          <section className="bg-white border-b border-gray-100 py-4 px-4 md:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500">
                  {completedLessonIds.size}/{totalLessons} lessons completed
                </span>
                <span className="text-sm font-extrabold" style={{ color: program.color }}>
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: program.color }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Course Curriculum */}
        <section className="py-16 md:py-24 px-4 md:px-12 max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-3 block">Course Curriculum</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              What You'll Learn
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              {modules.length > 0
                ? `${modules.length} modules · ${totalLessons} lessons · ${formatDuration(totalDuration)} of content`
                : 'Curriculum details coming soon. Check back for updates.'}
            </p>
          </div>

          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((mod: any, idx: number) => {
                const modLessons = getLessonsForModule(mod.id);
                const modDuration = modLessons.reduce((a: number, l: any) => a + (l.duration_minutes || 0), 0);
                const isExpanded = expandedModule === mod.id;
                const modThumb = MODULE_THUMBNAILS[idx % MODULE_THUMBNAILS.length];

                return (
                  <motion.div key={mod.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.4 }}
                    className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
                    style={{ boxShadow: isExpanded ? `0 8px 32px -8px ${program.color}25` : undefined }}>
                    
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full flex items-stretch text-left group">
                      {/* Module thumbnail */}
                      <div className="hidden md:block w-40 lg:w-48 flex-shrink-0 relative overflow-hidden">
                        <img src={modThumb} alt={mod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <span className="text-lg font-extrabold" style={{ color: program.color }}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center gap-4 p-5 md:p-6">
                        {/* Mobile number badge */}
                        <div className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0 shadow-md"
                          style={{ backgroundColor: program.color }}>
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{mod.title}</h3>
                          {mod.description && (
                            <p className="text-xs md:text-sm text-gray-400 mt-1 line-clamp-1">{mod.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: program.color + '15', color: program.color }}>
                              <BookOpen className="w-3 h-3" />
                              {modLessons.length} lesson{modLessons.length !== 1 ? 's' : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {formatDuration(modDuration)}
                            </span>
                            {modLessons.some((l: any) => l.is_free_preview) && (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                <Play className="w-3 h-3" /> Free Preview
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="overflow-hidden">
                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-2">
                            {modLessons.map((lesson: any, lIdx: number) => {
                              const lessonThumb = LESSON_THUMBNAILS[lIdx % LESSON_THUMBNAILS.length];
                              const isLessonCompleted = completedLessonIds.has(lesson.id);
                              return (
                                <motion.div key={lesson.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: lIdx * 0.05 }}
                                  className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all duration-200 group/lesson cursor-pointer ${
                                    isLessonCompleted
                                      ? 'bg-gradient-to-r from-emerald-50/60 to-white border border-emerald-100/50'
                                      : lesson.is_free_preview 
                                        ? 'bg-gradient-to-r from-emerald-50/80 to-white hover:from-emerald-50 border border-emerald-100/50' 
                                        : 'bg-gray-50/60 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                                  }`}>
                                  {/* Lesson thumbnail */}
                                  <div className="relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                    <img src={lessonThumb} alt={lesson.title} className="w-full h-full object-cover group-hover/lesson:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                      {lesson.is_free_preview ? (
                                        <Play className="w-5 h-5 text-white" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-white/80" />
                                      )}
                                    </div>
                                    {lesson.lesson_type === 'video' && (
                                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {lesson.duration_minutes > 0 ? formatDuration(lesson.duration_minutes) : '—'}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                        style={{ color: lesson.is_free_preview ? '#059669' : program.color }}>
                                        {lessonTypeIcon(lesson.lesson_type)}
                                      </div>
                                      <p className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</p>
                                    </div>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-400 mt-0.5 ml-7 truncate">{lesson.description}</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {enrollment && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); toggleLessonMutation.mutate(lesson.id); }}
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isLessonCompleted
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : 'border-gray-200 hover:border-gray-400'
                                        }`}>
                                        {isLessonCompleted && <CheckCircle2 className="w-4 h-4" />}
                                      </button>
                                    )}
                                    {lesson.is_free_preview && (
                                      <span className="hidden sm:inline-flex items-center gap-1 text-[9px] tracking-[0.1em] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                                        <Play className="w-3 h-3" /> Preview
                                      </span>
                                    )}
                                    <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-semibold text-gray-300 bg-white px-2 py-1 rounded border border-gray-100">
                                      {lesson.lesson_type}
                                    </span>
                                    {!lesson.is_free_preview && !enrollment && (
                                      <Lock className="w-3.5 h-3.5 text-gray-300" />
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">Curriculum Coming Soon</h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                We're putting the finishing touches on this program's curriculum. Check back soon for the full lesson breakdown.
              </p>
            </div>
          )}
        </section>
        <section className="py-16 md:py-20 px-4 md:px-6 text-center bg-gray-50">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join thousands of learners building real-world skills in hospitality, events, and tourism.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {program.status === 'coming_soon' ? (
              <span className="text-sm tracking-[0.08em] uppercase font-extrabold px-8 py-4 rounded-full bg-gray-200 text-gray-500">
                Coming Soon
              </span>
            ) : enrollment ? (
              <Link to="/spark/my-programs"
                className="text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                style={{ backgroundColor: program.color, boxShadow: `0 10px 25px -5px ${program.color}40` }}>
                <CheckCircle2 className="w-5 h-5" /> View My Programs
              </Link>
            ) : (
              <button onClick={handleEnroll} disabled={enrollMutation.isPending}
                className="text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                style={{ backgroundColor: program.color, boxShadow: `0 10px 25px -5px ${program.color}40` }}>
                {enrollMutation.isPending ? 'Enrolling...' : `Enroll Now — $${Number(program.price || 0).toFixed(0)}`}
              </button>
            )}
            <Link to="/spark/programs"
              className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-50 transition-all">
              Browse All Programs
            </Link>
          </div>
        </section>

        <SparkReferDialog open={referOpen} onClose={() => setReferOpen(false)} />
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkProgramDetails;
