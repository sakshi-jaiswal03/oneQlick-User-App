import React from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
    // TODO: Navigate to restaurant details
    console.log('Restaurant pressed:', restaurantId);
  };

  const renderRestaurant = (restaurant: Restaurant) => (
    <Pressable
      key={restaurant.id}
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(restaurant.id)}
    >
      <View style={styles.restaurantImageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
        
        {/* Improved offer display - only show first offer prominently */}
        {restaurant.offers.length > 0 && (
          <View style={styles.mainOfferContainer}>
            <Chip style={styles.mainOfferTag} textStyle={styles.mainOfferTagText}>
              {restaurant.offers[0]}
            </Chip>
            {restaurant.offers.length > 1 && (
              <View style={styles.moreOffersIndicator}>
                <Text style={styles.moreOffersText}>+{restaurant.offers.length - 1}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.restaurantContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.restaurantCuisine} numberOfLines={1}>
          {restaurant.cuisine}
        </Text>
        
        <View style={styles.restaurantDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
          <Text style={styles.distance}>{restaurant.distance}</Text>
        </View>
        
        <Text style={styles.minOrder}>Min ₹{restaurant.minOrder}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
        <Pressable onPress={() => router.push('/search')}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.restaurantsContainer}>
          {restaurants.map(renderRestaurant)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  restaurantsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  restaurantCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainOfferContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainOfferTag: {
    backgroundColor: '#FF6B35',
    height: 28,
  },
  mainOfferTagText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  moreOffersIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreOffersText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantContent: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryTime: {
    color: '#666',
    fontSize: 12,
  },
  distance: {
    color: '#666',
    fontSize: 12,
  },
  minOrder: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
}); 