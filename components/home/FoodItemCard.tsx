import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodItem } from '../../types';

interface FoodItemCardProps {
  dish: FoodItem;
  onAddToCart: (dish: FoodItem) => void;
  onPress?: (dish: FoodItem) => void;
  showQuantitySelector?: boolean;
}

export default function FoodItemCard({ 
  dish, 
  onAddToCart, 
  onPress,
  showQuantitySelector = true 
}: FoodItemCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = useCallback(async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await onAddToCart(dish);
  }, [quantity, onAddToCart, dish]);

  const handleIncreaseQuantity = useCallback(async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await onAddToCart(dish);
  }, [quantity, onAddToCart, dish]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  }, [quantity]);

  const handleCardPress = useCallback(() => {
    if (onPress) {
      onPress(dish);
    }
  }, [onPress, dish]);

  return (
    <Pressable onPress={handleCardPress} style={styles.cardContainer}>
      <Surface style={styles.dishCard}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: dish.image }} 
            style={styles.dishImage}
            resizeMode="cover"
          />
          {dish.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>🔥 Popular</Text>
            </View>
          )}
        </View>
        
        {/* Food Details */}
        <View style={styles.dishContent}>
          {/* Header with Name and Veg Indicator */}
          <View style={styles.dishHeader}>
            <View style={styles.nameAndVegContainer}>
              <Text style={styles.dishName} numberOfLines={1}>
                {dish.name}
              </Text>
              {/* Veg/Non-veg indicator next to name */}
              <View style={[styles.vegIndicator, { backgroundColor: dish.isVeg ? '#4CAF50' : '#F44336' }]}>
                <MaterialIcons 
                  name={dish.isVeg ? "circle" : "cancel"} 
                  size={10} 
                  color="white" 
                />
              </View>
            </View>
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
            
            {showQuantitySelector && (
              quantity === 0 ? (
                <Button
                  mode="contained"
                  onPress={handleAddToCart}
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
                    size={18}
                    iconColor="#FF6B35"
                    onPress={handleDecreaseQuantity}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <IconButton
                    icon="plus"
                    size={18}
                    iconColor="#FF6B35"
                    onPress={handleIncreaseQuantity}
                    style={styles.quantityButton}
                  />
                </View>
              )
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 120, // Reduced height
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  dishImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
  },
  popularBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 2,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '700',
  },
  dishContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeader: {
    marginBottom: 6,
  },
  nameAndVegContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  dishCategory: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dishDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishRating: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 11,
    color: '#999',
  },
  preparationTime: {
    fontSize: 11,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 2,
  },
  deliveryInfo: {
    fontSize: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  addToCartButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 18,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  quantityButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
    marginHorizontal: 6,
    minWidth: 16,
    textAlign: 'center',
  },
}); 