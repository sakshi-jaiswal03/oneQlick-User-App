import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCart';

// Import components
import {
  HomeHeader,
  SearchBar,
  PromotionalBanners,
  FoodCategories,
  NearbyRestaurants,
  PopularDishes,
  QuickReorder,
  promotionalBanners,
  foodCategories,
  nearbyRestaurants,
  popularDishes,
  quickReorders,
  type PopularDish
} from '../../components/home';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [userLocation, setUserLocation] = useState('Rajpur Village, Haridwar, UK');
  
  const router = useRouter();
  const { addToCart } = useCart();
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-advance promotional banners
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      if (currentBannerIndex < promotionalBanners.length - 1) {
        setCurrentBannerIndex(currentBannerIndex + 1);
      } else {
        setCurrentBannerIndex(0);
      }
    }, 4000);

    return () => clearInterval(bannerTimer);
  }, [currentBannerIndex]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLocationPress = () => {
    // TODO: Implement location picker modal
    console.log('Location picker pressed');
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleVoiceSearchPress = () => {
    // TODO: Implement voice search
    console.log('Voice search pressed');
  };

  const handleBannerChange = (index: number) => {
    setCurrentBannerIndex(index);
  };

  const handleAddToCart = (dish: PopularDish) => {
    // Convert PopularDish to FoodItem format for cart
    const foodItem = {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      category: 'Popular',
      isVeg: dish.isVeg,
      isAvailable: true,
      isPopular: true,
      isRecommended: false,
      addOns: [],
    };
    
    addToCart(foodItem, 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader 
          userLocation={userLocation}
          onLocationPress={handleLocationPress}
        />

        {/* Search Bar */}
        <SearchBar 
          onSearchPress={handleSearchPress}
          onVoiceSearchPress={handleVoiceSearchPress}
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