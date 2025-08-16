import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
  Menu,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Interfaces
interface SearchResult {
  id: string;
  type: 'restaurant' | 'dish';
  name: string;
  description?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  cuisine?: string;
  price?: number;
  restaurantName?: string;
  restaurantId?: string;
  isVeg?: boolean;
  isPopular?: boolean;
  isFastDelivery?: boolean;
  distance?: string;
  offers?: string[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  icon?: string;
}

interface SortOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SearchFilter {
  id: string;
  name: string;
  count: number;
  isSelected: boolean;
  type: 'cuisine' | 'price' | 'rating' | 'delivery' | 'preset';
}

interface QuickFilter {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export default function SearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<any>(null);
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<QuickFilter[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['biryani', 'pizza', 'chinese']);
  const [trendingSearches] = useState<string[]>(['masala dosa', 'butter chicken', 'gulab jamun']);
  
  // Animation values
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const filtersAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;

  // Data
  const sortOptions: SortOption[] = [
    { id: 'relevance', name: 'Relevance', description: 'Most relevant results', icon: 'star' },
    { id: 'rating', name: 'Rating', description: 'Highest rated first', icon: 'star' },
    { id: 'delivery-time', name: 'Delivery Time', description: 'Fastest delivery first', icon: 'access-time' },
    { id: 'price-low', name: 'Price: Low to High', description: 'Lowest price first', icon: 'trending-up' },
    { id: 'price-high', name: 'Price: High to Low', description: 'Highest price first', icon: 'trending-down' },
    { id: 'distance', name: 'Distance', description: 'Nearest first', icon: 'place' },
  ];

  const searchFilters: SearchFilter[] = [
    // Cuisine filters
    { id: 'cuisine_north_indian', name: 'North Indian', count: 45, isSelected: false, type: 'cuisine' },
    { id: 'cuisine_south_indian', name: 'South Indian', count: 38, isSelected: false, type: 'cuisine' },
    { id: 'cuisine_chinese', name: 'Chinese', count: 28, isSelected: false, type: 'cuisine' },
    { id: 'cuisine_fast_food', name: 'Fast Food', count: 42, isSelected: false, type: 'cuisine' },
    
    // Price filters
    { id: 'price_under_200', name: 'Under ₹200', count: 89, isSelected: false, type: 'price' },
    { id: 'price_200_500', name: '₹200-500', count: 156, isSelected: false, type: 'price' },
    { id: 'price_above_500', name: 'Above ₹500', count: 67, isSelected: false, type: 'price' },
    
    // Rating filters
    { id: 'rating_4_plus', name: '4.0+', count: 234, isSelected: false, type: 'rating' },
    { id: 'rating_4_5_plus', name: '4.5+', count: 156, isSelected: false, type: 'rating' },
    
    // Delivery filters
    { id: 'delivery_under_30', name: 'Under 30 mins', count: 123, isSelected: false, type: 'delivery' },
    { id: 'delivery_30_60', name: '30-60 mins', count: 189, isSelected: false, type: 'delivery' },
  ];

  const quickFilterPresets: QuickFilter[] = [
    { id: 'veg-only', name: 'Veg Only', icon: 'eco', active: false },
    { id: 'fast-delivery', name: 'Fast Delivery', icon: 'flash-on', active: false },
    { id: 'popular', name: 'Popular', icon: 'trending-up', active: false },
    { id: 'budget-friendly', name: 'Budget Friendly', icon: 'account-balance-wallet', active: false },
  ];

