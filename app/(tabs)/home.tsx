import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable 
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCart';
import { FoodItem } from '../../types';
import { getCurrentLocation } from '../../utils/locationUtils';
import {
  HomeHeader,
  FoodCategories,
  NearbyRestaurants,
  PopularDishes,
  QuickReorder,
} from '../../components/home';
import Carousel from '../../components/home/Carousel';
import { carouselItems } from '../../components/home/carouselData';
import {
  foodCategories,
  nearbyRestaurants,
  popularDishes,
  quickReorders,
} from '../../components/home/homeData';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [userLocation, setUserLocation] = useState('Rajpur Village, Haridwar, UK');
  const [currentCoordinates, setCurrentCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  
  const router = useRouter();
  const { addToCart } = useCart();
  const scrollViewRef = useRef<ScrollView>(null);

  // Get location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await getCurrentLocationData();
      } catch (error) {
        console.log('Location not available on app start:', error);
        // Don't show error on app start, user can manually request location
      }
    };
    
    initializeLocation();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh location along with other data
      await getCurrentLocationData();
      // Simulate other API calls
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.log('Error refreshing location:', error);
      setRefreshing(false);
    }
  }, []);

  const handleCarouselChange = (index: number) => {
    setCurrentCarouselIndex(index);
  };

  const getCurrentLocationData = async () => {
    try {
      const locationData = await getCurrentLocation();
      
      setCurrentCoordinates(locationData.coordinates);
      setUserLocation(locationData.displayName);
      
      return locationData.coordinates;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  };

  const handleLocationPress = async () => {
    try {
      await getCurrentLocationData();
      Alert.alert('Success', 'Location updated successfully!');
    } catch (error) {
      console.error('Location error:', error);
      if (error instanceof Error && error.message.includes('permission')) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              Alert.alert('Settings', 'Please go to your device settings and enable location permissions for this app.');
            }}
          ]
        );
      } else {
        Alert.alert('Location Error', 'Could not detect your current location. Please check your GPS settings and try again.');
      }
    }
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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <HomeHeader 
          userLocation={userLocation}
          onLocationPress={handleLocationPress}
          hasLocation={!!currentCoordinates}
        />

        {/* Carousel */}
        <Carousel 
          items={carouselItems}
          currentIndex={currentCarouselIndex}
          onItemChange={handleCarouselChange}
          onItemPress={(item) => {
            console.log('Carousel item pressed:', item.title);
            // Handle carousel item press
          }}
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

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    paddingBottom: 40,
    paddingTop: 0,
  },
  bottomSpacing: {
    height: 60,
  },
}); 
