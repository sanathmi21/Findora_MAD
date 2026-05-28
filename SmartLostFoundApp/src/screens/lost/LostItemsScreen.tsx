import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authApi } from '../../api/authApi';

const LostItemsScreen = () => {
  // We can handle the logout directly from here now!
  const handleLogout = async () => {
    await authApi.logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lost Items Feed</Text>
      <Text style={styles.subtitle}>If you see this, your routing is working perfectly!</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0d7377', // Findora Teal
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#e6a817', // Findora Yellow
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#e6a817',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  }
});

export default LostItemsScreen;