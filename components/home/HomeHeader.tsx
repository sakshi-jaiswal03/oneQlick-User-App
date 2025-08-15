import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';

interface HomeHeaderProps {
  userLocation: string;
  onLocationPress: () => void;
}

export default function HomeHeader({ userLocation, onLocationPress }: HomeHeaderProps) {
  const router = useRouter();
  const { cart } = useCart();

  // Calculate cart badge count
  const cartBadgeCount = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <Surface style={styles.header}>
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContent}>
          {/* Location Section */}
          <Pressable style={styles.locationSection} onPress={onLocationPress}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="location-on" size={20} color="#FF6B35" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.deliveryText}>Deliver to</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {userLocation}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
          </Pressable>

          {/* Header Actions */}
          <View style={styles.headerActions}>
            {/* Cart Button */}
            <Pressable
              onPress={() => router.push('/(modals)/cart')}
              style={styles.cartButton}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#FF6B35" />
              {cartBadgeCount > 0 && (
                <Badge style={styles.cartBadge} size={18}>
                  {cartBadgeCount}
                </Badge>
              )}
            </Pressable>
            
            {/* Profile Button */}
            <Pressable
              onPress={() => router.push('/profile')}
              style={styles.profileButton}
            >
              <MaterialIcons name="person" size={24} color="#666" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInfo: {
    flex: 1,
    marginRight: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B35',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 