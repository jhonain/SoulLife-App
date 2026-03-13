import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuthViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: username },
        },
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message ?? 'Error al registrarse');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message ?? 'Error al iniciar sesión');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message ?? 'Error al iniciar sesión con Google');
      return null;
    } finally {
      setLoading(false);
    }
  };


  const validateRegister = (email: string, password: string, username: string, confirmPassword: string) => {
    const errors = { username: '', email: '', password: '', confirmPassword: '' };
    let hasErrors = false;

    if (!username.trim()) {
      errors.username = 'El nombre es obligatorio';
      hasErrors = true;
    }

    if (!email.trim()) {
      errors.email = 'El correo es obligatorio';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'El correo no es válido';
      hasErrors = true;
    }

    if (!password.trim()) {
      errors.password = 'La contraseña es obligatoria';
      hasErrors = true;
    } else if (password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
      hasErrors = true;
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirma tu contraseña';
      hasErrors = true;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      hasErrors = true;
    }

    return { errors, hasErrors };
  };


  const validateLogin = (email: string, password: string) => {
    const errors = { email: '', password: '' };
    let hasErrors = false;

    if (!email.trim()) {
      errors.email = 'El correo es obligatorio';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'El correo no es válido';
      hasErrors = true;
    }

    if (!password.trim()) {
      errors.password = 'La contraseña es obligatoria';
      hasErrors = true;
    }

    return { errors, hasErrors };
  };
  const clearError = () => setError(null);

  return {
    loading,
    error,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    clearError,
    validateRegister,
    validateLogin,
  };
}
