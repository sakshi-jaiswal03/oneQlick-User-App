import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  showOffers?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, showOffers = true }: RestaurantCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Surface style={styles.card}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="restaurant" size={40} color="#ccc" />
          </View>
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          
          {/* Veg/Non-veg indicator */}
          <View style={styles.vegIndicator}>
            <MaterialIcons
              name={restaurant.isVeg ? "circle" : "cancel"}
              size={16}
              color={restaurant.isVeg ? "#4CAF50" : "#F44336"}
            />
          </View>
        </View>
        
        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          
          <Text style={styles.cuisine} numberOfLines={1}>
            {restaurant.cuisine}
          </Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MaterialIcons name="access-time" size={14} color="#666" />
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialIcons name="location-on" size={14} color="#666" />
              <Text style={styles.metaText}>{restaurant.address.split(',')[0]}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialIcons name="local-shipping" size={14} color="#666" />
              <Text style={styles.metaText}>₹{restaurant.deliveryFee}</Text>
            </View>
          </View>
          
          {/* Offers */}
          {showOffers && restaurant.offers && restaurant.offers.length > 0 && (
            <View style={styles.offersContainer}>
              <Chip style={styles.offerChip} textStyle={styles.offerText}>
                {restaurant.offers[0].title}
              </Chip>
              {restaurant.offers.length > 1 && (
                <Text style={styles.moreOffersText}>
                  +{restaurant.offers.length - 1} more
                </Text>
              )}
            </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  card: {
    width: 280,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  vegIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 12,
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  offersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerChip: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
    borderWidth: 1,
  },
  offerText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  moreOffersText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
}); 