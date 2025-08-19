import * as Location from 'expo-location';

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  isSelected: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Distance from current location in km
  deliveryArea: boolean; // Whether address is in delivery area
  lastUsed?: string; // Last time this address was used
}

export interface AddressType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DeliveryArea {
  city: string;
  state: string;
  pincodes: string[];
  isActive: boolean;
}

// Address types with icons and colors
export const addressTypes: AddressType[] = [
  {
    id: 'home',
    name: 'Home',
    icon: 'home',
    color: '#4CAF50',
  },
  {
    id: 'office',
    name: 'Office',
    icon: 'briefcase',
    color: '#2196F3',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'map-marker',
    color: '#FF9800',
  },
];

// Sample addresses data
export const sampleAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'home',
    name: 'Home',
    houseNumber: 'House No. 45',
    street: 'Rajpur Village, Near Temple',
    landmark: 'Near Temple',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249201',
    isDefault: true,
    isSelected: true,
    coordinates: {
      latitude: 29.9457,
      longitude: 78.1642,
    },
    distance: 0.5,
    deliveryArea: true,
    lastUsed: '2024-01-15T14:30:00Z',
  },
  {
    id: 'addr-2',
    type: 'office',
    name: 'Office',
    houseNumber: 'Sharma Electronics',
    street: 'Main Market, Rajpur',
    landmark: 'Main Market',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249201',
    isDefault: false,
    isSelected: false,
    coordinates: {
      latitude: 29.9462,
      longitude: 78.1638,
    },
    distance: 1.2,
    deliveryArea: true,
    lastUsed: '2024-01-10T12:00:00Z',
  },
  {
    id: 'addr-3',
    type: 'other',
    name: "Friend's House",
    houseNumber: "Friend's House",
    street: 'Civil Lines',
    landmark: 'Civil Lines',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249408',
    isDefault: false,
    isSelected: false,
    coordinates: {
      latitude: 29.9445,
      longitude: 78.1650,
    },
    distance: 2.1,
    deliveryArea: true,
    lastUsed: '2024-01-05T18:00:00Z',
  },
];

// Delivery areas data
export const deliveryAreas: DeliveryArea[] = [
  {
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincodes: ['249201', '249202', '249203', '249204', '249205', '249408'],
    isActive: true,
  },
  {
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincodes: ['248001', '248002', '248003', '248004', '248005'],
    isActive: true,
  },
];

// Helper functions
export const getAddressTypeIcon = (type: string): string => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.icon || 'map-marker';
};

export const getAddressTypeColor = (type: string): string => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.color || '#666';
};

export const getAddressTypeName = (type: string): string => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.name || 'Other';
};

export const formatFullAddress = (address: Address): string => {
  const parts = [
    address.houseNumber,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatShortAddress = (address: Address): string => {
  const parts = [
    address.houseNumber,
    address.street,
    address.city,
    address.pincode,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const validatePincode = (pincode: string): boolean => {
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateDeliveryArea = (pincode: string): boolean => {
  return deliveryAreas.some(area => 
    area.isActive && area.pincodes.includes(pincode)
  );
};

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

export const getDistanceFromCurrentLocation = async (
  addressLat: number,
  addressLon: number
): Promise<number> => {
  try {
    const currentLocation = await getCurrentLocation();
    return calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      addressLat,
      addressLon
    );
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0; // Return 0 if we can't get current location
  }
};

export const getCurrentLocation = async (): Promise<{latitude: number, longitude: number}> => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 10,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

export const searchNearbyPlaces = async (
  query: string,
  latitude: number,
  longitude: number
): Promise<any[]> => {
  // Simulate nearby places search
  const mockPlaces = [
    {
      id: 'place-1',
      name: 'Rajpur Market',
      address: 'Rajpur, Haridwar',
      coordinates: { latitude: 29.9462, longitude: 78.1638 },
      distance: 0.8,
    },
    {
      id: 'place-2',
      name: 'Temple Area',
      address: 'Near Temple, Rajpur',
      coordinates: { latitude: 29.9450, longitude: 78.1645 },
      distance: 0.3,
    },
    {
      id: 'place-3',
      name: 'Civil Lines',
      address: 'Civil Lines, Haridwar',
      coordinates: { latitude: 29.9445, longitude: 78.1650 },
      distance: 1.8,
    },
  ];
  
  return mockPlaces.filter(place => 
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase())
  );
};

// Default export to prevent routing issues
export default {
  addressTypes,
  sampleAddresses,
  deliveryAreas,
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
  formatFullAddress,
  formatShortAddress,
  validatePincode,
  validateDeliveryArea,
  calculateDistance,
  getCurrentLocation,
  searchNearbyPlaces,
}; 