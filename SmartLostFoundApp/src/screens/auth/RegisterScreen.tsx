import React, { useState, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Platform,StatusBar,KeyboardAvoidingView,ScrollView,Animated,Image,Dimensions,Alert} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../../utils/supabase';
import { authApi } from '../../api/authApi';

const { height } = Dimensions.get('window');

interface Props {
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<Props> = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  // Add this to your existing states inside RegisterScreen
  const [loading, setLoading] = useState(false);

  // Replace your handleRegister with this:
  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    const {error } = await authApi.register(email, password, username);

    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Success!', 'Your account has been created. Please check your email for a verification link.');
      onNavigateToLogin();
    }
  };

  const handleUploadPhoto = () => {
    console.log('Upload photo pressed');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      {/* Fixed header: back + brand */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0d7377" />
        </TouchableOpacity>
        <Text style={styles.brandName}>Findora</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Create Account</Text>
        <Text style={styles.pageSubtitle}>
          Join our community to help recover lost items.
        </Text>

        {/* Card */}
        <View style={styles.card}>
          {/* Profile picture */}
          <TouchableOpacity style={styles.avatarContainer} onPress={handleUploadPhoto} activeOpacity={0.8}>
            <View style={styles.avatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <MaterialIcons name="account-circle" size={74} color="#444" />
              )}
            </View>
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.uploadLabel}>Upload Profile Picture</Text>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputWrapper, usernameFocused && styles.inputWrapperFocused]}>
              <Ionicons name="person-outline" size={18} color={usernameFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="johndoe"
                placeholderTextColor="#ccc"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <MaterialIcons name="mail-outline" size={18} color={emailFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={passwordFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <View style={[styles.inputWrapper, confirmFocused && styles.inputWrapperFocused]}>
              <MaterialCommunityIcons name="lock-reset" size={18} color={confirmFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#ccc"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <Text style={styles.registerButtonText}>Register</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safe & Secure footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>SAFE & SECURE</Text>
          <View style={styles.shieldRow}>
            {/* GoShieldCheck */}
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2z" stroke="#aaa" strokeWidth={1.8} strokeLinejoin="round" fill="none" />
              <Path d="M9 12l2 2 4-4" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>

            {/* Plain shield */}
            <Ionicons name="shield-outline" size={22} color="#aaa" />

            {/* GoShieldLock */}
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2z" stroke="#aaa" strokeWidth={1.8} strokeLinejoin="round" fill="none" />
              <Path d="M14 11V9.5a2 2 0 10-4 0V11" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" />
              <Path d="M10 11h4a1 1 0 011 1v2.5a1 1 0 01-1 1h-4a1 1 0 01-1-1V12a1 1 0 011-1z" stroke="#aaa" strokeWidth={1.8} fill="none" />
            </Svg>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    marginTop: 2,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  backButton: {
    padding: 4,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d7377',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'space-between', 
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 19,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e6a817',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 22,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ebebeb',
    paddingHorizontal: 12,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: '#e6a817',
    backgroundColor: '#fffdf5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  eyeButton: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#e6a817',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#e6a817',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 13,
    color: '#888',
  },
  loginLink: {
    fontSize: 13,
    color: '#e6a817',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
    gap: 10,
  },
  footerLabel: {
    fontSize: 11,
    color: '#bbb',
    letterSpacing: 2,
    fontWeight: '600',
  },
  shieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default RegisterScreen;