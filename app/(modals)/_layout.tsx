import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="cart" 
        options={{ 
          title: 'Cart',
          presentation: 'modal',
          headerShown: true,
          headerLeft: () => null, // This will be handled by the cart component
        }} 
      />
    </Stack>
  );
} 