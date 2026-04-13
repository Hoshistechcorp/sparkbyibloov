import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { supabase } from '@/integrations/supabase/client';
import { User, LogOut, Mail, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SparkProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/spark/auth');
        return;
      }
      setUser(session.user);

      const [profileRes, enrollRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('program_enrollments').select('id', { count: 'exact' }).eq('user_id', session.user.id),
      ]);
      setProfile(profileRes.data);
      setEnrollmentCount(enrollRes.count || 0);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    toast({ title: 'Signed out', description: 'You have been logged out successfully.' });
    navigate('/spark');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SparkSubNav activeLink="profile" />
        <div className="pt-24 flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#ec9f00]" />
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const joinedDate = new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <SparkSubNav activeLink="profile" />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Avatar & Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ec9f00] to-[#00C896] mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-black">{displayName[0].toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">{displayName}</h1>
            <p className="text-gray-500 text-sm mt-1">Spark Learner</p>
          </div>

          {/* Info Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <div className="flex items-center gap-4 p-5">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Member Since</p>
                <p className="text-gray-900 font-medium">{joinedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Enrolled Programs</p>
                <p className="text-gray-900 font-medium">{enrollmentCount} program{enrollmentCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
            className="w-full py-6 text-base font-bold rounded-xl"
          >
            {loggingOut ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogOut className="w-5 h-5 mr-2" />}
            {loggingOut ? 'Signing out…' : 'Sign Out'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SparkProfile;
