import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Animated, Pressable, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Surface } from 'react-native-paper';

// Custom tab bar component with badges and animations
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { cart } = useCart();
  const { user } = useAuth();
  
  // Animation values for tab press feedback
  const tabAnimations = state.routes.map(() => new Animated.Value(1));

  // Calculate cart badge count - use the actual cart items count for real-time updates
  const cartBadgeCount = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);

  // Calculate orders badge count (mock data)
  const ordersBadgeCount = user ? Math.floor(Math.random() * 5) : 0; // Mock pending orders

  const handleTabPress = (route: any, isPressed: boolean) => {
    const { key } = route;
    const event = navigation.emit({
      type: 'tabPress',
      target: key,
      canPreventDefault: true,
    });

    if (!isPressed && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }

    // Animate tab press
    const tabIndex = state.routes.findIndex((r: any) => r.key === key);
    if (tabIndex !== -1) {
      Animated.sequence([
        Animated.timing(tabAnimations[tabIndex], { toValue: 0.8, duration: 100, useNativeDriver: true }),
        Animated.timing(tabAnimations[tabIndex], { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <Surface style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        let icon;
        let badgeCount = 0;

        // Set icon and badge count based on route name
        switch (route.name) {
          case 'home':
            icon = 'home';
            break;
          case 'search':
            icon = 'search';
            break;
          case 'cart':
            icon = 'shopping-cart';
            badgeCount = cartBadgeCount;
            break;
          case 'orders':
            icon = 'receipt';
            badgeCount = ordersBadgeCount;
            break;
          case 'profile':
            icon = 'person';
            break;
          default:
            icon = 'circle';
        }

        return (
          <Pressable
            key={`${route.key}-${cartBadgeCount}`} // Force re-render when cart changes
            style={[styles.tab, isFocused && styles.tabFocused]}
            onPress={() => handleTabPress(route, false)}
            onPressIn={() => handleTabPress(route, true)}
          >
            <Animated.View style={[styles.tabContent, { transform: [{ scale: tabAnimations[index] }] }]}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={icon as any}
                  size={24}
                  color={isFocused ? '#FF6B35' : '#666'}
                />
                {badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {label}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </Surface>
  );
}

export default function TabLayout() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          // Custom header options can be added here
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    paddingHorizontal: 16,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: -2 } : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 4 : undefined,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 60,
  },
  tabFocused: {
    // Active state styling
  },
  tabContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  tabLabelFocused: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#FF6B35', // Orange for orders
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 