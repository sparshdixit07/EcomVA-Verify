import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await authService.me();
      setUser(data?.user || null);
      return data?.user || null;
    } catch (err) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await authService.me();
        if (active) setUser(data?.user || null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) {
          setLoading(false);
          setBootstrapped(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  const login = useCallback(async (payload) => {
    const data = await authService.login(payload);
    setUser(data?.user || null);
    return data?.user || null;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data?.user || null);
    return data?.user || null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      bootstrapped,
      isAuthenticated: !!user,
      role: user?.role || null,
      login,
      register,
      logout,
      refresh,
      setUser
    }),
    [user, loading, bootstrapped, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}