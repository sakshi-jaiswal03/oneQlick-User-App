import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Profile',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="addresses" 
        options={{ 
          title: 'My Addresses',
          headerShown: false,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: 'Payment Methods',
          headerShown: true,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="help" 
        options={{ 
          title: 'Help & Support',
          headerShown: true,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          title: 'About oneQlick',
          headerShown: true,
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white'
        }} 
      />
    </Stack>
  );
} 