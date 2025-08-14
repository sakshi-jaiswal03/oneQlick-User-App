import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Pressable, 
  Dimensions,
  Animated,
  TextInput as RNTextInput,
  Alert,
  Platform
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Chip, 
  Card, 
  Surface, 
  IconButton,
  Menu,
  Divider,
  ActivityIndicator
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const { width } = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  totalRatings: number;
  deliveryTime: string;
  minOrder: string;
  distance: string;
  image: string;
  isOpen: boolean;
  isVeg: boolean;
  priceRange: 'low' | 'medium' | 'high';
  offers: string[];
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantName: string;
  restaurantId: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  isVeg: boolean;
  isPopular: boolean;
  distance: string;
}

interface SearchFilter {
  id: string;
  name: string;
  count: number;
  isSelected: boolean;
  type: 'cuisine' | 'price' | 'rating' | 'delivery' | 'preset';
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  icon?: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<RNTextInput>(null);
  const recognitionRef = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<(Restaurant | Dish)[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['biryani', 'pizza', 'chinese']);
  const [trendingSearches] = useState<string[]>(['masala dosa', 'butter chicken', 'gulab jamun']);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  
  // Animation values
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const filtersAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      try {
        // Check if Web Speech API is available (works on web and some mobile browsers)
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          
          // Configure speech recognition
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
          
          // Set up event handlers
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
          };
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognized:', transcript);
            setSearchQuery(transcript);
            setShowSuggestions(false);
            setIsListening(false);
            
            // Show success message
            Alert.alert(
              'Voice Search Success!', 
              `Recognized: "${transcript}"\n\nSearching for results...`,
              [{ text: 'OK' }]
            );
            
            // Perform search with recognized text
            setTimeout(() => {
              performSearch();
            }, 100);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            let errorMessage = 'Failed to recognize speech. Please try again.';
            if (event.error === 'not-allowed') {
              errorMessage = 'Microphone access denied. Please allow microphone access.';
            } else if (event.error === 'no-speech') {
              errorMessage = 'No speech detected. Please speak clearly.';
            } else if (event.error === 'audio-capture') {
              errorMessage = 'Microphone not available. Please check your device.';
            }
            
