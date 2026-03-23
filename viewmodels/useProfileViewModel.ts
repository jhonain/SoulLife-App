// useProfileViewModel.ts
// ViewModel de la pantalla de perfil
// [MODIFICADO] - Agregado isAdmin para detectar rol de administrador desde app_metadata

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../models/User';

export function useProfileViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setIsAdmin(session.user.app_metadata?.role === 'admin');
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
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
      setIsAdmin(data.user.app_metadata?.role === 'admin');
      setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
      });
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    handleSignOut,
  };
}
