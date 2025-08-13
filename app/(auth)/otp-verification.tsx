import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Clipboard,
} from 'react-native';
import { Button, Surface, HelperText, TextInput } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 30; // seconds

interface OTPVerificationProps {
  phoneNumber?: string;
  onVerificationSuccess?: () => void;
  onVerificationFailure?: (error: string) => void;
}

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string || '+91 98765 43210';
  
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  
  const inputRefs = useRef<any[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successScaleAnimation = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  // Countdown timer for resend
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  // Check for SMS auto-fill (Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      checkForSMSAutoFill();
    }
  }, []);

  const checkForSMSAutoFill = async () => {
    try {
      // This is a placeholder for actual SMS auto-fill detection
      // In a real app, you would use a library like react-native-otp-inputs
      // or implement SMS listener for OTP detection
      console.log('Checking for SMS auto-fill...');
    } catch (error) {
      console.log('SMS auto-fill not available');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === OTP_LENGTH) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const pastedOTP = clipboardContent.replace(/\D/g, '').slice(0, OTP_LENGTH);
      
      if (pastedOTP.length === OTP_LENGTH) {
        const newOtp = [...otp];
        for (let i = 0; i < OTP_LENGTH; i++) {
          newOtp[i] = pastedOTP[i];
        }
        setOtp(newOtp);
        setError('');
        
        // Focus last input
        inputRefs.current[OTP_LENGTH - 1]?.focus();
        
        // Auto-verify if complete
        if (pastedOTP.length === OTP_LENGTH) {
          handleVerifyOTP(pastedOTP);
        }
      }
    } catch (error) {
      console.log('Failed to read clipboard');
    }
  };

  const handleVerifyOTP = async (otpString: string) => {
    if (otpString.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For testing: accept 123456 as valid OTP
      if (otpString === '123456') {
        await handleVerificationSuccess();
      } else {
        throw new Error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      handleVerificationError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    setIsVerificationSuccess(true);
    
    // Success animations
    Animated.sequence([
      Animated.timing(successScaleAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 2000);
  };

  const handleVerificationError = (errorMessage: string) => {
    setError(errorMessage);
    
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Clear OTP on error
    setOtp(new Array(OTP_LENGTH).fill(''));
    
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset timer and OTP
      setResendTimer(RESEND_TIMEOUT);
      setCanResend(false);
      setOtp(new Array(OTP_LENGTH).fill(''));
      
      // Focus first input
      inputRefs.current[0]?.focus();
      
      Alert.alert('OTP Sent', 'A new 6-digit OTP has been sent to your phone number');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    return phone.replace(/(\+91)\s*(\d{5})\s*(\d{5})/, '$1 $2 $3');
  };

  const renderOTPInputs = () => {
    return (
      <Animated.View 
        style={[
          styles.otpContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
                         ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit && styles.otpInputFilled,
              error && styles.otpInputError
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType={index === OTP_LENGTH - 1 ? 'done' : 'next'}
            onSubmitEditing={() => {
              if (index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
              } else {
                Keyboard.dismiss();
              }
            }}
            blurOnSubmit={false}
          />
        ))}
      </Animated.View>
    );
  };

  const renderSuccessAnimation = () => {
    if (!isVerificationSuccess) return null;

    return (
      <Animated.View style={[styles.successContainer, { transform: [{ scale: successScaleAnimation }] }]}>
        <Animated.View style={[styles.checkmarkContainer, { opacity: checkmarkOpacity }]}>
          <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
        </Animated.View>
        <Text style={styles.successText}>OTP Verified Successfully!</Text>
        <Text style={styles.successSubtext}>Redirecting to home...</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="verified-user" size={64} color="#FF6B35" />
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.phoneNumber}>
            {formatPhoneNumber(phoneNumber)}
          </Text>
        </View>

        {/* OTP Input */}
        {!isVerificationSuccess && (
          <Surface style={styles.otpSurface}>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            {renderOTPInputs()}
            
            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}

            {/* Paste Button */}
            <Button
              mode="text"
              onPress={handlePaste}
              style={styles.pasteButton}
              textColor="#FF6B35"
              icon="content-paste"
            >
              Paste OTP
            </Button>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
              </Text>
              {canResend ? (
                <Button
                  mode="text"
                  onPress={handleResendOTP}
                  disabled={isLoading}
                  textColor="#FF6B35"
                  style={styles.resendButton}
                >
                  Resend
                </Button>
              ) : (
                <Text style={styles.timerText}>
                  Resend in {resendTimer}s
                </Text>
              )}
            </View>
          </Surface>
        )}

        {/* Success Animation */}
        {renderSuccessAnimation()}

        {/* Action Buttons */}
        {!isVerificationSuccess && (
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={() => handleVerifyOTP(otp.join(''))}
              loading={isLoading}
              disabled={isLoading || otp.join('').length !== OTP_LENGTH}
              style={styles.verifyButton}
              contentStyle={styles.buttonContent}
            >
              Verify OTP
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.backButton}
              contentStyle={styles.buttonContent}
            >
              Back
            </Button>
          </View>
        )}

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 Tip: For testing, use OTP: 123456
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
  },
  otpSurface: {
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: (width - 80) / OTP_LENGTH,
    height: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF8F6',
  },
  otpInputError: {
    borderColor: '#f44336',
    backgroundColor: '#FFEBEE',
  },
  pasteButton: {
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendButton: {
    marginLeft: -8,
  },
  timerText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionContainer: {
    gap: 16,
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#FF6B35',
  },
  backButton: {
    borderColor: '#FF6B35',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  checkmarkContainer: {
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 