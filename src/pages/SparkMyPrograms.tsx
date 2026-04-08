import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Play, CheckCircle2, ArrowRight, GraduationCap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const SparkMyPrograms = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: enrollments = [], isLoading: enrollLoading } = useQuery({
    queryKey: ['my-enrollments', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('program_enrollments')
        .select('*, spark_programs(*)')
        .eq('user_id', user!.id)
        .order('enrolled_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['my-all-progress', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('completed', true);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: allModules = [] } = useQuery({
    queryKey: ['all-modules-for-enrolled'],
    queryFn: async () => {
      const programIds = enrollments.map((e: any) => e.program_id);
      if (programIds.length === 0) return [];
      const { data } = await supabase
        .from('spark_program_modules')
        .select('*')
        .in('program_id', programIds);
      return data || [];
    },
    enabled: enrollments.length > 0,
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ['all-lessons-for-enrolled', allModules.length],
    queryFn: async () => {
      const moduleIds = allModules.map((m: any) => m.id);
      if (moduleIds.length === 0) return [];
      const { data } = await supabase
        .from('spark_program_lessons')
        .select('*')
        .in('module_id', moduleIds);
      return data || [];
    },
    enabled: allModules.length > 0,
  });

  const getProgramProgress = (programId: string) => {
    const mods = allModules.filter((m: any) => m.program_id === programId);
    const modIds = mods.map((m: any) => m.id);
    const programLessons = allLessons.filter((l: any) => modIds.includes(l.module_id));
    const completedLessons = allProgress.filter((p: any) =>
      programLessons.some((l: any) => l.id === p.lesson_id)
    );
    const total = programLessons.length;
    const completed = completedLessons.length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  if (authLoading) {
    return (
      <div className="bg-white min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="my programs" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/spark/auth" replace />;
  }

  const totalCompleted = allProgress.length;
  const totalLessonsAll = allLessons.length;
  const overallPercentage = totalLessonsAll > 0 ? Math.round((totalCompleted / totalLessonsAll) * 100) : 0;

  return (
    <>
      <SEOHead title="My Programs — Spark" description="Track your learning progress across all enrolled Spark programs." />
      <div className="bg-gray-50 text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="my programs" />

        {/* Header */}
        <section className="pt-24 md:pt-28 pb-8 px-4 md:px-12 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-2 block">My Learning</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">My Programs</h1>
              <p className="text-gray-400 text-base mb-6">Track your progress and continue learning.</p>
            </motion.div>

            {/* Stats */}
            {enrollments.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-[#ec9f00]/10 to-[#ec9f00]/5 rounded-2xl p-4 border border-[#ec9f00]/10">
                  <GraduationCap className="w-5 h-5 text-[#ec9f00] mb-2" />
                  <p className="text-2xl font-extrabold text-gray-900">{enrollments.length}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Enrolled</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                  <p className="text-2xl font-extrabold text-gray-900">{totalCompleted}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Lessons Done</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-4 border border-blue-100">
                  <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-2xl font-extrabold text-gray-900">{totalLessonsAll}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Lessons</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl p-4 border border-purple-100">
                  <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-2xl font-extrabold text-gray-900">{overallPercentage}%</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Overall Progress</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Enrolled Programs */}
        <section className="py-10 md:py-16 px-4 md:px-12 max-w-6xl mx-auto">
          {enrollLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enrollments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2">No Programs Yet</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">You haven't enrolled in any programs yet. Explore our catalog and start your learning journey!</p>
              <Link to="/spark/programs"
                className="inline-flex items-center gap-2 bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3.5 rounded-full hover:bg-[#d48e00] transition-colors shadow-md">
                Browse Programs <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {enrollments.map((enrollment: any, idx: number) => {
                const program = enrollment.spark_programs;
                if (!program) return null;
                const progress = getProgramProgress(program.id);

                return (
                  <motion.div key={enrollment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}>
                    <Link to={`/spark/programs/${program.id}`}
                      className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-56 lg:w-64 h-40 md:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={program.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop'}
                            alt={program.cool_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                            <span className="text-[9px] tracking-[0.15em] uppercase font-extrabold px-2.5 py-1 rounded-full text-white border"
                              style={{ borderColor: program.color + '80', backgroundColor: program.color + '50' }}>
                              {program.tag}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 group-hover:text-gray-700 transition-colors">
                                  {program.cool_name}
                                </h3>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">{program.real_name}</p>
                              </div>
                              <span className={`text-[9px] tracking-[0.1em] uppercase font-extrabold px-3 py-1 rounded-full flex-shrink-0 ${
                                progress.percentage === 100
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-[#ec9f00]/10 text-[#c48500] border border-[#ec9f00]/20'
                              }`}>
                                {progress.percentage === 100 ? 'Completed' : enrollment.status === 'active' ? 'In Progress' : enrollment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">{program.description}</p>
                          </div>

                          {/* Progress bar */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-gray-500">
                                {progress.completed}/{progress.total} lessons completed
                              </span>
                              <span className="text-sm font-extrabold" style={{ color: program.color }}>
                                {progress.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.percentage}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 + 0.3, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: program.color }}
                              />
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                              {program.duration && (
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {program.duration}</span>
                              )}
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {progress.total} lessons</span>
                              <span className="ml-auto text-[#c48500] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Continue <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <SparkFooter />
      </div>
    </>
  );
};

export default SparkMyPrograms;
