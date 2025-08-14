import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FoodItem } from '../../types';

const { width } = Dimensions.get('window');

interface PopularDishesProps {
  dishes: FoodItem[];
  onAddToCart: (dish: FoodItem) => void;
}

export default function PopularDishes({ dishes, onAddToCart }: PopularDishesProps) {
  const router = useRouter();

  const renderDish = (dish: FoodItem) => (
    <Card key={dish.id} style={styles.dishCard}>
      <Card.Cover source={{ uri: dish.image }} style={styles.dishImage} />
      <View style={styles.vegIndicator}>
        <MaterialIcons 
          name={dish.isVeg ? "circle" : "cancel"} 
          size={16} 
          color={dish.isVeg ? "#4CAF50" : "#F44336"} 
        />
      </View>
      
      <Card.Content style={styles.dishContent}>
        <Text style={styles.dishName} numberOfLines={1}>
          {dish.name}
        </Text>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {dish.description}
        </Text>
        
        <View style={styles.dishDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.dishRating}>4.5</Text>
          </View>
          <Text style={styles.preparationTime}>20-30 min</Text>
        </View>
        
        <View style={styles.dishFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.dishPrice}>₹{dish.price}</Text>
            <Text style={styles.restaurantName} numberOfLines={1}>
              Restaurant Name
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => onAddToCart(dish)}
            style={styles.addToCartButton}
            contentStyle={styles.addToCartButtonContent}
          >
            Add
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        <Button
          mode="text"
          onPress={() => router.push('/search')}
          textColor="#FF6B35"
        >
          View All
        </Button>
      </View>
      <View style={styles.dishesGrid}>
        {dishes.map(renderDish)}
      </View>
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
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dishCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  dishImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  vegIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  dishContent: {
    padding: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  dishDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // Increased from 12 to 16 for better spacing
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishRating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  preparationTime: {
    color: '#666',
    fontSize: 11,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Align to bottom for better visual balance
    gap: 12, // Add gap between price and button
  },
  priceContainer: {
    flex: 1, // Take available space
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    minWidth: 60, // Ensure consistent button width
  },
  addToCartButtonContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
}); 