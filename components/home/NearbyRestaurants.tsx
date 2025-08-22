import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RestaurantCard from './RestaurantCard';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: string;
  distance: string;
  image: string;
  isOpen: boolean;
  offers: string[];
}

interface NearbyRestaurantsProps {
  restaurants: Restaurant[];
}

export default function NearbyRestaurants({ restaurants }: NearbyRestaurantsProps) {
  const router = useRouter();

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const renderRestaurant = (restaurant: Restaurant) => (
    <RestaurantCard
      key={restaurant.id}
      restaurant={restaurant}
      onPress={handleRestaurantPress}
    />
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>🏪 Restaurants Near You</Text>
          <Text style={styles.sectionSubtitle}>Discover local favorites</Text>
        </View>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FF6B35" />
        </Pressable>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {restaurants.map(renderRestaurant)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  viewAllText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  scrollContent: {
    paddingRight: 20,
  },
}); 