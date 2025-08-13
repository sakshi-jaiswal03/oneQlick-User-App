export const Colors = {
  // Primary Colors
  primary: '#FF6B35',
  primaryLight: '#FF8A65',
  primaryDark: '#E64A19',
  
  // Secondary Colors
  secondary: '#FFD93D',
  secondaryLight: '#FFE082',
  secondaryDark: '#F57F17',
  
  // Accent Colors
  accent: '#6BCF7F',
  accentLight: '#A5D6A7',
  accentDark: '#388E3C',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  darkGray: '#424242',
  
  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Background Colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Border Colors
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Rating Colors
  rating: '#FFD700',
  ratingEmpty: '#E0E0E0',
  
  // Delivery Status Colors
  deliveryPending: '#FF9800',
  deliveryConfirmed: '#2196F3',
  deliveryPreparing: '#9C27B0',
  deliveryOutForDelivery: '#FF6B35',
  deliveryDelivered: '#4CAF50',
  deliveryCancelled: '#F44336',
} as const;

export type ColorKey = keyof typeof Colors; 