import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
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
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

interface QuickFilter {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export default function SearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [quickFilters, setQuickFilters] = useState<QuickFilter[]>([
    { id: 'veg', name: 'Veg Only', icon: 'leaf', active: false },
    { id: 'fast', name: 'Fast Delivery', icon: 'clock-fast', active: false },
    { id: 'popular', name: 'Popular', icon: 'fire', active: false },
    { id: 'offers', name: 'Offers', icon: 'tag', active: false },
  ]);
  const [recentSearches] = useState<string[]>(['biryani', 'pizza', 'chinese', 'burger']);
  const [trendingSearches] = useState<string[]>(['masala dosa', 'butter chicken', 'gulab jamun', 'pasta']);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sample data
  const sampleSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'restaurant',
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with traditional flavors',
      rating: 4.5,
      reviewCount: 120,
      deliveryTime: '25-35 min',
      deliveryFee: 40,
      minOrder: 200,
      cuisine: 'Indian',
      isVeg: false,
      isPopular: true,
      isFastDelivery: true,
      distance: '1.2 km',
      offers: ['20% OFF', 'Free Delivery'],
    },
    {
      id: '2',
      type: 'dish',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella and basil',
      rating: 4.3,
      reviewCount: 85,
      deliveryTime: '20-30 min',
      deliveryFee: 30,
      minOrder: 150,
      price: 299,
      restaurantName: 'Pizza Palace',
      restaurantId: 'rest-2',
      cuisine: 'Italian',
      isVeg: true,
      isPopular: true,
      isFastDelivery: true,
    },
    {
      id: '3',
      type: 'restaurant',
      name: 'Dragon Wok',
      description: 'Delicious Chinese food with authentic taste',
      rating: 4.2,
      reviewCount: 200,
      deliveryTime: '30-40 min',
      deliveryFee: 35,
      minOrder: 180,
      cuisine: 'Chinese',
      isVeg: false,
      isPopular: false,
      isFastDelivery: false,
      distance: '2.1 km',
      offers: ['Buy 1 Get 1'],
    },
    {
      id: '4',
      type: 'dish',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken',
      rating: 4.6,
      reviewCount: 150,
      deliveryTime: '35-45 min',
      deliveryFee: 25,
      minOrder: 200,
      price: 249,
      restaurantName: 'Biryani House',
      restaurantId: 'rest-3',
      cuisine: 'Indian',
      isVeg: false,
      isPopular: true,
      isFastDelivery: false,
    },
  ];

  useEffect(() => {
    // Start animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const filtered = sampleSearchResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.cuisine?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    setIsSearching(false);
    }, 500);
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setQuickFilters(prev =>
      prev.map(filter =>
        filter.id === filterId
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setQuickFilters(prev => prev.map(f => ({ ...f, active: false })));
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(suggestion)) {
      // In a real app, this would update persistent storage
    }
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'restaurant') {
      router.push(`/restaurant/${result.id}`);
      } else {
      router.push(`/food-item/${result.id}`);
    }
  };

  // Apply filters to results
  const getFilteredResults = () => {
    let filtered = [...searchResults];
    
    quickFilters.forEach(filter => {
      if (filter.active) {
        switch (filter.id) {
          case 'veg':
            filtered = filtered.filter(item => item.isVeg);
            break;
          case 'fast':
            filtered = filtered.filter(item => item.isFastDelivery);
            break;
          case 'popular':
            filtered = filtered.filter(item => item.isPopular);
            break;
          case 'offers':
            filtered = filtered.filter(item => item.offers && item.offers.length > 0);
            break;
        }
      }
    });
    
    return filtered;
  };

  // Render functions
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Surface style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search for restaurants, dishes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch}>
            <MaterialCommunityIcons name="close" size={20} color="#666" />
          </Pressable>
        )}
      </Surface>
    </View>
  );

  const renderQuickFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            selected={filter.active}
            onPress={() => handleQuickFilterToggle(filter.id)}
            style={[styles.filterChip, filter.active && styles.activeFilterChip]}
            textStyle={filter.active ? { color: 'white' } : {}}
            icon={filter.icon}
          >
            {filter.name}
          </Chip>
        ))}
      </ScrollView>
        </View>
  );

  const renderSuggestions = () => {
    if (searchQuery.length > 0) return null;
    
    return (
      <View style={styles.suggestionsContainer}>
      {/* Recent Searches */}
        <View style={styles.suggestionSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.suggestionsList}>
            {recentSearches.map((search, index) => (
              <Pressable
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(search)}
              >
                <MaterialCommunityIcons name="history" size={16} color="#666" />
                <Text style={styles.suggestionText}>{search}</Text>
              </Pressable>
            ))}
          </View>
        </View>

      {/* Trending Searches */}
      <View style={styles.suggestionSection}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <View style={styles.suggestionsList}>
          {trendingSearches.map((search, index) => (
              <Pressable
              key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(search)}
              >
                <MaterialCommunityIcons name="trending-up" size={16} color="#FF6B35" />
                <Text style={styles.suggestionText}>{search}</Text>
              </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
  };

  const renderResultCard = (item: SearchResult) => (
    <Pressable
      key={item.id}
      style={styles.resultCard}
      onPress={() => handleResultPress(item)}
    >
      <Surface style={styles.cardSurface}>
        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.type === 'dish' && item.restaurantName && (
                <Text style={styles.restaurantName}>from {item.restaurantName}</Text>
              )}
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.cardImage}>
              <MaterialCommunityIcons 
                name={item.type === 'restaurant' ? 'storefront' : 'food'} 
                size={40} 
                color="#ccc" 
              />
            </View>
        </View>
        
          {/* Stats */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{item.rating}</Text>
              <Text style={styles.statSubtext}>({item.reviewCount})</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock" size={14} color="#666" />
              <Text style={styles.statText}>{item.deliveryTime}</Text>
          </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="truck-delivery" size={14} color="#666" />
              <Text style={styles.statText}>₹{item.deliveryFee}</Text>
        </View>
        
            {item.type === 'dish' && item.price && (
              <Text style={styles.priceText}>₹{item.price}</Text>
            )}
          </View>

          {/* Tags */}
          <View style={styles.cardTags}>
            {item.isVeg && (
              <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={{ backgroundColor: '#4CAF50', height: 24 }} compact>
                VEG
              </Chip>
            )}
            {item.isPopular && (
              <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={{ backgroundColor: '#FF9800', height: 24 }} compact>
                POPULAR
              </Chip>
            )}
            {item.isFastDelivery && (
              <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={{ backgroundColor: '#2196F3', height: 24 }} compact>
                FAST
              </Chip>
            )}
          </View>

          {/* Offers */}
          {item.offers && item.offers.length > 0 && (
          <View style={styles.offersContainer}>
              {item.offers.map((offer, index) => (
              <Chip key={index} mode="outlined" compact style={styles.offerChip}>
                {offer}
              </Chip>
            ))}
          </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );

  const renderResults = () => {
    if (searchQuery.length === 0) return null;

    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    const filteredResults = getFilteredResults();

    if (filteredResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify-close" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
          <Button
            mode="outlined"
            onPress={clearSearch}
            style={styles.clearButton}
          >
            Clear Search
          </Button>
        </View>
  );
    }

  return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
        </Text>
        {filteredResults.map(renderResultCard)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      {renderSearchBar()}
        {renderQuickFilters()}
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderSuggestions()}
          {renderResults()}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: 'transparent',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  scrollContainer: {
    flex: 1,
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    gap: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#495057',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  clearButton: {
    borderColor: '#FF6B35',
    borderRadius: 20,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
  },
  cardSurface: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  statSubtext: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 'auto',
  },
  cardTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  offersContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  offerChip: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
    height: 24,
  },
}); 