            Alert.alert('Voice Search Error', errorMessage);
          };
          
          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };
          
          setIsVoiceSupported(true);
          console.log('Speech recognition initialized successfully');
        } else {
          console.log('Web Speech API not supported on this platform');
          setIsVoiceSupported(false);
          
          // For mobile devices, we can implement alternative voice search methods
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            console.log('Mobile platform detected - Web Speech API not available');
            // Note: For production mobile apps, you would need to:
            // 1. Use Expo Development Builds (EAS Build)
            // 2. Implement native voice recognition using libraries like react-native-voice
            // 3. Or use cloud-based speech-to-text services
          }
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsVoiceSupported(false);
      }
    };

    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, []);

  const [filters] = useState<SearchFilter[]>([
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
    
    // Preset filters
    { id: 'preset_veg_only', name: 'Veg Only', count: 145, isSelected: false, type: 'preset' },
    { id: 'preset_fast_delivery', name: 'Fast Delivery', count: 98, isSelected: false, type: 'preset' },
  ]);

  const [mockRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Spice Garden',
      cuisine: 'North Indian',
      rating: 4.5,
      totalRatings: 1247,
      deliveryTime: '25-35 min',
      minOrder: '₹150',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center',
      isOpen: true,
      isVeg: false,
      priceRange: 'medium',
      offers: ['20% OFF', 'Free Delivery'],
    },
    {
      id: '2',
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.3,
      totalRatings: 892,
      deliveryTime: '30-40 min',
      minOrder: '₹200',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
      isOpen: true,
      isVeg: true,
      priceRange: 'high',
      offers: ['Buy 1 Get 1'],
    },
    {
      id: '3',
      name: 'Biryani House',
      cuisine: 'Hyderabadi',
      rating: 4.7,
      totalRatings: 2156,
      deliveryTime: '20-30 min',
      minOrder: '₹180',
      distance: '0.5 km',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop&crop=center',
      isOpen: false,
      isVeg: false,
      priceRange: 'medium',
      offers: ['30% OFF'],
    },
  ]);

  const [mockDishes] = useState<Dish[]>([
    {
      id: 'dish_1',
      name: 'Butter Chicken',
      description: 'Rich and creamy butter chicken with naan',
      price: 280,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
      restaurantName: 'Spice Garden',
      restaurantId: '1',
      cuisine: 'North Indian',
      rating: 4.6,
      deliveryTime: '25-35 min',
      isVeg: false,
      isPopular: true,
      distance: '0.8 km',
    },
    {
      id: 'dish_2',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and mozzarella',
      price: 320,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center',
      restaurantName: 'Pizza Palace',
      restaurantId: '2',
      cuisine: 'Italian',
      rating: 4.4,
      deliveryTime: '30-40 min',
      isVeg: true,
      isPopular: true,
      distance: '1.2 km',
    },
    {
      id: 'dish_3',
      name: 'Hyderabadi Biryani',
      description: 'Aromatic biryani with tender meat',
      price: 350,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
      restaurantName: 'Biryani House',
      restaurantId: '3',
      cuisine: 'Hyderabadi',
      rating: 4.8,
      deliveryTime: '20-30 min',
      isVeg: false,
      isPopular: true,
      distance: '0.5 km',
    },
  ]);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(searchBarAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(filtersAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(resultsAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
      performSearch();
    } else {
      setShowSuggestions(false);
      setSearchResults([]);
    }
  }, [searchQuery, selectedFilters, sortBy]);

  const performSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Combine and filter results
    let results: (Restaurant | Dish)[] = [];
    
    // Add restaurants
    results.push(...mockRestaurants);
    
    // Add dishes
    results.push(...mockDishes);
    
    // Apply filters
    if (selectedFilters.length > 0) {
      results = results.filter(item => {
        return selectedFilters.some(filterId => {
          const filter = filters.find(f => f.id === filterId);
          if (!filter) return false;
          
          switch (filter.type) {
            case 'cuisine':
              return item.cuisine.toLowerCase().includes(filter.name.toLowerCase());
            case 'price':
              if (filter.name.includes('Under ₹200')) {
                return 'price' in item && item.price < 200;
              } else if (filter.name.includes('₹200-500')) {
                return 'price' in item && item.price >= 200 && item.price <= 500;
              } else if (filter.name.includes('Above ₹500')) {
                return 'price' in item && item.price > 500;
              }
              return false;
            case 'rating':
              if (filter.name.includes('4.0+')) {
                return item.rating >= 4.0;
              } else if (filter.name.includes('4.5+')) {
                return item.rating >= 4.5;
              }
              return false;
            case 'delivery':
              const deliveryTime = parseInt(item.deliveryTime.split('-')[0]);
              if (filter.name.includes('Under 30 mins')) {
                return deliveryTime < 30;
              } else if (filter.name.includes('30-60 mins')) {
                return deliveryTime >= 30 && deliveryTime <= 60;
              }
              return false;
            case 'preset':
              if (filter.name.includes('Veg Only')) {
                return item.isVeg;
              } else if (filter.name.includes('Fast Delivery')) {
                const deliveryTime = parseInt(item.deliveryTime.split('-')[0]);
                return deliveryTime <= 30;
              }
              return false;
            default:
              return false;
          }
        });
      });
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'delivery_time':
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        case 'price':
          if ('price' in a && 'price' in b) {
            return a.price - b.price;
          }
          return 0;
        case 'distance':
          const aDist = parseFloat(a.distance.replace(' km', ''));
          const bDist = parseFloat(b.distance.replace(' km', ''));
          return aDist - bDist;
        default:
          return 0;
      }
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchPress = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setShowSuggestions(false);
    
    // Add to recent searches
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
    }
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleVoiceSearch = async () => {
    try {
      if (!isVoiceSupported) {
        Alert.alert(
          'Voice Search Not Available', 
          'Voice search is not supported on this device. Please use text input instead.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (isListening) {
        // Stop listening
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        return;
      }

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        Alert.alert('Error', 'Speech recognition not initialized. Please try again.');
      }

    } catch (error) {
      console.error('Voice search error:', error);
      Alert.alert('Error', 'Failed to start voice search. Please try again.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedFilters([]);
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const renderSearchBar = () => (
    <Animated.View style={[styles.searchBarContainer, { opacity: searchBarAnim }]}>
      <Surface style={[styles.searchBar, isListening && styles.searchBarListening]}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          ref={searchInputRef}
          placeholder={isListening ? "Listening... Speak now" : "Search for restaurants, dishes, cuisines..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          mode="flat"
          underlineStyle={{ display: 'none' }}
          onFocus={() => setShowSuggestions(true)}
          editable={!isListening}
        />
        {searchQuery.length > 0 && !isListening && (
          <IconButton
            icon="close"
            size={20}
            onPress={clearSearch}
            iconColor="#666"
          />
        )}
        <IconButton
          icon={isListening ? "stop" : "mic"}
          size={20}
          onPress={handleVoiceSearch}
          iconColor={isListening ? "#F44336" : "#FF6B35"}
          style={[
            isListening ? { backgroundColor: '#FFEBEE' } : {},
            { borderRadius: 20 }
          ]}
        />
      </Surface>
      {isListening && (
        <Text style={styles.listeningText}>🎤 Listening... Speak now</Text>
      )}
      {!isListening && isVoiceSupported && (
        <Text style={styles.voiceHintText}>💡 Tap microphone for voice search</Text>
      )}
      {!isListening && !isVoiceSupported && (
        <View style={styles.voiceNotSupportedContainer}>
          <Text style={styles.voiceHintText}>
            💡 Voice search requires microphone access
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => {
              Alert.alert(
                'Enable Voice Search',
                'To use voice search:\n\n1. Use a web browser (Chrome, Safari)\n2. Allow microphone permissions\n3. Or use Expo Development Builds for native voice recognition',
                [{ text: 'OK' }]
              );
            }}
            style={styles.helpButton}
            compact
          >
            How to Enable
          </Button>
        </View>
      )}
    </Animated.View>
  );

  const renderSearchSuggestions = () => (
    <Animated.View style={[styles.suggestionsContainer, { opacity: searchBarAnim }]}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionSectionTitle}>Recent Searches</Text>
          <View style={styles.suggestionChips}>
            {recentSearches.map((search, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleSearchPress(search)}
                style={styles.suggestionChip}
                icon="history"
              >
                {search}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Trending Searches */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionSectionTitle}>Trending Now</Text>
        <View style={styles.suggestionChips}>
          {trendingSearches.map((search, index) => (
            <Chip
              key={index}
              mode="outlined"
              onPress={() => handleSearchPress(search)}
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

  const renderFilters = () => (
    <Animated.View style={[styles.filtersContainer, { opacity: filtersAnim }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map(filter => (
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

  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <Menu
        visible={showSortMenu}
        onDismiss={() => setShowSortMenu(false)}
        anchor={
          <Pressable onPress={() => setShowSortMenu(true)} style={styles.sortButton}>
            <Text style={styles.sortButtonText}>
              {sortBy === 'rating' ? 'Rating' : 
               sortBy === 'delivery_time' ? 'Delivery Time' :
               sortBy === 'price' ? 'Price' : 'Distance'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
          </Pressable>
        }
      >
        <Menu.Item onPress={() => { setSortBy('rating'); setShowSortMenu(false); }} title="Rating" />
        <Menu.Item onPress={() => { setSortBy('delivery_time'); setShowSortMenu(false); }} title="Delivery Time" />
        <Menu.Item onPress={() => { setSortBy('price'); setShowSortMenu(false); }} title="Price" />
        <Menu.Item onPress={() => { setSortBy('distance'); setShowSortMenu(false); }} title="Distance" />
      </Menu>
    </View>
  );

  const renderRestaurantCard = (restaurant: Restaurant) => (
    <Card
      key={restaurant.id}
      style={styles.resultCard}
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
    >
      <Card.Cover source={{ uri: restaurant.image }} style={styles.resultImage} />
      <Card.Content style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text variant="titleMedium" style={styles.resultName}>
            {restaurant.name}
          </Text>
          {!restaurant.isOpen && (
            <Chip mode="outlined" textStyle={{ color: '#d32f2f' }} compact>
              Closed
            </Chip>
          )}
        </View>
        
        <Text variant="bodyMedium" style={styles.resultCuisine}>
          {restaurant.cuisine} • {restaurant.priceRange === 'low' ? '₹' : restaurant.priceRange === 'medium' ? '₹₹' : '₹₹₹'}
        </Text>
        
        <View style={styles.resultDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.totalRatings}>({restaurant.totalRatings})</Text>
          </View>
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
          <Text style={styles.minOrder}>Min ₹{restaurant.minOrder}</Text>
        </View>
        
        {restaurant.offers.length > 0 && (
          <View style={styles.offersContainer}>
            {restaurant.offers.slice(0, 2).map((offer, index) => (
              <Chip key={index} mode="outlined" compact style={styles.offerChip}>
                {offer}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderDishCard = (dish: Dish) => (
    <Card
      key={dish.id}
      style={styles.resultCard}
      onPress={() => router.push(`/food-item/${dish.id}`)}
    >
      <Card.Cover source={{ uri: dish.image }} style={styles.resultImage} />
      <Card.Content style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text variant="titleMedium" style={styles.resultName}>
            {dish.name}
          </Text>
          {dish.isPopular && (
            <Chip mode="outlined" textStyle={{ color: '#FF6B35' }} compact>
              Popular
            </Chip>
          )}
        </View>
        
        <Text variant="bodyMedium" style={styles.resultDescription} numberOfLines={2}>
          {dish.description}
        </Text>
        
        <Text variant="bodyMedium" style={styles.resultCuisine}>
          {dish.cuisine} • {dish.restaurantName}
        </Text>
        
        <View style={styles.resultDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{dish.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{dish.deliveryTime}</Text>
          <Text style={styles.price}>₹{dish.price}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSearchResults = () => (
    <Animated.View style={[styles.resultsContainer, { opacity: resultsAnim }]}>
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {searchResults.length} results found
            </Text>
            {renderSortOptions()}
          </View>
          
          <FlatList
            data={searchResults}
            renderItem={({ item }) => 
              'restaurantName' in item ? renderDishCard(item) : renderRestaurantCard(item)
            }
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : searchQuery.trim() ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No results found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filters
          </Text>
          <Button mode="outlined" onPress={clearSearch} style={styles.tryAgainButton}>
            Try Again
          </Button>
        </View>
      ) : null}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <IconButton
          icon="tune"
          size={24}
          onPress={() => {/* TODO: Advanced filters modal */}}
        />
      </View>

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Search Suggestions */}
      {showSuggestions && !searchQuery.trim() && renderSearchSuggestions()}

      {/* Filters */}
      {renderFilters()}

      {/* Search Results */}
      {renderSearchResults()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBarListening: {
    borderColor: '#FF6B35',
    borderWidth: 2,
    backgroundColor: '#FFF8F6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  suggestionSection: {
    marginBottom: 20,
  },
  suggestionSectionTitle: {
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
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  tryAgainButton: {
    borderColor: '#FF6B35',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: {
    height: 160,
  },
  resultContent: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultName: {
    flex: 1,
    marginRight: 8,
    fontWeight: '600',
  },
  resultDescription: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  resultCuisine: {
    color: '#666',
    marginBottom: 12,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  totalRatings: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  minOrder: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  offersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  offerChip: {
    borderColor: '#4CAF50',
  },
  listeningText: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  voiceHintText: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  voiceNotSupportedContainer: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  helpButton: {
    marginLeft: 10,
    borderColor: '#FF6B35',
  },
}); 