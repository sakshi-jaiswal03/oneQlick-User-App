import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Animated, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

// Custom tab bar component with badges and animations
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { cart } = useCart();
  const { user } = useAuth();
  
  // Animation values for tab press feedback
  const tabAnimations = state.routes.map(() => new Animated.Value(1));

  // Calculate cart badge count
  const cartBadgeCount = cart.items.length > 0 ? cart.items.length : 0;

  // Calculate orders badge count (mock data)
  const ordersBadgeCount = user ? Math.floor(Math.random() * 5) : 0; // Mock pending orders

  const handleTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      // Animate tab press
      Animated.sequence([
        Animated.timing(tabAnimations[index], {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(tabAnimations[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      navigation.navigate(route.name);
    }
  };

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const iconSize = 24;
    const iconColor = isFocused ? '#FF6B35' : '#666';

    switch (routeName) {
      case 'home':
        return <MaterialIcons name="home" size={iconSize} color={iconColor} />;
      case 'search':
        return <MaterialIcons name="search" size={iconSize} color={iconColor} />;
      case 'orders':
        return <MaterialIcons name="receipt" size={iconSize} color={iconColor} />;
      case 'cart':
        return <MaterialIcons name="shopping-cart" size={iconSize} color={iconColor} />;
      case 'profile':
        return <MaterialIcons name="person" size={iconSize} color={iconColor} />;
      default:
        return <MaterialIcons name="home" size={iconSize} color={iconColor} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'home':
        return 'Home';
      case 'search':
        return 'Search';
      case 'orders':
        return 'Orders';
      case 'cart':
        return 'Cart';
      case 'profile':
        return 'Profile';
      default:
        return 'Home';
    }
  };

  const getBadgeCount = (routeName: string) => {
    switch (routeName) {
      case 'orders':
        return ordersBadgeCount;
      case 'cart':
        return cartBadgeCount;
      default:
        return 0;
    }
  };

  return (
    <View style={[styles.customTabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const badgeCount = getBadgeCount(route.name);

        return (
          <Pressable
            key={route.key}
            onPress={() => handleTabPress(route, index)}
            style={[
              styles.tabItem,
              isFocused && styles.tabItemActive
            ]}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={getTabLabel(route.name)}
          >
            <Animated.View
              style={[
                styles.tabIconContainer,
                { transform: [{ scale: tabAnimations[index] }] }
              ]}
            >
              {getTabIcon(route.name, isFocused)}
              
              {/* Badge for orders and cart */}
              {badgeCount > 0 && (
                <View style={[
                  styles.badge,
                  route.name === 'orders' ? styles.ordersBadge : styles.cartBadge
                ]}>
                  <Animated.Text style={styles.badgeText}>
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </Animated.Text>
                </View>
              )}
            </Animated.View>
            
            <Animated.Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive,
                { transform: [{ scale: tabAnimations[index] }] }
              ]}
            >
              {getTabLabel(route.name)}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
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
  customTabBar: {
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 60,
  },
  tabItemActive: {
    // Active state styling
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  tabLabelActive: {
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
  },
  ordersBadge: {
    backgroundColor: '#FF6B35', // Orange for orders
  },
  cartBadge: {
    backgroundColor: '#4CAF50', // Green for cart
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 