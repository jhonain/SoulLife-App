import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../models/User';

export function useProfileViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user && !data.user.is_anonymous) {
      setIsLoggedIn(true);
      setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
      });
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    loading,
    isLoggedIn,
    handleSignOut,
  };
}
