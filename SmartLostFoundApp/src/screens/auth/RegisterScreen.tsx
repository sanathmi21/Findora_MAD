import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar, KeyboardAvoidingView, ScrollView, Animated, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { authApi } from '../../api/authApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const { height } = Dimensions.get('window');

//zod schema for form validation
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address (e.g., name@domain.com)'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  // Initialize React Hook Form with Zod validation
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const handlePressIn = () => Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const handlePressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  const onValidSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    const { error } = await authApi.register(data.email, data.password, data.username, profileImage);
    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Success!', 'Your account has been created.');
    }
  };

  // Handle profile picture upload
  const handleUploadPhoto = () => {
    Alert.alert(
      'Profile Picture',
      'Would you like to take a photo or choose from your gallery?',
      [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow gallery access to choose a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0d7377" />
        </TouchableOpacity>
        <Text style={styles.brandName}>Findora</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Create Account</Text>
        <Text style={styles.pageSubtitle}>Join our community to help recover lost items.</Text>

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
            <View style={[styles.inputWrapper, usernameFocused && styles.inputWrapperFocused, errors.username && styles.inputError]}>
              <Ionicons name="person-outline" size={18} color={usernameFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="johndoe"
                    placeholderTextColor="#ccc"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => { setUsernameFocused(false); onBlur(); }}
                  />
                )}
              />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused, errors.email && styles.inputError]}>
              <MaterialIcons name="mail-outline" size={18} color={emailFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#ccc"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => { setEmailFocused(false); onBlur(); }}
                  />
                )}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={passwordFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#ccc"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => { setPasswordFocused(false); onBlur(); }}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <View style={[styles.inputWrapper, confirmFocused && styles.inputWrapperFocused, errors.confirmPassword && styles.inputError]}>
              <MaterialCommunityIcons name="lock-reset" size={18} color={confirmFocused ? '#e6a817' : '#aaa'} style={styles.inputIcon} />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#ccc"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showConfirmPassword}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => { setConfirmFocused(false); onBlur(); }}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>

          {/* Register button: Calls handleSubmit from React Hook Form */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit(onValidSubmit)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>{loading ? 'Registering...' : 'Register'}</Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLabel}>SAFE & SECURE</Text>
          <View style={styles.shieldRow}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2z" stroke="#aaa" strokeWidth={1.8} strokeLinejoin="round" fill="none" />
              <Path d="M9 12l2 2 4-4" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Ionicons name="shield-outline" size={22} color="#aaa" />
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
  inputError: { 
    borderColor: '#e74c3c', 
    backgroundColor: '#fdf3f2' 
  }, 
  errorText: { 
    color: '#e74c3c', 
    fontSize: 12, 
    marginTop: 4, 
    fontWeight: '500' 
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