import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SparkResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setChecking(false);
      }
    });
    // Also check hash params
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setChecking(false);
    }
    const timeout = setTimeout(() => setChecking(false), 3000);
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated!', description: 'You can now log in with your new password.' });
      navigate('/spark/auth?mode=login');
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SparkSubNav />
        <div className="pt-24 flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#ec9f00]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SparkSubNav />
      <div className="pt-24 pb-16 px-4 max-w-md mx-auto">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Set new password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none"
            placeholder="New password (min. 6 chars)" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none"
            placeholder="Confirm new password" />
          <button type="submit" disabled={loading}
            className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all disabled:opacity-50">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SparkResetPassword;
