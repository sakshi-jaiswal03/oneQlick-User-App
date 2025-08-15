import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="cart" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          title: '',
          headerTitle: '',
        }} 
      />
    </Stack>
  );
} 