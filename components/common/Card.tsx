import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Surface, SurfaceProps } from 'react-native-paper';

interface CardProps extends SurfaceProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large' | 'none';
  margin?: 'small' | 'medium' | 'large' | 'none';
}

export default function Card({ 
  variant = 'default', 
  padding = 'medium',
  margin = 'none',
  style, 
  children,
  ...props 
}: CardProps) {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return styles.paddingNone;
      case 'small': return styles.paddingSmall;
      case 'large': return styles.paddingLarge;
      default: return styles.paddingMedium;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'none': return styles.marginNone;
      case 'small': return styles.marginSmall;
      case 'large': return styles.marginLarge;
      default: return styles.marginMedium;
    }
  };

  const cardStyle = [
    styles.card,
    styles[variant],
    getPaddingStyle(),
    getMarginStyle(),
    style,
  ];

  return (
    <Surface style={cardStyle} {...props}>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  default: {
    elevation: 1,
  },
  elevated: {
    elevation: 4,
  },
  outlined: {
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 20,
  },
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
}); 