  const sampleSearchResults: SearchResult[] = [
    // Restaurant results
    {
      id: 'rest-1',
      type: 'restaurant',
      name: "Sharma's Kitchen",
      description: 'Authentic North Indian cuisine with traditional recipes',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center',
      rating: 4.5,
      reviewCount: 1247,
      deliveryTime: '25-35 mins',
      deliveryFee: 30,
      minOrder: 150,
      cuisine: 'North Indian',
      isVeg: false,
      isPopular: true,
      isFastDelivery: true,
      distance: '0.8 km',
      offers: ['20% OFF', 'Free Delivery'],
    },
    {
      id: 'rest-2',
      type: 'restaurant',
      name: 'Pizza Palace',
      description: 'Modern Italian fusion with international flavors',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
      rating: 4.3,
      reviewCount: 892,
      deliveryTime: '30-40 mins',
      deliveryFee: 25,
      minOrder: 200,
      cuisine: 'Italian',
      isVeg: true,
      isPopular: false,
      isFastDelivery: false,
      distance: '1.2 km',
      offers: ['Buy 1 Get 1'],
    },
    {
      id: 'rest-3',
      type: 'restaurant',
      name: 'Biryani House',
      description: 'Authentic Hyderabadi biryani and traditional dishes',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop&crop=center',
      rating: 4.7,
      reviewCount: 2156,
      deliveryTime: '20-30 mins',
      deliveryFee: 20,
      minOrder: 180,
      cuisine: 'Hyderabadi',
      isVeg: false,
      isPopular: true,
      isFastDelivery: true,
      distance: '0.5 km',
      offers: ['30% OFF'],
    },
    
    // Dish results
    {
      id: 'dish-1',
      type: 'dish',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice cooked with tender chicken and spices',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
      rating: 4.6,
      reviewCount: 234,
      deliveryTime: '25-35 mins',
      deliveryFee: 30,
      minOrder: 180,
      price: 280,
      restaurantName: "Sharma's Kitchen",
      restaurantId: 'rest-1',
      isVeg: false,
      isPopular: true,
      isFastDelivery: true,
      distance: '0.8 km',
    },
    {
      id: 'dish-2',
      type: 'dish',
      name: 'Masala Dosa',
      description: 'Crispy dosa filled with spiced potato mixture',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
      rating: 4.8,
      reviewCount: 189,
      deliveryTime: '20-30 mins',
      deliveryFee: 20,
      minOrder: 80,
      price: 120,
      restaurantName: 'Dosa Corner',
      restaurantId: 'rest-3',
      isVeg: true,
      isPopular: true,
      isFastDelivery: true,
      distance: '0.5 km',
    },
    {
      id: 'dish-3',
      type: 'dish',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato and butter gravy',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
      rating: 4.4,
      reviewCount: 167,
      deliveryTime: '25-35 mins',
      deliveryFee: 30,
      minOrder: 160,
      price: 320,
      restaurantName: "Sharma's Kitchen",
      restaurantId: 'rest-1',
      isVeg: false,
      isPopular: true,
      isFastDelivery: true,
      distance: '0.8 km',
    },
  ];

