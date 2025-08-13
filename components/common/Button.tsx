import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({ 
  variant = 'primary', 
  size = 'medium', 
  style, 
  contentStyle,
  ...props 
}: CustomButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    style,
  ];

  const buttonContentStyle = [
    styles.content,
    styles[`${size}Content`],
    contentStyle,
  ];

  return (
    <PaperButton
      style={buttonStyle}
      contentStyle={buttonContentStyle}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  primary: {
    backgroundColor: '#FF6B35',
  },
  secondary: {
    backgroundColor: '#4ECDC4',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 52,
  },
  content: {
    paddingHorizontal: 16,
  },
  smallContent: {
    paddingVertical: 6,
  },
  mediumContent: {
    paddingVertical: 8,
  },
  largeContent: {
    paddingVertical: 12,
  },
}); 