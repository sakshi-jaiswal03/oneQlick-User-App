import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

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

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (restaurantId: string) => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const handleRestaurantPress = () => {
    onPress(restaurant.id);
  };

  return (
    <Pressable
      style={styles.restaurantCard}
      onPress={handleRestaurantPress}
    >
      <Surface style={styles.cardSurface}>
        <View style={styles.restaurantImageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          )}
          
          {/* Status indicator */}
          <View style={[styles.statusIndicator, { backgroundColor: restaurant.isOpen ? '#4CAF50' : '#F44336' }]}>
            <MaterialIcons 
              name="fiber-manual-record" 
              size={8} 
              color="white" 
            />
            <Text style={styles.statusText}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          
          {/* Offers */}
          {restaurant.offers.length > 0 && (
            <View style={styles.offersContainer}>
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
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.restaurantCuisine} numberOfLines={1}>
            {restaurant.cuisine}
          </Text>
          
          <View style={styles.restaurantDetails}>
            <View style={styles.detailItem}>
              <MaterialIcons name="access-time" size={14} color="#666" />
              <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="location-on" size={14} color="#666" />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
          </View>
          
          <View style={styles.restaurantFooter}>
            <Text style={styles.minOrder}>Min ₹{restaurant.minOrder}</Text>
            <View style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
    marginRight: 16,
    marginBottom: 8,
  },
  cardSurface: {
    width: 280,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  offersContainer: {
    position: 'absolute',
    bottom: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: 14,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minOrder: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
}); 