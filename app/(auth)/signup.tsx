import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Surface, 
  Checkbox, 
  HelperText,
  ProgressBar,
  Avatar,
  IconButton
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { isValidEmail, isValidPhone, isValidPassword } from '../../utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

interface SignupForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  profilePicture?: string;
}

interface OTPForm {
  otp: string;
  isSent: boolean;
}

type SignupStep = 'personal' | 'contact' | 'security' | 'verification' | 'location' | 'complete';

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('personal');
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [otpForm, setOtpForm] = useState<OTPForm>({
    otp: '',
    isSent: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  const router = useRouter();
  const { signup } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const steps: { key: SignupStep; title: string; description: string }[] = [
    { key: 'personal', title: 'Personal Info', description: 'Basic details' },
    { key: 'contact', title: 'Contact Details', description: 'Phone & email' },
    { key: 'security', title: 'Security', description: 'Password & terms' },
    { key: 'verification', title: 'Verify Phone', description: 'OTP verification' },
    { key: 'location', title: 'Location', description: 'Delivery address' },
    { key: 'complete', title: 'Complete', description: 'Welcome aboard!' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = (currentStepIndex + 1) / steps.length;

  useEffect(() => {
    // Auto-focus next field logic
    if (currentStep === 'personal' && signupForm.firstName && !signupForm.lastName) {
      // Focus lastName field after firstName is filled
    }
  }, [signupForm.firstName, currentStep]);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'personal':
        if (!signupForm.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (signupForm.firstName.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        }
        
        if (!signupForm.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (signupForm.lastName.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        }
        break;

      case 'contact':
        if (!signupForm.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(signupForm.phone)) {
          newErrors.phone = 'Please enter a valid Indian phone number';
        }

        if (!signupForm.email) {
          newErrors.email = 'Email address is required';
        } else if (!isValidEmail(signupForm.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;

      case 'security':
        if (!signupForm.password) {
          newErrors.password = 'Password is required';
        } else if (!isValidPassword(signupForm.password)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (like #, $, %, &, *, etc.)';
        }

        if (!signupForm.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (signupForm.password !== signupForm.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!signupForm.termsAccepted) {
          newErrors.termsAccepted = 'You must accept the terms and conditions';
        }
        break;

      case 'verification':
        if (!otpForm.otp) {
          newErrors.otp = 'OTP is required';
        } else if (otpForm.otp.length !== 6) {
          newErrors.otp = 'OTP must be 6 digits';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const stepOrder: SignupStep[] = ['personal', 'contact', 'security', 'verification', 'location', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      
      // Special handling for verification step
      if (nextStep === 'verification') {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/(auth)/otp-verification',
          params: { phoneNumber: signupForm.phone }
        });
        return;
      }
      
      // Special handling for location step
      if (nextStep === 'location') {
        requestLocationPermission();
        return;
      }

      setCurrentStep(nextStep);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    const stepOrder: SignupStep[] = ['personal', 'contact', 'security', 'verification', 'location', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const sendOTP = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual OTP sending API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setOtpForm(prev => ({ ...prev, isSent: true }));
      setCurrentStep('verification');
      scrollToTop();
      
      Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!validateCurrentStep()) return;

    try {
      setIsLoading(true);
      // TODO: Implement actual OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setCurrentStep('location');
      scrollToTop();
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        setCurrentStep('complete');
        scrollToTop();
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is required for delivery services. You can enable it in settings.',
          [
            { text: 'Skip for now', onPress: () => setCurrentStep('complete') },
                         { text: 'Settings', onPress: () => {/* TODO: Implement settings navigation */} }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setCurrentStep('complete');
    }
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual signup API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Show success animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate to main app
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSignupForm(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const updateForm = (field: keyof SignupForm, value: string | boolean) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateOtpForm = (field: keyof OTPForm, value: string | boolean) => {
    setOtpForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (typeof value === 'string' && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 0 && !cleaned.startsWith('91')) {
      return `+91 ${cleaned}`;
    } else if (cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    return `+91 ${cleaned}`;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; details: string } => {
    if (password.length === 0) return { strength: '', color: '#ccc', details: '' };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const requirements = [];
    if (!hasLower) requirements.push('lowercase');
    if (!hasUpper) requirements.push('uppercase');
    if (!hasNumber) requirements.push('number');
    if (!hasSpecial) requirements.push('special character');
    if (!isLongEnough) requirements.push('8+ characters');
    
    if (requirements.length === 0) {
      return { strength: 'Strong', color: '#2e7d32', details: 'All requirements met!' };
    } else if (requirements.length <= 2) {
      return { strength: 'Good', color: '#4caf50', details: `Missing: ${requirements.join(', ')}` };
    } else if (requirements.length <= 3) {
      return { strength: 'Fair', color: '#ff9800', details: `Missing: ${requirements.join(', ')}` };
    } else {
      return { strength: 'Weak', color: '#f44336', details: `Missing: ${requirements.join(', ')}` };
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <ProgressBar progress={progress} color="#FF6B35" style={styles.progressBar} />
      <Text style={styles.progressText}>
        Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
      </Text>
    </View>
  );

  const renderPersonalStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>Tell us about yourself</Text>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        {signupForm.profilePicture ? (
          <Avatar.Image
            size={80}
            source={{ uri: signupForm.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Avatar.Text
            size={80}
            label={signupForm.firstName ? signupForm.firstName.charAt(0) : 'U'}
            style={styles.profilePicture}
            color="white"
            labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
          />
        )}
        <Button
          mode="outlined"
          onPress={pickProfilePicture}
          style={styles.changePhotoButton}
          icon="camera"
        >
          {signupForm.profilePicture ? 'Change Photo' : 'Add Photo'}
        </Button>
      </View>

      <TextInput
        label="First Name"
        value={signupForm.firstName}
        onChangeText={(value) => updateForm('firstName', value)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
        error={!!errors.firstName}
        returnKeyType="next"
        onSubmitEditing={() => {/* Focus next field */}}
      />
      <HelperText type="error" visible={!!errors.firstName}>
        {errors.firstName}
      </HelperText>

      <TextInput
        label="Last Name"
        value={signupForm.lastName}
        onChangeText={(value) => updateForm('lastName', value)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
        error={!!errors.lastName}
        returnKeyType="next"
      />
      <HelperText type="error" visible={!!errors.lastName}>
        {errors.lastName}
      </HelperText>
    </View>
  );

  const renderContactStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact Details</Text>
      <Text style={styles.stepDescription}>How can we reach you?</Text>

      <TextInput
        label="Phone Number"
        value={signupForm.phone}
        onChangeText={(value) => updateForm('phone', formatPhoneNumber(value))}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
        error={!!errors.phone}
        returnKeyType="next"
      />
      <HelperText type="error" visible={!!errors.phone}>
        {errors.phone}
      </HelperText>

      <TextInput
        label="Email Address"
        value={signupForm.email}
        onChangeText={(value) => updateForm('email', value)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
        error={!!errors.email}
        returnKeyType="next"
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>
    </View>
  );

  const renderSecurityStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Security & Terms</Text>
      <Text style={styles.stepDescription}>Create a strong password</Text>

      <TextInput
        label="Password"
        value={signupForm.password}
        onChangeText={(value) => updateForm('password', value)}
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
        returnKeyType="next"
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      {/* Password Strength Indicator */}
      {signupForm.password && (
        <View style={styles.passwordStrengthContainer}>
          <Text style={styles.passwordStrengthLabel}>Password Strength: </Text>
          <Text style={[
            styles.passwordStrengthText, 
            { color: getPasswordStrength(signupForm.password).color }
          ]}>
            {getPasswordStrength(signupForm.password).strength}
          </Text>
        </View>
      )}
      {signupForm.password && (
        <Text style={[
          styles.passwordStrengthDetails,
          { color: getPasswordStrength(signupForm.password).color }
        ]}>
          {getPasswordStrength(signupForm.password).details}
        </Text>
      )}

      <TextInput
        label="Confirm Password"
        value={signupForm.confirmPassword}
        onChangeText={(value) => updateForm('confirmPassword', value)}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock-check" />}
        right={
          <TextInput.Icon 
            icon={showConfirmPassword ? 'eye-off' : 'eye'} 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        error={!!errors.confirmPassword}
        returnKeyType="done"
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>
        {errors.confirmPassword}
      </HelperText>

      <View style={styles.termsContainer}>
        <Checkbox
          status={signupForm.termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => updateForm('termsAccepted', !signupForm.termsAccepted)}
        />
        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsLink}>Terms & Conditions</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
      <HelperText type="error" visible={!!errors.termsAccepted}>
        {errors.termsAccepted}
      </HelperText>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verify Your Phone</Text>
      <Text style={styles.stepDescription}>
        We've sent a 6-digit OTP to {signupForm.phone}
      </Text>

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
        returnKeyType="done"
      />
      <HelperText type="error" visible={!!errors.otp}>
        {errors.otp}
      </HelperText>

      <View style={styles.otpActions}>
        <Text style={styles.otpInfo}>Didn't receive OTP? </Text>
        <Button
          mode="text"
          onPress={sendOTP}
          disabled={isLoading}
          textColor="#FF6B35"
        >
          Resend
        </Button>
      </View>
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location Permission</Text>
      <Text style={styles.stepDescription}>
        Allow location access for better delivery experience
      </Text>

      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={64} color="#FF6B35" />
        <Text style={styles.locationText}>
          We need your location to:
        </Text>
        <Text style={styles.locationBenefits}>
          • Show nearby restaurants{'\n'}
          • Calculate delivery time{'\n'}
          • Provide accurate delivery estimates
        </Text>
      </View>
    </View>
  );

  const renderCompleteStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Welcome to oneQlick! 🎉</Text>
      <Text style={styles.stepDescription}>
        Your account has been created successfully
      </Text>

      <View style={styles.successContainer}>
        <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
        <Text style={styles.successText}>
          You're all set to start ordering delicious food!
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalStep();
      case 'contact':
        return renderContactStep();
      case 'security':
        return renderSecurityStep();
      case 'verification':
        return renderVerificationStep();
      case 'location':
        return renderLocationStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    if (currentStep === 'complete') {
      return (
        <Button
          mode="contained"
          onPress={handleSignup}
          loading={isLoading}
          disabled={isLoading}
          style={styles.completeButton}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
      );
    }

    return (
      <View style={styles.navigationButtons}>
        {currentStepIndex > 0 && (
          <Button
            mode="outlined"
            onPress={handlePrevious}
            style={styles.previousButton}
            contentStyle={styles.buttonContent}
          >
            Previous
          </Button>
        )}
        
        <Button
          mode="contained"
          onPress={currentStep === 'verification' ? verifyOTP : handleNext}
          loading={isLoading}
          disabled={isLoading}
          style={styles.nextButton}
          contentStyle={styles.buttonContent}
        >
          {currentStep === 'verification' ? 'Verify OTP' : 'Next'}
        </Button>
      </View>
    );
  };

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
              <Text style={styles.tagline}>Create your account</Text>
            </View>
          </View>

          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Form Container */}
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            {renderCurrentStep()}
          </Animated.View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {renderNavigationButtons()}
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginButton}
              textColor="#FF6B35"
            >
              Sign In
            </Button>
          </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 30,
  },
  stepContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    marginBottom: 16,
  },
  changePhotoButton: {
    borderColor: '#FF6B35',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordStrengthLabel: {
    fontSize: 14,
    color: '#666',
  },
  passwordStrengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordStrengthDetails: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FF6B35',
    textDecorationLine: 'underline',
  },
  otpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  otpInfo: {
    color: '#666',
    fontSize: 14,
  },
  locationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  locationBenefits: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  navigationContainer: {
    marginBottom: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  previousButton: {
    flex: 1,
    borderColor: '#FF6B35',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  completeButton: {
    backgroundColor: '#FF6B35',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
  },
  loginButton: {
    marginLeft: -8,
  },
}); 