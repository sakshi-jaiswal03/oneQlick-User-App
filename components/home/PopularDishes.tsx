import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
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
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const handleAddToCart = useCallback(async (dish: FoodItem) => {
    const currentQuantity = itemQuantities[dish.id] || 0;
    const newQuantity = currentQuantity + 1;
    setItemQuantities(prev => ({ ...prev, [dish.id]: newQuantity }));
    
    // Call the parent's onAddToCart function
    await onAddToCart(dish);
  }, [itemQuantities, onAddToCart]);

  const handleIncreaseQuantity = useCallback(async (dish: FoodItem) => {
    const currentQuantity = itemQuantities[dish.id] || 0;
    const newQuantity = currentQuantity + 1;
    setItemQuantities(prev => ({ ...prev, [dish.id]: newQuantity }));
    
    // Call the parent's onAddToCart function
    await onAddToCart(dish);
  }, [itemQuantities, onAddToCart]);

  const handleDecreaseQuantity = useCallback((dish: FoodItem) => {
    const currentQuantity = itemQuantities[dish.id] || 0;
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      if (newQuantity === 0) {
        setItemQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[dish.id];
          return newQuantities;
        });
      } else {
        setItemQuantities(prev => ({ ...prev, [dish.id]: newQuantity }));
      }
    }
  }, [itemQuantities]);

  const renderDish = useCallback((dish: FoodItem) => {
    const quantity = itemQuantities[dish.id] || 0;
    
    return (
      <Surface key={dish.id} style={styles.dishCard}>
        {/* Food Image with Veg Indicator */}
        <View style={styles.imageContainer}>
          <Surface style={styles.imageWrapper}>
            <Text style={styles.dishImage}>🍽️</Text>
          </Surface>
          <View style={[styles.vegIndicator, { backgroundColor: dish.isVeg ? '#4CAF50' : '#F44336' }]}>
            <MaterialIcons 
              name={dish.isVeg ? "circle" : "cancel"} 
              size={12} 
              color="white" 
            />
          </View>
          {dish.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>🔥 Popular</Text>
            </View>
          )}
        </View>
        
        {/* Food Details */}
        <View style={styles.dishContent}>
          <View style={styles.dishHeader}>
            <Text style={styles.dishName} numberOfLines={1}>
              {dish.name}
            </Text>
            <Text style={styles.dishCategory}>{dish.category}</Text>
          </View>
          
          <Text style={styles.dishDescription} numberOfLines={2}>
            {dish.description}
          </Text>
          
          <View style={styles.dishMeta}>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.dishRating}>4.5</Text>
              <Text style={styles.ratingCount}>(120)</Text>
            </View>
            <Text style={styles.preparationTime}>⏱️ 20-30 min</Text>
          </View>
          
          <View style={styles.dishFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.dishPrice}>₹{dish.price}</Text>
              <Text style={styles.deliveryInfo}>Free delivery</Text>
            </View>
            
            {quantity === 0 ? (
              <Button
                mode="contained"
                onPress={() => handleAddToCart(dish)}
                style={styles.addToCartButton}
                contentStyle={styles.addToCartButtonContent}
                labelStyle={styles.addToCartButtonLabel}
              >
                Add
              </Button>
            ) : (
              <View style={styles.quantitySelector}>
                <IconButton
                  icon="minus"
                  size={20}
                  iconColor="#FF6B35"
                  onPress={() => handleDecreaseQuantity(dish)}
                  style={styles.quantityButton}
                />
                <Text style={styles.quantityText}>{quantity}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  iconColor="#FF6B35"
                  onPress={() => handleIncreaseQuantity(dish)}
                  style={styles.quantityButton}
                />
              </View>
            )}
          </View>
        </View>
      </Surface>
    );
  }, [itemQuantities, handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>🍽️ Popular Dishes</Text>
          <Text style={styles.sectionSubtitle}>Most loved by our customers</Text>
        </View>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FF6B35" />
        </Pressable>
      </View>
      
      <View style={styles.dishesContainer}>
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
  dishesContainer: {
    gap: 16,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE082',
  },
  dishImage: {
    fontSize: 32,
  },
  vegIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  popularBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    elevation: 2,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  dishContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeader: {
    marginBottom: 8,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dishCategory: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishRating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#999',
  },
  preparationTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  dishPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 2,
  },
  deliveryInfo: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addToCartButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  addToCartButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  quantityButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
}); 