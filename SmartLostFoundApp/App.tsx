import React, { useState } from 'react';
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LostItemsScreen, {LostItem} from './src/screens/lost/LostItemsScreen';
import LostItemDetailsScreen from './src/screens/lost/LostItemDetailsScreen';


type Screen = 'splash' | 'login' | 'register' | 'lostItems' | 'lostItemDetails';
 
export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
 
  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('login')} />;
  }
 
  if (screen === 'register') {
    return <RegisterScreen onNavigateToLogin={() => setScreen('login')} />;
  }
 
  if (screen === 'lostItemDetails' && selectedItem) {
    return (
      <LostItemDetailsScreen
        item={selectedItem}
        onBack={() => setScreen('lostItems')}
      />
    );
  }
 
  if (screen === 'lostItems') {
    return (
      <LostItemsScreen
        onItemPress={(item) => {
          setSelectedItem(item);
          setScreen('lostItemDetails');
        }}
      />
    );
  }
 
  // Default: login
  return (
    <LoginScreen
      onNavigateToRegister={() => setScreen('register')}
      onLoginSuccess={() => setScreen('lostItems')}
    />
  );
}