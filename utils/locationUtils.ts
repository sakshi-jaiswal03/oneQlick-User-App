import * as Location from 'expo-location';

export interface LocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string | null;
    name: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    postalCode: string | null;
  };
  displayName: string;
}

export interface AddressFormData {
  city: string;
  state: string;
  area: string;
  street?: string;
  pincode?: string;
}

/**
 * Get current location with high accuracy and detailed address information
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position with high accuracy for better address resolution
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 5,
    });

    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    // Get address from coordinates with detailed information
    const addressResponse = await Location.reverseGeocodeAsync(coords);
    let displayName = '';
    let addressData: LocationData['address'] = {
      street: null,
      name: null,
      city: null,
      region: null,
      country: null,
      postalCode: null,
    };

    if (addressResponse.length > 0) {
      const address = addressResponse[0];
      
      // Extract address components
      addressData = {
        street: address.street,
        name: address.name,
        city: address.city,
        region: address.region,
        country: address.country,
        postalCode: address.postalCode,
      };

      // Create display name with priority system
      // Priority 1: Street name + neighborhood/area
      if (address.street && address.name) {
        displayName = `${address.street}, ${address.name}`;
      }
      // Priority 2: Street name + city
      else if (address.street && address.city) {
        displayName = `${address.street}, ${address.city}`;
      }
      // Priority 3: Area name + city
      else if (address.name && address.city) {
        displayName = `${address.name}, ${address.city}`;
      }
      // Priority 4: Street name + region
      else if (address.street && address.region) {
        displayName = `${address.street}, ${address.region}`;
      }
      // Priority 5: Just street name
      else if (address.street) {
        displayName = address.street;
      }
      // Priority 6: Just area name
      else if (address.name) {
        displayName = address.name;
      }
      // Priority 7: City + region
      else if (address.city && address.region) {
        displayName = `${address.city}, ${address.region}`;
      }
      // Priority 8: Just city
      else if (address.city) {
        displayName = address.city;
      }

      // If we still don't have a good display name, try to get more specific info
      if (!displayName || displayName.length < 10) {
        // Try to get additional location details with different approach
        try {
          // Sometimes the first result might not be the most specific
          // Let's try to get more results and pick the most specific one
          if (addressResponse.length > 1) {
            for (let i = 1; i < addressResponse.length; i++) {
              const altAddress = addressResponse[i];
              if (altAddress.street && altAddress.name && altAddress.name !== altAddress.street) {
                displayName = `${altAddress.street}, ${altAddress.name}`;
                break;
              } else if (altAddress.street && !displayName.includes(altAddress.street)) {
                displayName = altAddress.street;
                break;
              }
            }
          }
        } catch (additionalError) {
          console.log('Additional address lookup failed:', additionalError);
        }
      }
    }

    // Fallback to coordinates if no address found
    if (!displayName) {
      displayName = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
    }

    return {
      coordinates: coords,
      address: addressData,
      displayName,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

/**
 * Extract address form data from location data
 */
export const extractAddressFormData = (locationData: LocationData): AddressFormData => {
  const { address } = locationData;
  
  return {
    city: address.city || '',
    state: address.region || '',
    area: address.name || address.street || '',
    street: address.street || '',
    pincode: address.postalCode || '',
  };
};

/**
 * Get location with address form data for easy form filling
 */
export const getLocationForAddressForm = async (): Promise<{
  locationData: LocationData;
  formData: AddressFormData;
}> => {
  const locationData = await getCurrentLocation();
  const formData = extractAddressFormData(locationData);
  
  return {
    locationData,
    formData,
  };
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Get distance from current location to given coordinates
 */
export const getDistanceFromCurrentLocation = async (
  addressLat: number,
  addressLon: number
): Promise<number> => {
  try {
    const currentLocation = await getCurrentLocation();
    return calculateDistance(
      currentLocation.coordinates.latitude,
      currentLocation.coordinates.longitude,
      addressLat,
      addressLon
    );
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0; // Return 0 if we can't get current location
  }
}; 