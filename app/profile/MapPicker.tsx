import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Searchbar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
  MapLocation,
  AddressSuggestion,
  searchAddresses,
  reverseGeocode,
} from './addressFormData';

const { width, height } = Dimensions.get('window');

interface MapPickerProps {
  onLocationSelect: (location: MapLocation) => void;
  initialLocation?: MapLocation;
  onClose: () => void;
}

export default function MapPicker({ onLocationSelect, initialLocation, onClose }: MapPickerProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapLocation>(
    initialLocation || {
      latitude: 29.9457,
      longitude: 78.1642,
      address: 'Rajpur Village, Near Temple',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      area: 'Rajpur',
    }
  );
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const mapAnim = useRef(new Animated.Value(0)).current;
  const markerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Map fade in animation
    Animated.timing(mapAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    // Marker bounce animation
    Animated.sequence([
      Animated.delay(400),
      Animated.spring(markerAnim, { 
        toValue: 1, 
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
    
    // Search bar slide down animation
    Animated.timing(searchAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAddresses(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    
    const newLocation: MapLocation = {
      latitude: suggestion.coordinates.latitude,
      longitude: suggestion.coordinates.longitude,
      address: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
      pincode: suggestion.pincode,
      area: suggestion.city, // Using city as area for now
    };
    
    setCurrentLocation(newLocation);
    setSelectedLocation(newLocation);
  };

  const handleMapTap = async (event: any) => {
    // Simulate map tap coordinates
    const newLat = currentLocation.latitude + (Math.random() - 0.5) * 0.01;
    const newLng = currentLocation.longitude + (Math.random() - 0.5) * 0.01;
    
    setIsLoading(true);
    try {
      const location = await reverseGeocode(newLat, newLng);
      setSelectedLocation(location);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates only
      setSelectedLocation({
        latitude: newLat,
        longitude: newLng,
        address: 'Selected Location',
        city: currentLocation.city,
        state: currentLocation.state,
        pincode: currentLocation.pincode,
        area: currentLocation.area,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'Current Location',
      'Use your current GPS location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Location', 
          onPress: () => {
            setSelectedLocation(currentLocation);
            Alert.alert('Success', 'Current location selected!');
          }
        },
      ]
    );
  };

  const handleConfirmLocation = () => {
    onLocationSelect(selectedLocation);
    onClose();
  };

  const renderMapBackground = () => (
    <Animated.View 
      style={[
        styles.mapBackground,
        {
          opacity: mapAnim,
        },
      ]}
    >
      {/* Simulated map background */}
      <View style={styles.mapContainer}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} style={styles.gridLine} />
          ))}
        </View>
        
        {/* Map controls */}
        <View style={styles.mapControls}>
          <IconButton
            icon="add"
            size={24}
            iconColor="#333"
            style={styles.mapControl}
            onPress={() => Alert.alert('Zoom In', 'Map zoom feature coming soon!')}
          />
          <IconButton
            icon="remove"
            size={24}
            iconColor="#333"
            style={styles.mapControl}
            onPress={() => Alert.alert('Zoom Out', 'Map zoom feature coming soon!')}
          />
          <IconButton
            icon="my-location"
            size={24}
            iconColor="#333"
            style={styles.mapControl}
            onPress={handleUseCurrentLocation}
          />
        </View>
        
        {/* Location marker */}
        <Animated.View
          style={[
            styles.locationMarker,
            {
              transform: [{
                scale: markerAnim,
              }],
            },
          ]}
        >
          <MaterialIcons name="location-on" size={32} color="#FF6B35" />
          <View style={styles.markerPulse} />
        </Animated.View>
        
        {/* Tap instruction */}
        <View style={styles.tapInstruction}>
          <Text style={styles.tapInstructionText}>Tap anywhere to select location</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderSearchBar = () => (
    <Animated.View 
      style={[
        styles.searchContainer,
        {
          transform: [{
            translateY: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        },
      ]}
    >
      <Searchbar
        placeholder="Search for address, landmark, or area..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
        onIconPress={() => setShowSuggestions(!showSuggestions)}
        iconColor="#666"
      />
      
      {/* Search suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Surface style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(suggestion)}
            >
              <MaterialIcons name="location-on" size={20} color="#666" />
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionName}>{suggestion.name}</Text>
                <Text style={styles.suggestionAddress}>{suggestion.address}</Text>
                {suggestion.distance && (
                  <Text style={styles.suggestionDistance}>{suggestion.distance} km away</Text>
                )}
              </View>
              <MaterialIcons name="arrow-upward" size={16} color="#999" />
            </Pressable>
          ))}
        </Surface>
      )}
    </Animated.View>
  );

  const renderLocationInfo = () => (
    <Surface style={styles.locationInfo}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationTitle}>Selected Location</Text>
        <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.locationChip}>
          {selectedLocation.city}, {selectedLocation.state}
        </Chip>
      </View>
      
      <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
      <Text style={styles.locationDetails}>
        {selectedLocation.area}, {selectedLocation.city} - {selectedLocation.pincode}
      </Text>
      
      <View style={styles.coordinatesInfo}>
        <Text style={styles.coordinatesText}>
          Lat: {selectedLocation.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Lng: {selectedLocation.longitude.toFixed(6)}
        </Text>
      </View>
    </Surface>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={onClose}
        icon="close"
        style={styles.actionButton}
      >
        Cancel
      </Button>
      
      <Button
        mode="contained"
        onPress={handleConfirmLocation}
        icon="check"
        style={styles.actionButton}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Confirm Location'}
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          iconColor="#333"
          onPress={onClose}
        />
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={{ width: 48 }} />
      </View>
      
      {/* Search Bar */}
      {renderSearchBar()}
      
      {/* Map */}
      <View style={styles.mapSection}>
        <Pressable style={styles.mapPressable} onPress={handleMapTap}>
          {renderMapBackground()}
        </Pressable>
      </View>
      
      {/* Location Info */}
      {renderLocationInfo()}
      
      {/* Action Buttons */}
      {renderActionButtons()}
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Getting address details...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Search Styles
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 4,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  suggestionDistance: {
    fontSize: 12,
    color: '#999',
  },
  
  // Map Styles
  mapSection: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  mapPressable: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#e8f4fd',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridLine: {
    width: '5%',
    height: '5%',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    elevation: 4,
  },
  mapControl: {
    margin: 4,
  },
  locationMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -32,
    alignItems: 'center',
  },
  markerPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
    transform: [{ scale: 1.5 }],
  },
  tapInstruction: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tapInstructionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Location Info Styles
  locationInfo: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  locationChip: {
    backgroundColor: '#FF6B35',
  },
  locationAddress: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  locationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  coordinatesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  
  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  
  // Loading Overlay Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
}); 