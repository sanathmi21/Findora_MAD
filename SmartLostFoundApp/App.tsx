import React, { useState } from 'react';
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

type Screen = 'splash' | 'login' | 'register';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('login')} />;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigateToLogin={() => setScreen('login')} />;
  }

  return <LoginScreen 
  onNavigateToRegister={() => setScreen('register')} 
  onLoginSuccess={() => console.log('Login Success')}/>;
}