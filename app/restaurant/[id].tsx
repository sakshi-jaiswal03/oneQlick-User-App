import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  Animated,
  Pressable,
  StatusBar
} from 'react-native';
import { Text, Surface, Chip, Button, IconButton, Badge } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';
import { restaurantData, menuCategories, foodItems } from './restaurantData';

const { width, height } = Dimensions.get('window');

export default function RestaurantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const restaurantId = params.id as string;
  const { addToCart, cart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartBar, setShowCartBar] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryTabsRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Filter food items by selected category and search query
  const filteredFoodItems = foodItems.filter(item => {
    const matchesCategory = item.categoryId === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate cart total
  const cartTotal = Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
    const item = foodItems.find(food => food.id === itemId);
    return total + (item ? item.price * quantity : 0);
  }, 0);

  // Calculate total items
  const totalItems = Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);

  useEffect(() => {
    // Animate in the screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Show cart bar if items are selected
    setShowCartBar(Object.keys(selectedItems).length > 0);
  }, [selectedItems]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll to top when category changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleAddToCart = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] && newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const handleProceedToCart = () => {
    // Add all selected items to cart
    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      const item = foodItems.find(food => food.id === itemId);
      if (item) {
        // Convert to expected FoodItem format
        const cartItem = {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: 'Restaurant',
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
          isPopular: item.isPopular,
          isRecommended: false,
          addOns: [],
        };
        addToCart(cartItem, quantity);
      }
    });
    
    // Navigate to cart
                  router.push('/(modals)/cart');
  };

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Image 
        source={{ uri: restaurantData.bannerImage }} 
        style={styles.heroImage}
        resizeMode="cover"
      />
      
      {/* Back button overlay */}
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </Pressable>

      {/* Restaurant info overlay */}
      <View style={styles.heroOverlay}>
        <View style={styles.restaurantBasicInfo}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          <Text style={styles.restaurantCuisine}>{restaurantData.cuisine.join(' • ')}</Text>
          <Text style={styles.restaurantLocation}>{restaurantData.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickStats = () => (
    <Surface style={styles.quickStatsContainer}>
      <View style={styles.statItem}>
        <MaterialIcons name="star" size={20} color="#FFD700" />
        <Text style={styles.statValue}>{restaurantData.rating}</Text>
        <Text style={styles.statLabel}>{restaurantData.totalRatings}+ ratings</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <MaterialIcons name="access-time" size={20} color="#FF6B35" />
        <Text style={styles.statValue}>{restaurantData.deliveryTime}</Text>
        <Text style={styles.statLabel}>Delivery</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <MaterialIcons name="location-on" size={20} color="#4CAF50" />
        <Text style={styles.statValue}>{restaurantData.distance}</Text>
        <Text style={styles.statLabel}>Distance</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <MaterialIcons name="attach-money" size={20} color="#2196F3" />
        <Text style={styles.statValue}>₹{restaurantData.costForTwo}</Text>
        <Text style={styles.statLabel}>Cost for 2</Text>
      </View>
    </Surface>
  );

  const renderCategoryTabs = () => (
    <Surface style={styles.categoryTabsContainer}>
      <ScrollView 
        ref={categoryTabsRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {menuCategories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <MaterialIcons 
              name={category.icon as any} 
              size={20} 
              color={selectedCategory === category.id ? '#FF6B35' : '#666'} 
            />
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.id && styles.categoryTabTextActive
            ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Surface>
  );

  const renderFoodItem = (item: any) => {
    const itemQuantity = selectedItems[item.id] || 0;
    
    return (
          <Surface key={item.id} style={styles.foodItemCard}>
      {/* Veg indicator */}
      <View style={styles.vegIndicator}>
        <MaterialIcons 
          name={item.isVeg ? "circle" : "cancel"} 
          size={16} 
          color={item.isVeg ? "#4CAF50" : "#F44336"} 
        />
      </View>
      
      {/* Popular badge */}
      {item.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Popular</Text>
        </View>
      )}
        
        <View style={styles.foodItemContent}>
          <View style={styles.foodItemHeader}>
            <View style={styles.foodItemInfo}>
              <Text style={styles.foodItemName} numberOfLines={2}>
                {item.name}
              </Text>
              
              <Text style={styles.foodItemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              
              <View style={styles.foodItemMeta}>
                <Text style={styles.preparationTime}>{item.preparationTime}</Text>
                {item.allergens && item.allergens.length > 0 && (
                  <Text style={styles.allergens}>Contains: {item.allergens.join(', ')}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: item.image }} style={styles.foodItemImage} />
            </View>
          </View>
          
          <View style={styles.foodItemFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.foodItemPrice}>₹{item.price}</Text>
              {item.originalPrice && item.originalPrice > item.price && (
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
              )}
            </View>
            
            {itemQuantity > 0 ? (
              <View style={styles.quantitySelector}>
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => handleRemoveFromCart(item.id)}
                >
                  <MaterialIcons name="remove" size={20} color="#FF6B35" />
                </Pressable>
                
                <Text style={styles.quantityText}>{itemQuantity}</Text>
                
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => handleAddToCart(item.id)}
                >
                  <MaterialIcons name="add" size={20} color="#FF6B35" />
                </Pressable>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={() => handleAddToCart(item.id)}
                style={styles.addButton}
                contentStyle={styles.addButtonContent}
              >
                Add
              </Button>
            )}
          </View>
        </View>
      </Surface>
    );
  };

  const renderReviewsSection = () => (
    <View style={styles.reviewsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
        <Pressable>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      
      {restaurantData.reviews.slice(0, 5).map((review, index) => (
        <Surface key={index} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{review.reviewerName}</Text>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialIcons
                    key={star}
                    name={star <= review.rating ? "star" : "star-border"}
                    size={16}
                    color={star <= review.rating ? "#FFD700" : "#ddd"}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
          
          <Text style={styles.reviewText} numberOfLines={3}>
            {review.comment}
          </Text>
        </Surface>
      ))}
    </View>
  );

  const renderRestaurantDetails = () => (
    <View style={styles.restaurantDetailsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Restaurant Details</Text>
      </View>
      
      <Surface style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{restaurantData.address}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Opening Hours</Text>
            <Text style={styles.detailValue}>{restaurantData.openingHours}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{restaurantData.phone}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="delivery-dining" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Delivery Fee</Text>
            <Text style={styles.detailValue}>₹{restaurantData.deliveryFee}</Text>
          </View>
        </View>
      </Surface>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Hero Section */}
        {renderHeroSection()}
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Stats */}
          {renderQuickStats()}
          
          {/* Category Tabs */}
          {renderCategoryTabs()}
          
          {/* Food Items */}
          <View style={styles.foodItemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {menuCategories.find(cat => cat.id === selectedCategory)?.name}
              </Text>
              <Text style={styles.itemCount}>{filteredFoodItems.length} items</Text>
            </View>
            
            <View style={styles.foodItemsContainer}>
              {filteredFoodItems.map(renderFoodItem)}
            </View>
          </View>
          
          {/* Reviews Section */}
          {renderReviewsSection()}
          
          {/* Restaurant Details */}
          {renderRestaurantDetails()}
          
          {/* Bottom spacing for cart bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
      
      {/* Sticky Cart Bar */}
      {showCartBar && (
        <Animated.View style={[styles.cartBar, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemsCount}>{totalItems} items</Text>
            <Text style={styles.cartTotal}>₹{cartTotal}</Text>
          </View>
          
          <Button
            mode="contained"
            onPress={handleProceedToCart}
            style={styles.proceedButton}
            contentStyle={styles.proceedButtonContent}
          >
            Proceed to Cart
          </Button>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  restaurantBasicInfo: {
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#ccc',
  },
  scrollView: {
    flex: 1,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  categoryTabsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryTabActive: {
    backgroundColor: '#FFF3E0',
  },
  categoryTabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  foodItemsSection: {
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
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  foodItemsContainer: {
    gap: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  foodItemCard: {
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  foodItemHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
    width: '100%',
  },
  foodItemInfo: {
    flex: 1,
    marginRight: 16,
    minWidth: 0, // Prevents text overflow
  },
  foodItemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  foodItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  foodItemMeta: {
    marginTop: 8,
  },
  preparationTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  allergens: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  vegIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  foodItemContent: {
    padding: 16,
    paddingTop: 0,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  foodItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  foodItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#FF6B35',
  },
  addButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  reviewsSection: {
    padding: 20,
    paddingTop: 0,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  reviewCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  restaurantDetailsSection: {
    padding: 20,
    paddingTop: 0,
  },
  detailsCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },
  cartInfo: {
    flex: 1,
  },
  cartItemsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cartTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  proceedButton: {
    backgroundColor: '#FF6B35',
  },
  proceedButtonContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
}); 