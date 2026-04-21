import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowLeft, Mail, Calendar, BookOpen, Award, Shield, User as UserIcon, Activity, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { toast } from 'sonner';

const SparkAdminUserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/spark/auth'); return; }
      const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
      if (!data) { toast.error('Admin access required'); navigate('/spark'); return; }
      setIsAdmin(true);
      setAuthChecked(true);
    })();
  }, [navigate]);

  const { data: profile } = useQuery({
    queryKey: ['admin-user-profile', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', userId!).maybeSingle();
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['admin-user-roles-detail', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId!);
      return data || [];
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['admin-user-enrollments', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase
        .from('program_enrollments')
        .select('*, spark_programs(real_name, cool_name, tag, color, lessons)')
        .eq('user_id', userId!)
        .order('enrolled_at', { ascending: false });
      return data || [];
    },
  });

  const { data: lessonProgress = [] } = useQuery({
    queryKey: ['admin-user-lessons', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase.from('lesson_progress').select('*').eq('user_id', userId!).eq('completed', true);
      return data || [];
    },
  });

  const { data: quizAttempts = [] } = useQuery({
    queryKey: ['admin-user-quizzes', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*, module_quizzes(title)')
        .eq('user_id', userId!)
        .order('attempted_at', { ascending: false });
      return data || [];
    },
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['admin-user-event-regs', userId],
    enabled: !!userId && authChecked,
    queryFn: async () => {
      const { data } = await supabase.from('event_registrations').select('*').eq('user_id', userId!);
      return data || [];
    },
  });

  if (!authChecked) {
    return <div className="min-h-screen bg-[#0e0e14] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const passedQuizzes = quizAttempts.filter((q: any) => q.passed).length;
  const initial = (profile?.display_name || profile?.email || 'U')[0].toUpperCase();

  return (
    <>
      <SEOHead title={`${profile?.display_name || 'User'} — Admin`} description="User details" />
      <div className="min-h-screen bg-[#0e0e14] text-white font-[Nunito]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link to="/spark/admin" className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#d48e00] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>

          {!profile ? (
            <div className="text-center py-20 text-gray-400">User not found.</div>
          ) : (
            <>
              {/* Profile header */}
              <div className="bg-gradient-to-br from-[#1c1c26] to-[#15151c] border border-white/5 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-[#ec9f00]/15 flex items-center justify-center text-3xl font-black text-[#ec9f00]">{initial}</div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold">{profile.display_name || 'Anonymous Learner'}</h1>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile.email || '—'}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {format(new Date(profile.created_at), 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {roles.length > 0 ? roles.map((r: any) => (
                        <span key={r.role} className="text-[10px] uppercase tracking-[0.12em] font-bold px-3 py-1 rounded-full bg-[#ec9f00]/15 text-[#ec9f00] border border-[#ec9f00]/30 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> {r.role}
                        </span>
                      )) : (
                        <span className="text-[10px] uppercase tracking-[0.12em] font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Learner
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Programs Enrolled', value: enrollments.length, icon: BookOpen, color: '#ec9f00' },
                  { label: 'Lessons Completed', value: lessonProgress.length, icon: CheckCircle2, color: '#00C896' },
                  { label: 'Quizzes Passed', value: passedQuizzes, icon: Award, color: '#7B61FF' },
                  { label: 'Events Registered', value: registrations.length, icon: Activity, color: '#FF6B35' },
                ].map((s) => (
                  <div key={s.label} className="bg-[#1c1c26] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{s.label}</span>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Enrollments */}
              <div className="bg-[#1c1c26] border border-white/5 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#ec9f00]" /> Program Enrollments</h2>
                {enrollments.length === 0 ? (
                  <p className="text-gray-500 text-sm py-6 text-center">No program enrollments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {enrollments.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-[0.15em] font-extrabold px-2 py-0.5 rounded-full" style={{ color: e.spark_programs?.color, background: (e.spark_programs?.color || '#ec9f00') + '15' }}>{e.spark_programs?.tag}</span>
                            <span className="font-bold text-sm">{e.spark_programs?.real_name}</span>
                          </div>
                          <span className="text-[11px] text-gray-500 mt-1 block">Enrolled {format(new Date(e.enrolled_at), 'MMM dd, yyyy')}</span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.1em] font-bold px-2.5 py-1 rounded-full ${e.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>{e.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quiz attempts */}
              <div className="bg-[#1c1c26] border border-white/5 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-[#7B61FF]" /> Quiz Attempts</h2>
                {quizAttempts.length === 0 ? (
                  <p className="text-gray-500 text-sm py-6 text-center">No quizzes attempted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {quizAttempts.slice(0, 10).map((q: any) => (
                      <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div>
                          <span className="font-bold text-sm">{q.module_quizzes?.title || 'Quiz'}</span>
                          <span className="text-[11px] text-gray-500 mt-1 block">{format(new Date(q.attempted_at), 'MMM dd, yyyy • HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{q.score}/{q.total_questions}</span>
                          <span className={`text-[10px] uppercase tracking-[0.1em] font-bold px-2.5 py-1 rounded-full ${q.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{q.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity timeline */}
              <div className="bg-[#1c1c26] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#00C896]" /> Recent Activity</h2>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Account created on {format(new Date(profile.created_at), 'MMMM dd, yyyy')}</p>
                  <p>• Last profile update on {format(new Date(profile.updated_at), 'MMMM dd, yyyy')}</p>
                  <p>• {enrollments.length} active enrollments, {lessonProgress.length} lessons completed</p>
                  <p>• Registered for {registrations.length} event{registrations.length === 1 ? '' : 's'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SparkAdminUserDetails;