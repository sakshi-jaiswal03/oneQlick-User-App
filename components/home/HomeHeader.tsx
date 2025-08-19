import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text, Surface, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
  userLocation: string;
  onLocationPress: () => void;
  hasLocation?: boolean;
}

export default function HomeHeader({ userLocation, onLocationPress, hasLocation = false }: HomeHeaderProps) {
  const router = useRouter();
  
  // Mock notifications data - in real app, this would come from a hook or API
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  return (
    <Surface style={styles.header}>
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContent}>
          {/* Location Section */}
          <Pressable 
            style={({ pressed }) => [
              styles.locationSection,
              pressed && styles.locationSectionPressed
            ]}
            onPress={() => {
              Alert.alert(
                'Edit Location',
                'Choose how you want to set your location:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Use Current Location', onPress: onLocationPress },
                  { text: 'Enter Manually', onPress: () => {
                    Alert.alert('Manual Input', 'Manual location input coming soon!');
                  }},
                  { text: 'Pick from Map', onPress: () => {
                    Alert.alert('Map Picker', 'Map location picker coming soon!');
                  }}
                ]
              );
            }}
          >
            <View style={styles.locationIcon}>
              <MaterialIcons 
                name="location-on" 
                size={20} 
                color="#FF6B35" 
              />
              {hasLocation && (
                <View style={styles.locationIndicator} />
              )}
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.deliveryText}>Deliver to</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {userLocation}
              </Text>
            </View>
          </Pressable>

          {/* Header Actions */}
          <View style={styles.headerActions}>
            {/* Notifications Button */}
            <Pressable
              onPress={() => router.push('/notifications')}
              style={styles.notificationButton}
            >
              <MaterialIcons name="notifications" size={24} color="#FF6B35" />
              {unreadNotifications > 0 && (
                <Badge style={styles.notificationBadge} size={18}>
                  {unreadNotifications}
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
  },
  locationSectionPressed: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  locationIcon: {
    marginRight: 8,
    position: 'relative',
  },
  locationIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: 'white',
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
  notificationButton: {
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
  notificationBadge: {
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