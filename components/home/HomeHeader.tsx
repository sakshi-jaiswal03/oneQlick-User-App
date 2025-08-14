import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
  userLocation: string;
  onLocationPress: () => void;
}

export default function HomeHeader({ userLocation, onLocationPress }: HomeHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={20} color="#FF6B35" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Delivering to</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {userLocation}
          </Text>
        </View>
        <Pressable onPress={onLocationPress}>
          <MaterialIcons name="edit" size={20} color="#666" />
        </Pressable>
      </View>
      
      <View style={styles.headerActions}>
        <Pressable
          onPress={() => router.push('/profile')}
          style={[styles.circularButton, { backgroundColor: 'white', borderWidth: 2, borderColor: '#FF6B35' }]}
        >
          <MaterialIcons name="person" size={24} color="#FF6B35" />
        </Pressable>
        
        <Pressable style={styles.circularButton}>
          <MaterialIcons name="notifications" size={24} color="white" />
          <Badge style={styles.notificationBadge} size={18}>
            3
          </Badge>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circularButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#F44336',
  },
}); 