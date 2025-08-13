import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  style 
}: BadgeProps) {
  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#FF6B35',
  },
  secondary: {
    backgroundColor: '#4ECDC4',
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  warning: {
    backgroundColor: '#FF9800',
  },
  error: {
    backgroundColor: '#F44336',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    height: 20,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 24,
    height: 24,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 32,
    height: 32,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
}); 