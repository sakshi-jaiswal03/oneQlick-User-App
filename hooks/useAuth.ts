import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '+91 9876543210',
        address: 'Mumbai, Maharashtra',
      };
      
      await AsyncStorage.setItem('authToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signup = async (userData: Omit<User, 'id'>) => {
    try {
      // TODO: Implement actual API call
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
      };
      
      await AsyncStorage.setItem('authToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  };

  return {
    ...authState,
    login,
    logout,
    signup,
  };
} 