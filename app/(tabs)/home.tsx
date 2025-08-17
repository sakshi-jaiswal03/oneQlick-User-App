import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCart';
import { FoodItem } from '../../types';
import {
  HomeHeader,
  PromotionalBanners,
  FoodCategories,
  NearbyRestaurants,
  PopularDishes,
  QuickReorder,
} from '../../components/home';
import {
  promotionalBanners,
  foodCategories,
  nearbyRestaurants,
  popularDishes,
  quickReorders,
} from '../../components/home/homeData';

export default function HomeScreen() { 
  const [refreshing, setRefreshing] = useState(false); 
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0); 
  const [userLocation, setUserLocation] = useState('Rajpur Village, Haridwar, UK');
  
  const router = useRouter();
  const { addToCart } = useCart();
  const scrollViewRef = useRef<ScrollView>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleBannerChange = (index: number) => {
    setCurrentBannerIndex(index);
  };

  const handleLocationPress = () => {
    // Handle location change
    console.log('Location pressed');
  };

  const handleAddToCart = async (dish: FoodItem) => {
    try {
      // Add the food item directly to cart since it's already in the correct format
      await addToCart(dish, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <HomeHeader 
          userLocation={userLocation}
          onLocationPress={handleLocationPress}
        />

        {/* Promotional Banners */}
        <PromotionalBanners 
          banners={promotionalBanners}
          currentIndex={currentBannerIndex}
          onBannerChange={handleBannerChange}
        />

        {/* Food Categories */}
        <FoodCategories categories={foodCategories} />

        {/* Quick Reorder */}
        <QuickReorder reorders={quickReorders} />

        {/* Restaurants Near You */}
        <NearbyRestaurants restaurants={nearbyRestaurants} />

        {/* Popular Dishes */}
        <PopularDishes 
          dishes={popularDishes}
          onAddToCart={handleAddToCart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
}); 
