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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCart';
import { FoodItem } from '../../types';
import { getCurrentLocation } from '../../utils/locationUtils';
import {
  HomeHeader,
  FoodCategories,
  NearbyRestaurants,
  PopularDishes,
} from '../../components/home';
import Carousel from '../../components/home/Carousel';
import { carouselItems } from '../../components/home/carouselData';
import {
  foodCategories,
  nearbyRestaurants,
  popularDishes,
} from '../../components/home/homeData';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [userLocation, setUserLocation] = useState('Getting your location...');
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
        setUserLocation('Tap to set your location');
      }
    };
    
    initializeLocation();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getCurrentLocationData();
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
    } catch (error) {
      console.error('Location error:', error);
      if (error instanceof Error && error.message.includes('permission')) {
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to show nearby restaurants and delivery options. Please enable location permissions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enable Location', onPress: () => {
              getCurrentLocationData().catch(() => {
                Alert.alert('Settings', 'Please go to Settings > Privacy & Security > Location Services and enable location for this app.');
              });
            }}
          ]
        );
      } else {
        Alert.alert(
          'Location Not Found', 
          'Please turn on your device location and try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: handleLocationPress }
          ]
        );
      }
    }
  };

  const handleAddToCart = async (dish: FoodItem) => {
    try {
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
        {/* Header - Keep intact */}
        <HomeHeader 
          userLocation={userLocation}
          onLocationPress={handleLocationPress}
          hasLocation={!!currentCoordinates}
        />

        {/* Enhanced Search Bar Section */}
        <View style={styles.searchSection}>
          <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" />
            <Text style={styles.searchText}>Search for restaurants, cuisines, dishes...</Text>
            <MaterialCommunityIcons name="microphone" size={18} color="#FF6B35" />
          </Pressable>
        </View>

        {/* Carousel */}
        <Carousel 
          items={carouselItems}
          currentIndex={currentCarouselIndex}
          onItemChange={handleCarouselChange}
          onItemPress={(item) => {
            console.log('Carousel item pressed:', item.title);
          }}
        />

        {/* Food Categories */}
        <FoodCategories categories={foodCategories} />

        {/* Restaurants Near You Section */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons name="store" size={20} color="#FF6B35" />
                <Text style={styles.sectionTitle}>Restaurants Near You</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Fastest delivery • Best rated</Text>
            </View>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="#FF6B35" />
            </Pressable>
          </View>
          
          <NearbyRestaurants restaurants={nearbyRestaurants} />
        </View>

        {/* Popular Dishes */}
        <PopularDishes 
          dishes={popularDishes.slice(0, 4)}
          onAddToCart={handleAddToCart}
        />

        {/* More to Explore Section */}
        <View style={styles.moreExploreSection}>
          <View style={styles.exploreHeader}>
            <MaterialCommunityIcons name="compass-outline" size={20} color="#FF6B35" />
            <Text style={styles.exploreTitle}>More to explore</Text>
          </View>
          
          <View style={styles.exploreGrid}>
            <Pressable style={styles.exploreCard}>
              <LinearGradient
                colors={['#FF6B35', '#FF8562']}
                style={styles.exploreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.exploreIconContainer}>
                  <MaterialCommunityIcons name="percent" size={20} color="white" />
                </View>
                <Text style={styles.exploreCardTitle}>Offers</Text>
                <Text style={styles.exploreCardSubtitle}>Up to 60% off</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.exploreCard}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.exploreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.exploreIconContainer}>
                  <MaterialCommunityIcons name="leaf" size={20} color="white" />
                </View>
                <Text style={styles.exploreCardTitle}>Healthy</Text>
                <Text style={styles.exploreCardSubtitle}>Pure veg options</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.exploreCard}>
              <LinearGradient
                colors={['#2196F3', '#42A5F5']}
                style={styles.exploreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.exploreIconContainer}>
                  <MaterialCommunityIcons name="lightning-bolt" size={20} color="white" />
                </View>
                <Text style={styles.exploreCardTitle}>Express</Text>
                <Text style={styles.exploreCardSubtitle}>Under 20 mins</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.exploreCard}>
              <LinearGradient
                colors={['#9C27B0', '#BA68C8']}
                style={styles.exploreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.exploreIconContainer}>
                  <MaterialCommunityIcons name="crown" size={20} color="white" />
                </View>
                <Text style={styles.exploreCardTitle}>Premium</Text>
                <Text style={styles.exploreCardSubtitle}>Fine dining</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Special Offers Banner */}
        <View style={styles.specialOfferSection}>
          <LinearGradient
            colors={['#FF6B35', '#FF8562', '#FFA726']}
            style={styles.offerBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.offerContent}>
              <View style={styles.offerTextContainer}>
                <View style={styles.offerBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FF6B35" />
                  <Text style={styles.offerBadgeText}>LIMITED TIME</Text>
                </View>
                <Text style={styles.offerTitle}>Get 50% OFF</Text>
                <Text style={styles.offerSubtitle}>on your first order above ₹299</Text>
                <Text style={styles.offerCode}>Use code: WELCOME50</Text>
              </View>
              <View style={styles.offerIconContainer}>
                <MaterialCommunityIcons name="gift" size={40} color="white" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* App Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresHeader}>
            <MaterialCommunityIcons name="star" size={20} color="#FF6B35" />
            <Text style={styles.featuresTitle}>Why choose oneQlick?</Text>
          </View>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="clock-fast" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>Fast Delivery</Text>
              <Text style={styles.featureDescription}>Average 25 min delivery</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#2196F3" />
              </View>
              <Text style={styles.featureTitle}>Quality Food</Text>
              <Text style={styles.featureDescription}>Fresh & hygienic</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="wallet" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.featureTitle}>Best Prices</Text>
              <Text style={styles.featureDescription}>No hidden charges</Text>
            </View>
          </View>
        </View>

        {/* Customer Testimonial */}
        <View style={styles.testimonialSection}>
          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.userAvatar}>
                <MaterialCommunityIcons name="account" size={20} color="#FF6B35" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Priya S.</Text>
                <View style={styles.ratingContainer}>
                  {[1,2,3,4,5].map((star) => (
                    <MaterialCommunityIcons key={star} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Amazing food quality and super fast delivery! oneQlick has become my go-to app for ordering food. Highly recommended! 🍕"
            </Text>
          </View>
        </View>

        {/* Made in India Section */}
        <View style={styles.madeInIndiaSection}>
          <View style={styles.madeInIndiaContainer}>
            <MaterialCommunityIcons name="heart" size={16} color="#FF6B35" />
            <Text style={styles.madeInIndiaText}>Made in India with</Text>
            <MaterialCommunityIcons name="heart" size={16} color="#FF6B35" />
            <Text style={styles.madeInIndiaText}>Love</Text>
          </View>
          <Text style={styles.madeInIndiaSubtext}>Proudly serving delicious food across the nation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e8eaed',
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  restaurantsSection: {
    backgroundColor: 'white',
    marginBottom: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
  },
  moreExploreSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  exploreCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exploreGradient: {
    padding: 14,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
    gap: 6,
  },
  exploreIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  exploreCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  exploreCardSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  specialOfferSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  offerBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B35',
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontWeight: '500',
  },
  offerCode: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  offerIconContainer: {
    opacity: 0.3,
  },

  featuresSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },

  testimonialSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  testimonialCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },

  madeInIndiaSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  madeInIndiaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  madeInIndiaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  madeInIndiaSubtext: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 
