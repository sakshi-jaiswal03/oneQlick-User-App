import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FoodItem } from '../../types';
import FoodItemCard from './FoodItemCard';

interface PopularDishesProps {
  dishes: FoodItem[];
  onAddToCart: (dish: FoodItem) => void;
}

export default function PopularDishes({ dishes, onAddToCart }: PopularDishesProps) {
  const router = useRouter();

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
        {dishes.map((dish) => (
          <FoodItemCard
            key={dish.id}
            dish={dish}
            onAddToCart={onAddToCart}
            showQuantitySelector={true}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 24, // Add proper margin to prevent cutting
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
    gap: 12, // Reduced gap for better spacing
  },
}); 