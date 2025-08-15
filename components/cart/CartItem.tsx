import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface CartItemProps {
  item: any;
  onQuantityChange: (itemId: string, increment: boolean) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  if (!item || !item.foodItem) {
    return null;
  }

  return (
    <Surface style={styles.cartItem}>
      {/* Left side - Food Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.foodItem.image }} 
          style={styles.foodImage}
          defaultSource={require('../../assets/icon.png')}
          onError={(error) => console.log('Image loading error:', error)}
        />
        {item.foodItem.isVeg && (
          <View style={styles.vegIndicator}>
            <MaterialIcons name="circle" size={10} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Center - Food Details */}
      <View style={styles.foodDetails}>
        <Text style={styles.foodName} numberOfLines={2}>
          {item.foodItem.name || 'Food Item'}
        </Text>
        
        {item.foodItem.description && (
          <Text style={styles.foodDescription} numberOfLines={1}>
            {item.foodItem.description}
          </Text>
        )}

        {/* Add-ons */}
        {item.addOns && item.addOns.length > 0 && (
          <View style={styles.addOnsContainer}>
            <Text style={styles.addOnsLabel}>Add-ons:</Text>
            {item.addOns.map((addOn: any, index: number) => (
              <Text key={index} style={styles.addOnText}>
                • {addOn.name} (+₹{addOn.price})
              </Text>
            ))}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.foodPrice}>₹{item.foodItem.price || 0}</Text>
          {item.foodItem.originalPrice && (
            <Text style={styles.originalPrice}>₹{item.foodItem.originalPrice}</Text>
          )}
        </View>
      </View>

      {/* Right side - Quantity and Remove */}
      <View style={styles.rightSection}>
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, false)}
          >
            <MaterialIcons name="remove" size={18} color="#FF6B35" />
          </Pressable>
          
          <Text style={styles.quantityText}>
            {item.quantity || 1}
          </Text>
          
          <Pressable
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, true)}
          >
            <MaterialIcons name="add" size={18} color="#FF6B35" />
          </Pressable>
        </View>

        {/* Remove Button */}
        <IconButton
          icon="delete-outline"
          size={20}
          iconColor="#F44336"
          onPress={() => onRemove(item.id)}
          style={styles.removeButton}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  vegIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
    elevation: 1,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 20,
  },
  foodDescription: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 16,
  },
  addOnsContainer: { 
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  addOnsLabel: { 
    fontSize: 11, 
    color: '#495057', 
    fontWeight: '600', 
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addOnText: { 
    fontSize: 11, 
    color: '#6c757d', 
    marginLeft: 6,
    lineHeight: 14,
  },
  priceContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B35',
  },
  originalPrice: { 
    fontSize: 12, 
    color: '#adb5bd', 
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa', 
    borderRadius: 20, 
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 1,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#fff5f5',
    borderRadius: 16,
    elevation: 1,
  },
});
