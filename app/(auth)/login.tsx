import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Surface, 
  Checkbox, 
  Divider, 
  Chip,
  IconButton,
  HelperText
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { isValidEmail, isValidPhone, isValidPhoneWithCountry } from '../../utils/helpers';
import { PhoneNumberInput } from '../../components/common';
import { CountryCode } from '../../utils/countryCodes';

type LoginMethod = 'email' | 'phone' | 'otp';

interface LoginForm {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

interface OTPForm {
  phone: string;
  otp: string;
}

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [otpForm, setOtpForm] = useState<OTPForm>({
    phone: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();
  const { login } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (loginMethod === 'otp') {
      if (!otpForm.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (selectedCountry && !isValidPhoneWithCountry(otpForm.phone, selectedCountry.dialCode, selectedCountry.maxLength)) {
        newErrors.phone = `Please enter a valid ${selectedCountry.name} phone number`;
      }
      
      if (isOtpSent && !otpForm.otp) {
        newErrors.otp = 'OTP is required';
      } else if (isOtpSent && otpForm.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    } else {
      if (!loginForm.identifier) {
        newErrors.identifier = `${loginMethod === 'email' ? 'Email' : 'Phone number'} is required`;
      } else if (loginMethod === 'email' && !isValidEmail(loginForm.identifier)) {
        newErrors.identifier = 'Please enter a valid email address';
      } else if (loginMethod === 'phone' && selectedCountry && !isValidPhoneWithCountry(loginForm.identifier, selectedCountry.dialCode, selectedCountry.maxLength)) {
        newErrors.identifier = `Please enter a valid ${selectedCountry.name} phone number`;
      }

      if (!loginForm.password) {
        newErrors.password = 'Password is required';
      } else if (loginForm.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;
      
      if (loginMethod === 'otp') {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/(auth)/otp-verification',
          params: { phoneNumber: loginForm.identifier }
        });
        return;
      } else {
        // Regular login
        result = await login(loginForm.identifier, loginForm.password);
      }

      if (result?.success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', result?.error || 'Please check your credentials and try again');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      // TODO: Implement actual OTP sending API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setIsOtpSent(true);
      Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOTPAndLogin = async () => {
    try {
      // TODO: Implement actual OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock successful OTP verification
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    Alert.alert(
      'Social Login',
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be implemented soon!`,
      [{ text: 'OK' }]
    );
  };

  const updateLoginForm = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (typeof value === 'string' && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateOtpForm = (field: keyof OTPForm, value: string) => {
    setOtpForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderLoginMethodTabs = () => (
    <View style={styles.methodTabs}>
      <Chip
        mode={loginMethod === 'phone' ? 'flat' : 'outlined'}
        onPress={() => setLoginMethod('phone')}
        style={[styles.methodTab, loginMethod === 'phone' && styles.activeMethodTab]}
        textStyle={loginMethod === 'phone' ? styles.activeMethodText : styles.methodText}
      >
        Phone
      </Chip>
      <Chip
        mode={loginMethod === 'email' ? 'flat' : 'outlined'}
        onPress={() => setLoginMethod('email')}
        style={[styles.methodTab, loginMethod === 'email' && styles.activeMethodTab]}
        textStyle={loginMethod === 'email' ? styles.activeMethodText : styles.methodText}
      >
        Email
      </Chip>
      <Chip
        mode={loginMethod === 'otp' ? 'flat' : 'outlined'}
        onPress={() => setLoginMethod('otp')}
        style={[styles.methodTab, loginMethod === 'otp' && styles.activeMethodTab]}
        textStyle={loginMethod === 'otp' ? styles.activeMethodText : styles.methodText}
      >
        OTP
      </Chip>
    </View>
  );

  const renderLoginForm = () => (
    <View style={styles.formSection}>
      {loginMethod === 'phone' ? (
        <PhoneNumberInput
          value={loginForm.identifier}
          onChangeText={(phone, country) => {
            updateLoginForm('identifier', phone);
            setSelectedCountry(country);
          }}
          label="Phone Number"
          error={errors.identifier}
          returnKeyType="next"
        />
      ) : (
        <>
          <TextInput
            label="Email Address"
            value={loginForm.identifier}
            onChangeText={(value) => updateLoginForm('identifier', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
            error={!!errors.identifier}
          />
          <HelperText type="error" visible={!!errors.identifier}>
            {errors.identifier}
          </HelperText>
        </>
      )}

      <TextInput
        label="Password"
        value={loginForm.password}
        onChangeText={(value) => updateLoginForm('password', value)}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon 
            icon={showPassword ? 'eye-off' : 'eye'} 
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={loginForm.rememberMe ? 'checked' : 'unchecked'}
          onPress={() => updateLoginForm('rememberMe', !loginForm.rememberMe)}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
    </View>
  );

  const renderOtpForm = () => (
    <View style={styles.formSection}>
      <PhoneNumberInput
        value={otpForm.phone}
        onChangeText={(phone, country) => {
          updateOtpForm('phone', phone);
          setSelectedCountry(country);
        }}
        label="Phone Number"
        error={errors.phone}
        returnKeyType={isOtpSent ? 'next' : 'done'}
        onSubmitEditing={isOtpSent ? undefined : sendOTP}
        disabled={isOtpSent}
      />

      {isOtpSent && (
        <>
          <TextInput
            label="Enter OTP"
            value={otpForm.otp}
            onChangeText={(value) => updateOtpForm('otp', value)}
            mode="outlined"
            keyboardType="numeric"
            maxLength={6}
            style={styles.input}
            left={<TextInput.Icon icon="key" />}
            error={!!errors.otp}
          />
          <HelperText type="error" visible={!!errors.otp}>
            {errors.otp}
          </HelperText>
          
          <View style={styles.otpActions}>
            <Text style={styles.otpInfo}>
              Didn't receive OTP? 
            </Text>
            <Button
              mode="text"
              onPress={sendOTP}
              disabled={isLoading}
              textColor="#FF6B35"
            >
              Resend
            </Button>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>oneQlick</Text>
              <Text style={styles.tagline}>Food delivered to your doorstep</Text>
            </View>
          </View>

          {/* Login Form */}
          <Surface style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Login Method Tabs */}
            {renderLoginMethodTabs()}

            {/* Form Fields */}
            {loginMethod === 'otp' ? renderOtpForm() : renderLoginForm()}

            {/* Forgot Password */}
            {loginMethod !== 'otp' && (
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotPasswordButton}
                textColor="#FF6B35"
              >
                Forgot Password?
              </Button>
            )}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {loginMethod === 'otp' 
                ? (isOtpSent ? 'Verify & Login' : 'Send OTP')
                : 'Sign In'
              }
            </Button>

            {/* Social Login */}
            <View style={styles.socialLoginContainer}>
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
              </View>
              
              <View style={styles.socialButtons}>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin('google')}
                  style={styles.socialButton}
                  icon="google"
                  textColor="#DB4437"
                >
                  Google
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin('facebook')}
                  style={styles.socialButton}
                  icon="facebook"
                  textColor="#4267B2"
                >
                  Facebook
                </Button>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/signup')}
                style={styles.signupButton}
                textColor="#FF6B35"
              >
                Sign Up
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  methodTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  methodTab: {
    marginHorizontal: 4,
  },
  activeMethodTab: {
    backgroundColor: '#FF6B35',
  },
  methodText: {
    color: '#666',
  },
  activeMethodText: {
    color: 'white',
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMeText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  socialLoginContainer: {
    marginBottom: 24,
  },
  dividerContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    width: '100%',
  },
  dividerText: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    color: '#666',
    fontSize: 14,
    position: 'absolute',
    top: -10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderColor: '#ddd',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
  },
  signupButton: {
    marginLeft: -8,
  },
  otpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  otpInfo: {
    color: '#666',
    fontSize: 14,
  },
}); 