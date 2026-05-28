import React, { useState, useEffect } from 'react';
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LostItemsScreen from './src/screens/lost/LostItemsScreen';
import { authApi } from './src/api/authApi';
import { supabase } from './src/utils/supabase';
import { Session } from '@supabase/supabase-js';

type Screen = 'splash' | 'login' | 'register';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (screen === 'splash' || isInitializing) {
    return <SplashScreen onFinish={() => setScreen('login')} />;
  }

  // 3. If we have a valid session, show the real Lost Items Screen!
  if (session) {
    return <LostItemsScreen />;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigateToLogin={() => setScreen('login')} />;
  }

  return (
    <LoginScreen 
      onNavigateToRegister={() => setScreen('register')} 
      onLoginSuccess={() => console.log('Successfully logged in!')} 
    />
  );
}