import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  TextInput,
  IconButton,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    // TODO: Implement actual password change logic
    Alert.alert(
      'Success', 
      'Password changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            // Navigate back
            router.back();
          }
        }
      ]
    );
  };

  const validatePasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    
    if (password.length >= 8) strength++;
    
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return '#F44336';
    if (strength <= 3) return '#FF9800';
    if (strength <= 4) return '#FFC107';
    return '#4CAF50';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const passwordStrength = validatePasswordStrength(newPassword);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={() => <MaterialIcons name="arrow-back" size={24} color="#333" />}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 48 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={styles.formContainer}>
          <Text style={styles.formTitle}>Update Your Password</Text>
          <Text style={styles.formSubtitle}>
            Ensure your account security by using a strong password
          </Text>
          
          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Password *</Text>
            <TextInput
              mode="outlined"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              secureTextEntry={!showCurrentPassword}
              right={
                <TextInput.Icon
                  icon={() => (
                    <MaterialIcons
                      name={showCurrentPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color="#666"
                    />
                  )}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              }
              style={styles.textInput}
            />
          </View>
          
          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password *</Text>
            <TextInput
              mode="outlined"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              right={
                <TextInput.Icon
                  icon={() => (
                    <MaterialIcons
                      name={showNewPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color="#666"
                    />
                  )}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
              style={styles.textInput}
            />
            
            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength)
                      }
                    ]} 
                  />
                </View>
                <Text style={[
                  styles.strengthText,
                  { color: getPasswordStrengthColor(passwordStrength) }
                ]}>
                  {getPasswordStrengthText(passwordStrength)}
                </Text>
              </View>
            )}
            
            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={newPassword.length >= 8 ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={newPassword.length >= 8 ? "#4CAF50" : "#ccc"} 
                />
                <Text style={styles.requirementText}>At least 8 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={/[A-Z]/.test(newPassword) ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={/[A-Z]/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                />
                <Text style={styles.requirementText}>One uppercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={/[a-z]/.test(newPassword) ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={/[a-z]/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                />
                <Text style={styles.requirementText}>One lowercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={/\d/.test(newPassword) ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={/\d/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                />
                <Text style={styles.requirementText}>One number</Text>
              </View>
            </View>
          </View>
          
          {/* Confirm New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm New Password *</Text>
            <TextInput
              mode="outlined"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your new password"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={() => (
                    <MaterialIcons
                      name={showConfirmPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color="#666"
                    />
                  )}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={[
                styles.textInput,
                confirmPassword.length > 0 && newPassword !== confirmPassword && styles.errorInput
              ]}
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.cancelButton}
              textColor="#666"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.submitButton}
              disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              Change Password
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
  },
  errorInput: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  requirementsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
});
