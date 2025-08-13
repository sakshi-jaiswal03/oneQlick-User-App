import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="cart" 
        options={{ 
          title: 'Cart',
          presentation: 'modal',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="filter" 
        options={{ 
          title: 'Filters',
          presentation: 'modal',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="location-picker" 
        options={{ 
          title: 'Choose Location',
          presentation: 'modal',
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 