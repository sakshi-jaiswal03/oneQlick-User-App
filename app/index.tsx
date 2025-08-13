import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (hasSeenOnboarding !== null && !isLoading) {
      if (!hasSeenOnboarding) {
        // First time user - show onboarding
        router.replace('/onboarding');
      } else if (isAuthenticated) {
        // User is logged in - go to main app
        router.replace('/(tabs)/home');
      } else {
        // User has seen onboarding but not logged in - go to auth
        router.replace('/(auth)/login');
      }
    }
  }, [hasSeenOnboarding, isAuthenticated, isLoading, router]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      setHasSeenOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B35' }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ marginTop: 16, color: 'white', fontSize: 18, fontWeight: '600' }}>
          Loading oneQlick...
        </Text>
      </View>
    );
  }

  return null;
} 