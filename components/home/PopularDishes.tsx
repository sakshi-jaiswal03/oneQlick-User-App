import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FoodItem } from '../../types';
import EnhancedFoodItemCard from './EnhancedFoodItemCard';

const { width: screenWidth } = Dimensions.get('window');

interface PopularDishesProps {
  dishes: FoodItem[];
  onAddToCart: (dish: FoodItem) => void;
}

type ViewMode = 'grid' | 'list';

export default function PopularDishes({ dishes, onAddToCart }: PopularDishesProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
    
    return (
    <View style={styles.section}>
      {/* Enhanced Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Most loved by our customers</Text>
          <View style={styles.statsContainer}>
            <MaterialCommunityIcons name="chart-line" size={14} color="#4CAF50" />
            <Text style={styles.statsText}>{dishes.length} trending dishes</Text>
            </View>
        </View>
        
        <View style={styles.headerActions}>
          {/* View Mode Toggle */}
          <View style={styles.viewModeToggle}>
            <Pressable 
              style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <MaterialCommunityIcons 
                name="view-list" 
                size={16} 
                color={viewMode === 'list' ? '#FF6B35' : '#666'} 
              />
            </Pressable>
            <Pressable 
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <MaterialCommunityIcons 
                name="view-grid" 
                size={16} 
                color={viewMode === 'grid' ? '#FF6B35' : '#666'} 
              />
            </Pressable>
          </View>
          
          {/* View All Button */}
          <Pressable 
            style={styles.viewAllButton}
            onPress={() => router.push('/search')}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF8F65']}
              style={styles.viewAllGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="white" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Filter Tags */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {[
          { label: 'All', icon: 'silverware', active: true },
          { label: 'Veg', icon: 'leaf', active: false },
          { label: 'Non-Veg', icon: 'food-drumstick', active: false },
          { label: 'Spicy', icon: 'chili-hot', active: false },
          { label: 'Desserts', icon: 'cupcake', active: false },
        ].map((filter, index) => (
          <Pressable key={index} style={[styles.filterTag, filter.active && styles.filterTagActive]}>
            <MaterialCommunityIcons 
              name={filter.icon as any} 
              size={14} 
              color={filter.active ? '#FF6B35' : '#666'} 
            />
            <Text style={[styles.filterText, filter.active && styles.filterTextActive]}>
              {filter.label}
          </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Dishes Container */}
      <View style={styles.dishesContainer}>
        {viewMode === 'list' ? (
          // List View
          <View style={styles.listContainer}>
            {dishes.map((dish, index) => (
              <EnhancedFoodItemCard
                key={dish.id}
                dish={dish}
                onAddToCart={onAddToCart}
                viewMode="list"
                index={index}
              />
            ))}
          </View>
        ) : (
          // Grid View
          <View style={styles.gridContainer}>
            {dishes.map((dish, index) => (
              <View key={dish.id} style={styles.gridItem}>
                <EnhancedFoodItemCard
                  dish={dish}
                  onAddToCart={onAddToCart}
                  viewMode="grid"
                  index={index}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="clock-fast" size={16} color="#4CAF50" />
          <Text style={styles.metricText}>Avg 25 min delivery</Text>
        </View>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.metricText}>4.5+ rated dishes</Text>
        </View>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#2196F3" />
          <Text style={styles.metricText}>Quality assured</Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    paddingVertical: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    padding: 6,
    borderRadius: 6,
    minWidth: 28,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  viewAllButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  viewAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterTagActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FF6B35',
  },
  dishesContainer: {
    paddingHorizontal: 16,
  },
  listContainer: {
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 44) / 2, // Account for padding and gap
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
}); 