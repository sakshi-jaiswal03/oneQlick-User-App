import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function EditProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <Avatar.Text
            size={100}
            label={user?.name?.charAt(0) || 'U'}
            style={styles.profilePicture}
            color="white"
            labelStyle={styles.profilePictureLabel}
          />
          <Button
            mode="outlined"
            onPress={() => {/* TODO: Implement image picker */}}
            style={styles.changePhotoButton}
            icon="camera"
          >
            Change Photo
          </Button>
        </View>

        {/* Form Section */}
        <Surface style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
          >
            Save Changes
          </Button>
        </Surface>

        {/* Danger Zone */}
        <Surface style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Text style={styles.dangerZoneSubtitle}>
            These actions cannot be undone
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => {/* TODO: Implement delete account */} }
                ]
              );
            }}
            style={styles.deleteButton}
            textColor="#d32f2f"
            icon="delete-forever"
          >
            Delete Account
          </Button>
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
  scrollView: {
    flex: 1,
  },
  profilePictureSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  profilePicture: {
    backgroundColor: '#FF6B35',
    marginBottom: 16,
  },
  profilePictureLabel: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  changePhotoButton: {
    borderColor: '#FF6B35',
  },
  formContainer: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dangerZone: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ffebee',
    backgroundColor: '#fff5f5',
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  dangerZoneSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
}); 