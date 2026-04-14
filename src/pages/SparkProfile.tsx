import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Mail, Calendar, BookOpen, Loader2, Pencil, Lock, Check, X } from 'lucide-react';
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

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/spark/auth?mode=login');
        return;
      }
      setUser(session.user);

      const [profileRes, enrollRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('program_enrollments').select('id', { count: 'exact' }).eq('user_id', session.user.id),
      ]);
      setProfile(profileRes.data);
      setDisplayName(profileRes.data?.display_name || '');
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

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('user_id', user.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProfile({ ...profile, display_name: displayName.trim() });
      toast({ title: 'Profile updated' });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully' });
      setChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
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

  const name = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = name.slice(0, 2).toUpperCase();
  const joinedDate = new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <SparkSubNav activeLink="profile" />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Avatar & Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ec9f00] mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-black">{initials}</span>
            </div>
            {editing ? (
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-gray-900 text-center font-bold focus:border-[#ec9f00] focus:outline-none"
                  placeholder="Your name" autoFocus />
                <button onClick={handleSaveProfile} disabled={saving}
                  className="p-2 rounded-full bg-[#ec9f00] text-white hover:bg-[#d48e00] transition-colors disabled:opacity-50">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditing(false); setDisplayName(profile?.display_name || ''); }}
                  className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">{name}</h1>
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
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

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {changingPassword ? (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none"
                  placeholder="New password (min. 6 chars)" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none"
                  placeholder="Confirm new password" />
                <div className="flex gap-2">
                  <Button onClick={handleChangePassword} disabled={savingPassword} className="bg-[#ec9f00] hover:bg-[#d48e00] text-white rounded-xl">
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Password
                  </Button>
                  <Button variant="outline" onClick={() => { setChangingPassword(false); setNewPassword(''); setConfirmPassword(''); }} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button onClick={() => setChangingPassword(true)}
                className="w-full flex items-center gap-3 text-left text-gray-700 font-medium hover:text-gray-900 transition-colors">
                <Lock className="w-5 h-5 text-gray-400" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {/* Logout */}
          <Button onClick={handleLogout} disabled={loggingOut} variant="destructive" className="w-full py-6 text-base font-bold rounded-xl">
            {loggingOut ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogOut className="w-5 h-5 mr-2" />}
            {loggingOut ? 'Signing out…' : 'Sign Out'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SparkProfile;
