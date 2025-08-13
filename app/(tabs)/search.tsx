import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, TextInput, Button, Chip, Card, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: string;
  image: string;
  isOpen: boolean;
}

interface Filter {
  id: string;
  name: string;
  isSelected: boolean;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Mock data - replace with actual API call
    setRestaurants([
      {
        id: '1',
        name: 'Spice Garden',
        cuisine: 'North Indian',
        rating: 4.5,
        deliveryTime: '25-35 min',
        minOrder: '₹150',
        image: 'https://via.placeholder.com/300x200',
        isOpen: true,
      },
      {
        id: '2',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.3,
        deliveryTime: '30-40 min',
        minOrder: '₹200',
        image: 'https://via.placeholder.com/300x200',
        isOpen: true,
      },
      {
        id: '3',
        name: 'Biryani House',
        cuisine: 'Hyderabadi',
        rating: 4.7,
        deliveryTime: '20-30 min',
        minOrder: '₹180',
        image: 'https://via.placeholder.com/300x200',
        isOpen: false,
      },
      {
        id: '4',
        name: 'Chinese Wok',
        cuisine: 'Chinese',
        rating: 4.2,
        deliveryTime: '35-45 min',
        minOrder: '₹250',
        image: 'https://via.placeholder.com/300x200',
        isOpen: true,
      },
      {
        id: '5',
        name: 'South Indian Delight',
        cuisine: 'South Indian',
        rating: 4.6,
        deliveryTime: '15-25 min',
        minOrder: '₹120',
        image: 'https://via.placeholder.com/300x200',
        isOpen: true,
      },
    ]);

    setFilters([
      { id: '1', name: 'Open Now', isSelected: false },
      { id: '2', name: 'Free Delivery', isSelected: false },
      { id: '3', name: 'High Rating', isSelected: false },
      { id: '4', name: 'Fast Delivery', isSelected: false },
      { id: '5', name: 'Budget Friendly', isSelected: false },
    ]);
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedFilters, restaurants]);

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (selectedFilters.includes('1')) { // Open Now
      filtered = filtered.filter(restaurant => restaurant.isOpen);
    }
    if (selectedFilters.includes('3')) { // High Rating
      filtered = filtered.filter(restaurant => restaurant.rating >= 4.5);
    }
    if (selectedFilters.includes('4')) { // Fast Delivery
      filtered = filtered.filter(restaurant => 
        parseInt(restaurant.deliveryTime.split('-')[0]) <= 25
      );
    }
    if (selectedFilters.includes('5')) { // Budget Friendly
      filtered = filtered.filter(restaurant => 
        parseInt(restaurant.minOrder.replace('₹', '')) <= 200
      );
    }

    setFilteredRestaurants(filtered);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <Card
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Card.Cover source={{ uri: item.image }} style={styles.restaurantImage} />
      <Card.Content style={styles.restaurantContent}>
        <View style={styles.restaurantHeader}>
          <Text variant="titleMedium" style={styles.restaurantName}>
            {item.name}
          </Text>
          {!item.isOpen && (
            <Chip mode="outlined" textStyle={{ color: '#d32f2f' }}>
              Closed
            </Chip>
          )}
        </View>
        <Text variant="bodyMedium" style={styles.restaurantCuisine}>
          {item.cuisine}
        </Text>
        <View style={styles.restaurantDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.minOrder}>Min ₹{item.minOrder}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Button
          mode="outlined"
          onPress={() => router.push('/(tabs)/search')}
          icon="tune"
        >
          Filters
        </Button>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Search for restaurants and food..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          mode="flat"
          underlineStyle={{ display: 'none' }}
        />
        {searchQuery.length > 0 && (
          <Button
            mode="text"
            onPress={() => setSearchQuery('')}
            icon="close"
          >
            Clear
          </Button>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map(filter => (
          <Chip
            key={filter.id}
            mode={selectedFilters.includes(filter.id) ? 'flat' : 'outlined'}
            selected={selectedFilters.includes(filter.id)}
            onPress={() => toggleFilter(filter.id)}
            style={styles.filterChip}
            textStyle={selectedFilters.includes(filter.id) ? { color: 'white' } : {}}
          >
            {filter.name}
          </Chip>
        ))}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRestaurants.length} restaurants found
        </Text>
        
        {filteredRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No restaurants found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  restaurantCard: {
    marginBottom: 16,
    elevation: 2,
  },
  restaurantImage: {
    height: 150,
  },
  restaurantContent: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  restaurantCuisine: {
    color: '#666',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  deliveryTime: {
    color: '#666',
    fontSize: 12,
  },
  minOrder: {
    color: '#666',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
}); 