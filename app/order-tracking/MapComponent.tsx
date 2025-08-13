import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface MapComponentProps {
  restaurant: {
    latitude: number;
    longitude: number;
    name: string;
  };
  deliveryAddress: {
    latitude: number;
    longitude: number;
    name: string;
  };
  deliveryPartner?: {
    currentLocation: {
      latitude: number;
      longitude: number;
      lastUpdated: string;
    };
    name: string;
  };
  routeCoordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  showMap: boolean;
}

export default function MapComponent({
  restaurant,
  deliveryAddress,
  deliveryPartner,
  routeCoordinates,
  showMap,
}: MapComponentProps) {
  const [currentZoom, setCurrentZoom] = useState(15);
  const [centerLocation, setCenterLocation] = useState({
    latitude: (restaurant.latitude + deliveryAddress.latitude) / 2,
    longitude: (restaurant.longitude + deliveryAddress.longitude) / 2,
  });

  // Animation values for markers
  const restaurantMarkerAnim = new Animated.Value(0);
  const deliveryMarkerAnim = new Animated.Value(0);
  const partnerMarkerAnim = new Animated.Value(0);

  useEffect(() => {
    if (showMap) {
      // Animate markers appearing
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.spring(restaurantMarkerAnim, { toValue: 1, useNativeDriver: true }),
          Animated.spring(deliveryMarkerAnim, { toValue: 1, useNativeDriver: true }),
        ]),
        Animated.delay(300),
        Animated.spring(partnerMarkerAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [showMap]);

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 10));
  };

  const centerOnUser = () => {
    setCenterLocation({
      latitude: deliveryAddress.latitude,
      longitude: deliveryAddress.longitude,
    });
  };

  const centerOnRestaurant = () => {
    setCenterLocation({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    });
  };

  if (!showMap) {
    return (
      <View style={styles.mapHidden}>
        <Text style={styles.mapHiddenText}>Map hidden to save battery</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      {/* Map Background */}
      <View style={styles.mapBackground}>
        {/* Route Line */}
        <View style={styles.routeLine} />
        
        {/* Restaurant Marker */}
        <Animated.View
          style={[
            styles.marker,
            styles.restaurantMarker,
            {
              transform: [
                { scale: restaurantMarkerAnim },
                { translateX: (restaurant.longitude - centerLocation.longitude) * 10000 },
                { translateY: (restaurant.latitude - centerLocation.latitude) * 10000 },
              ],
            },
          ]}
        >
          <MaterialIcons name="restaurant" size={24} color="white" />
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>{restaurant.name}</Text>
          </View>
        </Animated.View>

        {/* Delivery Address Marker */}
        <Animated.View
          style={[
            styles.marker,
            styles.deliveryMarker,
            {
              transform: [
                { scale: deliveryMarkerAnim },
                { translateX: (deliveryAddress.longitude - centerLocation.longitude) * 10000 },
                { translateY: (deliveryAddress.latitude - centerLocation.latitude) * 10000 },
              ],
            },
          ]}
        >
          <MaterialIcons name="home" size={24} color="white" />
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>{deliveryAddress.name}</Text>
          </View>
        </Animated.View>

        {/* Delivery Partner Marker */}
        {deliveryPartner && (
          <Animated.View
            style={[
              styles.marker,
              styles.partnerMarker,
              {
                transform: [
                  { scale: partnerMarkerAnim },
                  { translateX: (deliveryPartner.currentLocation.longitude - centerLocation.longitude) * 10000 },
                  { translateY: (deliveryPartner.currentLocation.latitude - centerLocation.latitude) * 10000 },
                ],
              },
            ]}
          >
            <MaterialIcons name="delivery-dining" size={24} color="white" />
            <View style={styles.markerLabel}>
              <Text style={styles.markerText}>{deliveryPartner.name}</Text>
              <Text style={styles.markerSubtext}>Live</Text>
            </View>
          </Animated.View>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <Pressable style={styles.controlButton} onPress={handleZoomIn}>
            <MaterialIcons name="add" size={20} color="#333" />
          </Pressable>
          <Pressable style={styles.controlButton} onPress={handleZoomOut}>
            <MaterialIcons name="remove" size={20} color="#333" />
          </Pressable>
          <Pressable style={styles.controlButton} onPress={centerOnUser}>
            <MaterialIcons name="my-location" size={20} color="#333" />
          </Pressable>
          <Pressable style={styles.controlButton} onPress={centerOnRestaurant}>
            <MaterialIcons name="restaurant" size={20} color="#333" />
          </Pressable>
        </View>

        {/* Zoom Level Indicator */}
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>{currentZoom}x</Text>
        </View>

        {/* Location Accuracy */}
        {deliveryPartner && (
          <View style={styles.accuracyIndicator}>
            <MaterialIcons name="gps-fixed" size={16} color="#4CAF50" />
            <Text style={styles.accuracyText}>Live tracking</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    opacity: 0.6,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  restaurantMarker: {
    top: '30%',
    left: '25%',
  },
  deliveryMarker: {
    top: '70%',
    right: '25%',
  },
  partnerMarker: {
    top: '50%',
    left: '40%',
  },
  markerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  markerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  markerSubtext: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoomText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  accuracyIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  mapHidden: {
    padding: 40,
    alignItems: 'center',
  },
  mapHiddenText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 