import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Pressable,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
  Divider,
  Searchbar,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  searchFilters,
  sortOptions,
  recentSearches,
  trendingSearches,
  sampleSearchResults,
  quickFilterPresets,
  getSearchSuggestions,
  SearchResult,
  SearchFilter,
  SearchSuggestion,
} from './searchData';

const { width, height } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [quickFilters, setQuickFilters] = useState(quickFilterPresets);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation values
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const filtersAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Load initial data
    setSearchResults(sampleSearchResults);
    setFilteredResults(sampleSearchResults);
  }, []);

  useEffect(() => {
    // Update suggestions as user types
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
    // Apply filters and sorting
    applyFiltersAndSort();
  }, [activeFilters, quickFilters, selectedSort, searchResults]);

  const startAnimations = () => {
    // Search bar slide down animation
    Animated.timing(searchBarAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    
    // Filters fade in animation
    Animated.timing(filtersAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    
    // Results slide up animation
    Animated.timing(resultsAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  };

  const applyFiltersAndSort = () => {
    let filtered = [...searchResults];
    
    // Apply active filters
    activeFilters.forEach(filter => {
      switch (filter.type) {
        case 'cuisine':
          filtered = filtered.filter(item => 
            item.cuisine?.toLowerCase() === filter.value.toString().toLowerCase()
          );
          break;
        case 'price':
          if (filter.value === 200) {
            filtered = filtered.filter(item => (item.price || 0) <= 200);
          } else if (filter.value === 500) {
            filtered = filtered.filter(item => (item.price || 0) > 200 && (item.price || 0) <= 500);
          } else if (filter.value === 1000) {
            filtered = filtered.filter(item => (item.price || 0) > 500);
          }
          break;
        case 'rating':
          filtered = filtered.filter(item => item.rating >= (filter.value as number));
          break;
        case 'delivery':
          const maxTime = filter.value as number;
          filtered = filtered.filter(item => {
            const time = parseInt(item.deliveryTime.split('-')[0]);
            return time <= maxTime;
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
      default:
        // Relevance - keep original order
        break;
    }
    
    setFilteredResults(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        const results = sampleSearchResults.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.cuisine?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults(sampleSearchResults);
      setFilteredResults(sampleSearchResults);
    }
  };

  const handleFilterToggle = (filter: SearchFilter) => {
    setActiveFilters(prev => {
      const isActive = prev.some(f => f.id === filter.id);
      if (isActive) {
        return prev.filter(f => f.id !== filter.id);
      } else {
        return [...prev, filter];
      }
    });
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
    handleSearch(suggestion.text);
    setShowSuggestions(false);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'restaurant') {
      router.push(`/restaurant/${result.id}`);
    } else {
      router.push(`/food-item/${result.id}`);
    }
  };

  const handleVoiceSearch = () => {
    Alert.alert(
      'Voice Search',
      'Voice search feature coming soon! For now, please type your search.',
      [{ text: 'OK' }]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setQuickFilters(quickFilterPresets.map(f => ({ ...f, active: false })));
    setSelectedSort(sortOptions[0]);
  };

  const renderSearchBar = () => (
    <Animated.View style={[styles.searchBarContainer, { transform: [{ translateY: searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] }]}>
      <Surface style={styles.searchBar}>
        <Searchbar
          placeholder="Search for restaurants, dishes, cuisines..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchInput}
          icon="magnify"
          onIconPress={handleVoiceSearch}
          iconColor="#666"
          inputStyle={styles.searchInputText}
        />
        
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor="#666"
            onPress={() => {
              setSearchQuery('');
              setSearchResults(sampleSearchResults);
              setFilteredResults(sampleSearchResults);
            }}
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
      
      {/* Cuisine Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Cuisine</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {searchFilters.cuisines.map((filter) => (
            <Chip
              key={filter.id}
              mode={activeFilters.some(f => f.id === filter.id) ? 'flat' : 'outlined'}
              selected={activeFilters.some(f => f.id === filter.id)}
              onPress={() => handleFilterToggle(filter)}
              style={styles.filterChip}
              textStyle={activeFilters.some(f => f.id === filter.id) ? { color: 'white' } : {}}
            >
              {filter.name} ({filter.count})
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      {/* Price Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Price Range</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {searchFilters.priceRanges.map((filter) => (
            <Chip
              key={filter.id}
              mode={activeFilters.some(f => f.id === filter.id) ? 'flat' : 'outlined'}
              selected={activeFilters.some(f => f.id === filter.id)}
              onPress={() => handleFilterToggle(filter)}
              style={styles.filterChip}
              textStyle={activeFilters.some(f => f.id === filter.id) ? { color: 'white' } : {}}
            >
              {filter.name} ({filter.count})
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      {/* Rating & Delivery Filters */}
      <View style={styles.filterRow}>
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Rating</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchFilters.ratings.map((filter) => (
              <Chip
                key={filter.id}
                mode={activeFilters.some(f => f.id === filter.id) ? 'flat' : 'outlined'}
                selected={activeFilters.some(f => f.id === filter.id)}
                onPress={() => handleFilterToggle(filter)}
                style={styles.filterChip}
                textStyle={activeFilters.some(f => f.id === filter.id) ? { color: 'white' } : {}}
              >
                {filter.name} ({filter.count})
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Delivery Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchFilters.deliveryTimes.map((filter) => (
              <Chip
                key={filter.id}
                mode={activeFilters.some(f => f.id === filter.id) ? 'flat' : 'outlined'}
                selected={activeFilters.some(f => f.id === filter.id)}
                onPress={() => handleFilterToggle(filter)}
                style={styles.filterChip}
                textStyle={activeFilters.some(f => f.id === filter.id) ? { color: 'white' } : {}}
              >
                {filter.name} ({filter.count})
              </Chip>
            ))}
          </ScrollView>
        </View>
      </View>
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
            {recentSearches.map((search) => (
              <Chip
                key={search.id}
                mode="outlined"
                onPress={() => handleSuggestionPress(search)}
                style={styles.suggestionChip}
                icon="history"
              >
                {search.text}
              </Chip>
            ))}
          </View>
        </View>
        
        {/* Trending Searches */}
        <View style={styles.suggestionGroup}>
          <Text style={styles.suggestionGroupTitle}>Trending Now</Text>
          <View style={styles.suggestionChips}>
            {trendingSearches.map((search) => (
              <Chip
                key={search.id}
                mode="outlined"
                onPress={() => handleSuggestionPress(search)}
                style={styles.suggestionChip}
                icon="trending-up"
              >
                {search.text}
              </Chip>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <Pressable
      style={styles.resultCard}
      onPress={() => handleResultPress(item)}
    >
      <Surface style={styles.resultSurface}>
        {/* Result Header */}
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{item.name}</Text>
            {item.type === 'dish' && (
              <Text style={styles.restaurantName}>{item.restaurantName}</Text>
            )}
            <Text style={styles.resultDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.resultImage}>
            <MaterialIcons name="restaurant" size={40} color="#ccc" />
          </View>
        </View>
        
        {/* Result Details */}
        <View style={styles.resultDetails}>
          <View style={styles.resultStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{item.rating}</Text>
              <Text style={styles.statSubtext}>({item.reviewCount})</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.statText}>{item.deliveryTime}</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="delivery-dining" size={16} color="#666" />
              <Text style={styles.statText}>₹{item.deliveryFee}</Text>
            </View>
          </View>
          
          {/* Quick Info */}
          <View style={styles.quickInfo}>
            {item.isVeg && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#4CAF50' }} compact>
                Veg
              </Chip>
            )}
            {item.isPopular && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#FF9800' }} compact>
                Popular
              </Chip>
            )}
            {item.isFastDelivery && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#2196F3' }} compact>
                Fast
              </Chip>
            )}
            {item.price && (
              <Text style={styles.priceText}>₹{item.price}</Text>
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
                {selectedSort.name}
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
          renderItem={renderSearchResult}
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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  
  // Search Bar Styles
  searchBarContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  searchInputText: {
    fontSize: 16,
  },
  
  // Search Suggestions Styles
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  
  // Quick Filters Styles
  quickFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickFilterChip: {
    marginRight: 8,
    borderColor: '#ddd',
  },
  activeQuickFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  
  // Search Filters Styles
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 20,
  },
  filterChip: {
    marginRight: 8,
    borderColor: '#ddd',
  },
  
  // Search Suggestions Section Styles
  suggestionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  suggestionGroup: {
    marginBottom: 24,
  },
  suggestionGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderColor: '#ddd',
  },
  
  // Search Results Styles
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Result Card Styles
  resultCard: {
    marginBottom: 16,
  },
  resultSurface: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultInfo: {
    flex: 1,
    marginRight: 16,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Result Details Styles
  resultDetails: {
    gap: 12,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statSubtext: {
    fontSize: 12,
    color: '#999',
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 'auto',
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    borderColor: '#FF6B35',
  },
}); 