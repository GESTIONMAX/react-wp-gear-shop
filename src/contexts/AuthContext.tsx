import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearAuthData, recoverFromTokenError } from '@/utils/authRecovery';
import { UserRole, UserType } from '@/hooks/useAdmin';

interface AuthUserInfo {
  user: User | null;
  role: UserRole | null;
  userType: UserType | null;
  isInternal: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userInfo: AuthUserInfo;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<AuthUserInfo>({
    user: null,
    role: null,
    userType: null,
    isInternal: false,
  });

  // Fonction pour récupérer les informations utilisateur
  const fetchUserInfo = async (currentUser: User | null) => {
    if (!currentUser) {
      setUserInfo({
        user: null,
        role: null,
        userType: null,
        isInternal: false,
      });
      return;
    }

    try {
      // Récupérer les informations de rôle et type d'utilisateur
      const { data: userRoleData, error } = await supabase
        .from('user_roles')
        .select('role, user_type')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }

      const role = userRoleData?.role as UserRole || null;
      const userType = userRoleData?.user_type as UserType || 'external';
      const isInternal = userType === 'internal';

      setUserInfo({
        user: currentUser,
        role,
        userType,
        isInternal,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      setUserInfo({
        user: currentUser,
        role: null,
        userType: 'external',
        isInternal: false,
      });
    }
  };

  const refreshUserInfo = async () => {
    await fetchUserInfo(user);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);

        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
          await fetchUserInfo(session?.user ?? null);
        } else if (event === 'SIGNED_IN') {
          setSession(session);
          setUser(session?.user ?? null);
          await fetchUserInfo(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);

        // Handle specific refresh token errors
        if (error.message.includes('refresh') && error.message.includes('not found')) {
          console.log('Invalid refresh token detected, clearing auth data');
          recoverFromTokenError();
          return;
        }

        // Clear any invalid session data
        setSession(null);
        setUser(null);
        await fetchUserInfo(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        await fetchUserInfo(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Clear localStorage tokens before signing out
    clearAuthData();
    await supabase.auth.signOut();
    // Force clear state
    setSession(null);
    setUser(null);
    setUserInfo({
      user: null,
      role: null,
      userType: null,
      isInternal: false,
    });
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userInfo,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      refreshUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};