  useEffect(() => {
    startAnimations();
    setSearchResults(sampleSearchResults);
    setFilteredResults(sampleSearchResults);
    setQuickFilters(quickFilterPresets);
    setSelectedSort(sortOptions[0]);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const newSuggestions = getSearchSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedFilters, quickFilters, selectedSort, searchResults]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(searchBarAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(filtersAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(resultsAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  };

  const getSearchSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) return [];
    
    const suggestions: SearchSuggestion[] = [];
    const lowerQuery = query.toLowerCase();
    
    trendingSearches.forEach(item => {
      if (item.toLowerCase().includes(lowerQuery)) {
        suggestions.push({ id: `trending-${item}`, text: item, type: 'suggestion', icon: 'trending-up' });
      }
    });
    
    const popularDishes = ['biryani', 'pizza', 'burger', 'noodles', 'rice', 'bread', 'curry', 'tandoori', 'kebab', 'dessert'];
    popularDishes.forEach(dish => {
      if (dish.includes(lowerQuery)) {
        suggestions.push({
          id: `dish-${dish}`,
          text: dish,
          type: 'suggestion',
          icon: 'restaurant-menu',
        });
      }
    });
    
    return suggestions.slice(0, 8);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...searchResults];
    
    // Apply selected filters
    selectedFilters.forEach(filterId => {
      const filter = searchFilters.find(f => f.id === filterId);
      if (!filter) return;
      
      switch (filter.type) {
        case 'cuisine':
          filtered = filtered.filter(item => 
            item.cuisine?.toLowerCase().includes(filter.name.toLowerCase())
          );
          break;
        case 'price':
          if (filter.name.includes('Under ₹200')) {
            filtered = filtered.filter(item => (item.price || 0) < 200);
          } else if (filter.name.includes('₹200-500')) {
            filtered = filtered.filter(item => (item.price || 0) >= 200 && (item.price || 0) <= 500);
          } else if (filter.name.includes('Above ₹500')) {
            filtered = filtered.filter(item => (item.price || 0) > 500);
          }
          break;
        case 'rating':
          if (filter.name.includes('4.0+')) {
            filtered = filtered.filter(item => item.rating >= 4.0);
          } else if (filter.name.includes('4.5+')) {
            filtered = filtered.filter(item => item.rating >= 4.5);
          }
          break;
        case 'delivery':
          filtered = filtered.filter(item => {
            const deliveryTime = parseInt(item.deliveryTime.split('-')[0]);
            if (filter.name.includes('Under 30 mins')) {
              return deliveryTime < 30;
            } else if (filter.name.includes('30-60 mins')) {
              return deliveryTime >= 30 && deliveryTime <= 60;
            }
            return false;
          });
          break;
      }
    });
    
    // Apply quick filters
    quickFilters.forEach(filter => {
      if (filter.active) {
        switch (filter.id) {
          case 'veg-only':
            filtered = filtered.filter(item => item.isVeg);
            break;
          case 'fast-delivery':
            filtered = filtered.filter(item => item.isFastDelivery);
            break;
          case 'popular':
            filtered = filtered.filter(item => item.isPopular);
            break;
          case 'budget-friendly':
            filtered = filtered.filter(item => (item.price || 0) <= 200);
            break;
        }
      }
    });
    
    // Apply sorting
    if (selectedSort) {
      switch (selectedSort.id) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'delivery-time':
          filtered.sort((a, b) => {
            const timeA = parseInt(a.deliveryTime.split('-')[0]);
            const timeB = parseInt(b.deliveryTime.split('-')[0]);
            return timeA - timeB;
          });
          break;
        case 'price-low':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'distance':
          filtered.sort((a, b) => {
            const aDist = parseFloat(a.distance?.replace(' km', '') || '0');
            const bDist = parseFloat(b.distance?.replace(' km', '') || '0');
            return aDist - bDist;
          });
          break;
      }
    }
    
    setFilteredResults(filtered);
  };

  const performSearch = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results = [...sampleSearchResults];
    
    if (searchQuery.trim()) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSearch();
    } else {
      setSearchResults(sampleSearchResults);
      setFilteredResults(sampleSearchResults);
    }
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setQuickFilters(prev => 
      prev.map(f => 
        f.id === filterId ? { ...f, active: !f.active } : f
      )
    );
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    performSearch();
    
    if (!recentSearches.includes(suggestion.text)) {
      setRecentSearches(prev => [suggestion.text, ...prev.slice(0, 4)]);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'restaurant') {
      router.push(`/restaurant/${result.id}`);
    } else {
      router.push(`/food-item/${result.id}`);
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setQuickFilters(quickFilterPresets.map(f => ({ ...f, active: false })));
    setSelectedSort(sortOptions[0]);
  };

  const renderSearchBar = () => (
    <Animated.View style={[styles.searchBarContainer, { opacity: searchBarAnim }]}>
      <Surface style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          ref={searchInputRef}
          placeholder="Search for restaurants, dishes, cuisines..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          onFocus={() => setShowSuggestions(true)}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => {
              setSearchQuery('');
              setSearchResults(sampleSearchResults);
              setFilteredResults(sampleSearchResults);
            }}
            iconColor="#666"
          />
        )}
      </Surface>
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Surface style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <MaterialIcons
                name={suggestion.icon as any || 'search'}
                size={20}
                color="#666"
                style={styles.suggestionIcon}
              />
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
              <MaterialIcons name="arrow-upward" size={16} color="#999" />
            </Pressable>
          ))}
        </Surface>
      )}
    </Animated.View>
  );

  const renderQuickFilters = () => (
    <Animated.View style={[styles.quickFiltersContainer, { opacity: filtersAnim }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            mode={filter.active ? 'flat' : 'outlined'}
            selected={filter.active}
            onPress={() => handleQuickFilterToggle(filter.id)}
            style={[styles.quickFilterChip, filter.active && styles.activeQuickFilterChip]}
            textStyle={filter.active ? { color: 'white' } : {}}
            icon={filter.icon}
          >
            {filter.name}
          </Chip>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderSearchFilters = () => (
    <Animated.View style={[styles.filtersContainer, { opacity: filtersAnim }]}>
      <View style={styles.filtersHeader}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <Button
          mode="text"
          onPress={clearAllFilters}
          textColor="#FF6B35"
          compact
        >
          Clear All
        </Button>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {searchFilters.map((filter) => (
          <Chip
            key={filter.id}
            mode={selectedFilters.includes(filter.id) ? 'flat' : 'outlined'}
            selected={selectedFilters.includes(filter.id)}
            onPress={() => handleFilterToggle(filter.id)}
            style={styles.filterChip}
            textStyle={selectedFilters.includes(filter.id) ? { color: 'white' } : {}}
          >
            {filter.name} ({filter.count})
          </Chip>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderSearchSuggestions = () => {
    if (searchQuery.trim() || filteredResults.length > 0) return null;
    
    return (
      <Animated.View style={[styles.suggestionsSection, { opacity: filtersAnim }]}>
        {/* Recent Searches */}
        <View style={styles.suggestionGroup}>
          <Text style={styles.suggestionGroupTitle}>Recent Searches</Text>
          <View style={styles.suggestionChips}>
            {recentSearches.map((search, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleSuggestionPress({ id: `recent-${index}`, text: search, type: 'recent' })}
                style={styles.suggestionChip}
                icon="history"
              >
                {search}
              </Chip>
            ))}
          </View>
        </View>
        
        {/* Trending Searches */}
        <View style={styles.suggestionGroup}>
          <Text style={styles.suggestionGroupTitle}>Trending Now</Text>
          <View style={styles.suggestionChips}>
            {trendingSearches.map((search, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleSuggestionPress({ id: `trending-${index}`, text: search, type: 'trending' })}
                style={styles.suggestionChip}
                icon="trending-up"
              >
                {search}
              </Chip>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderRestaurantCard = (restaurant: SearchResult) => (
    <Pressable
      key={restaurant.id}
      style={styles.resultCard}
      onPress={() => handleResultPress(restaurant)}
    >
      <Surface style={styles.resultSurface}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{restaurant.name}</Text>
            <Text style={styles.resultCuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.resultDescription} numberOfLines={2}>
              {restaurant.description}
            </Text>
          </View>
          
          <View style={styles.resultImage}>
            <MaterialIcons name="restaurant" size={40} color="#ccc" />
          </View>
        </View>
        
        <View style={styles.resultDetails}>
          <View style={styles.resultStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{restaurant.rating}</Text>
              <Text style={styles.statSubtext}>({restaurant.reviewCount})</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="delivery-dining" size={16} color="#666" />
              <Text style={styles.statText}>₹{restaurant.deliveryFee}</Text>
            </View>
          </View>
          
          <View style={styles.quickInfo}>
            {restaurant.isVeg && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#4CAF50' }} compact>
                Veg
              </Chip>
            )}
            {restaurant.isPopular && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#FF9800' }} compact>
                Popular
              </Chip>
            )}
            {restaurant.isFastDelivery && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#2196F3' }} compact>
                Fast
              </Chip>
            )}
            {restaurant.distance && (
              <Text style={styles.distanceText}>{restaurant.distance}</Text>
            )}
          </View>
        </View>
        
        {restaurant.offers && restaurant.offers.length > 0 && (
          <View style={styles.offersContainer}>
            {restaurant.offers.slice(0, 2).map((offer, index) => (
              <Chip key={index} mode="outlined" compact style={styles.offerChip}>
                {offer}
              </Chip>
            ))}
          </View>
        )}
      </Surface>
    </Pressable>
  );

  const renderDishCard = (dish: SearchResult) => (
    <Pressable
      key={dish.id}
      style={styles.resultCard}
      onPress={() => handleResultPress(dish)}
    >
      <Surface style={styles.resultSurface}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{dish.name}</Text>
            <Text style={styles.resultCuisine}>{dish.restaurantName}</Text>
            <Text style={styles.resultDescription} numberOfLines={2}>
              {dish.description}
            </Text>
          </View>
          
          <View style={styles.resultImage}>
            <MaterialIcons name="restaurant-menu" size={40} color="#ccc" />
          </View>
        </View>
        
        <View style={styles.resultDetails}>
          <View style={styles.resultStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{dish.rating}</Text>
              <Text style={styles.statSubtext}>({dish.reviewCount})</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.statText}>{dish.deliveryTime}</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="delivery-dining" size={16} color="#666" />
              <Text style={styles.statText}>₹{dish.deliveryFee}</Text>
            </View>
          </View>
          
          <View style={styles.quickInfo}>
            {dish.isVeg && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#4CAF50' }} compact>
                Veg
              </Chip>
            )}
            {dish.isPopular && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#FF9800' }} compact>
                Popular
              </Chip>
            )}
            {dish.isFastDelivery && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#2196F3' }} compact>
                Fast
              </Chip>
            )}
            {dish.price && (
              <Text style={styles.priceText}>₹{dish.price}</Text>
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
          <Button
            mode="outlined"
            onPress={clearAllFilters}
            style={styles.clearFiltersButton}
          >
            Clear Filters
          </Button>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.resultsContainer, { opacity: resultsAnim }]}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredResults.length} results found
          </Text>
          
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowSortMenu(true)}
                icon="sort"
                compact
              >
                {selectedSort?.name || 'Sort'}
              </Button>
            }
          >
            {sortOptions.map((option) => (
              <Menu.Item
                key={option.id}
                onPress={() => {
                  setSelectedSort(option);
                  setShowSortMenu(false);
                }}
                title={option.name}
                leadingIcon={option.icon}
              />
            ))}
          </Menu>
        </View>
        
        <FlatList
          data={filteredResults}
          renderItem={({ item }) => 
            item.type === 'dish' ? renderDishCard(item) : renderRestaurantCard(item)
          }
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      {renderSearchBar()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Filters */}
        {renderQuickFilters()}
        
        {/* Search Filters */}
        {renderSearchFilters()}
        
        {/* Search Suggestions (when no query) */}
        {renderSearchSuggestions()}
        
        {/* Search Results */}
        {renderSearchResults()}
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
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
  
  // Search Bar Styles
  searchBarContainer: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  searchInputText: {
    fontSize: 16,
    color: '#333',
  },
  
  // Search Suggestions Styles
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: 'white',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  // Quick Filters Styles
  quickFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  quickFilterChip: {
    marginRight: 12,
    borderColor: '#dee2e6',
    borderRadius: 20,
    height: 36,
  },
  activeQuickFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  
  // Search Filters Styles
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  filterChip: {
    marginRight: 12,
    borderColor: '#dee2e6',
    borderRadius: 18,
    height: 32,
  },
  
  // Search Suggestions Section Styles
  suggestionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  suggestionGroup: {
    marginBottom: 28,
  },
  suggestionGroupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionChip: {
    borderColor: '#dee2e6',
    borderRadius: 20,
    height: 36,
  },
  
  // Search Results Styles
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  
  // Result Card Styles
  resultCard: {
    marginBottom: 16,
  },
  resultSurface: {
    padding: 20,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f8f9fa',
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  resultInfo: {
    flex: 1,
    marginRight: 16,
  },
  resultName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
  },
  resultCuisine: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  resultDescription: {
    fontSize: 15,
    color: '#6c757d',
    lineHeight: 22,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  // Result Details Styles
  resultDetails: {
    gap: 16,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
  },
  statSubtext: {
    fontSize: 13,
    color: '#6c757d',
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 'auto',
  },
  distanceText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 'auto',
  },
  
  // Offers Styles
  offersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  offerChip: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#f8f9fa',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  clearFiltersButton: {
    borderColor: '#FF6B35',
    borderRadius: 20,
    paddingHorizontal: 24,
  },
}); 