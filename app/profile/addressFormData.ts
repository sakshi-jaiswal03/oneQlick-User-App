export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressType: 'home' | 'office' | 'other';
  houseNumber: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
}

export interface AddressSuggestion {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}

export interface FormValidation {
  fullName: boolean;
  phoneNumber: boolean;
  houseNumber: boolean;
  area: boolean;
  city: boolean;
  state: boolean;
  pincode: boolean;
}

// Default form data
export const defaultFormData: AddressFormData = {
  fullName: '',
  phoneNumber: '',
  addressType: 'home',
  houseNumber: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

// Default validation state
export const defaultValidation: FormValidation = {
  fullName: false,
  phoneNumber: false,
  houseNumber: false,
  area: false,
  city: false,
  state: false,
  pincode: false,
};

// Address types
export const addressTypes = [
  { id: 'home', name: 'Home', icon: 'home', color: '#4CAF50' },
  { id: 'office', name: 'Office', icon: 'work', color: '#2196F3' },
  { id: 'other', name: 'Other', icon: 'location-on', color: '#FF9800' },
];

// Sample cities and states for auto-fill
export const citiesData = {
  'Haridwar': 'Uttarakhand',
  'Dehradun': 'Uttarakhand',
  'Rishikesh': 'Uttarakhand',
  'Mussoorie': 'Uttarakhand',
  'Delhi': 'Delhi',
  'Mumbai': 'Maharashtra',
  'Bangalore': 'Karnataka',
  'Chennai': 'Tamil Nadu',
  'Kolkata': 'West Bengal',
  'Hyderabad': 'Telangana',
};

// Sample areas for different cities
export const areasData = {
  'Haridwar': [
    'Rajpur',
    'Civil Lines',
    'Jwalapur',
    'Kankhal',
    'Har Ki Pauri',
    'BHEL Township',
    'SIDCUL',
    'Bahadrabad',
    'Roorkee',
    'Manglaur',
  ],
  'Dehradun': [
    'Rajpur Road',
    'Paltan Bazaar',
    'Astley Hall',
    'Dalanwala',
    'Rajpur',
    'Clement Town',
    'Vikas Nagar',
    'Indira Nagar',
    'Prem Nagar',
    'Clock Tower',
  ],
};

// Helper functions
export const validatePhoneNumber = (phone: string): boolean => {
  // Indian phone number validation (10 digits, optionally with +91)
  const phoneRegex = /^(\+91\s?)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePincode = (pincode: string): boolean => {
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateForm = (formData: AddressFormData): FormValidation => {
  return {
    fullName: formData.fullName.trim().length >= 2,
    phoneNumber: validatePhoneNumber(formData.phoneNumber),
    houseNumber: formData.houseNumber.trim().length >= 1,
    area: formData.area.trim().length >= 2,
    city: formData.city.trim().length >= 2,
    state: formData.state.trim().length >= 2,
    pincode: validatePincode(formData.pincode),
  };
};

export const isFormValid = (validation: FormValidation): boolean => {
  return Object.values(validation).every(Boolean);
};

export const getCities = (): string[] => {
  return Object.keys(citiesData);
};

export const getStateForCity = (city: string): string => {
  return citiesData[city as keyof typeof citiesData] || '';
};

export const getAreasForCity = (city: string): string[] => {
  return areasData[city as keyof typeof areasData] || [];
};

export const getAddressTypeInfo = (type: string) => {
  return addressTypes.find(t => t.id === type) || addressTypes[0];
};

// Mock GPS and geocoding functions
export const getCurrentLocation = (): Promise<MapLocation> => {
  return new Promise((resolve) => {
    // Simulate GPS location detection
    setTimeout(() => {
      resolve({
        latitude: 29.9457,
        longitude: 78.1642,
        address: 'Rajpur Village, Near Temple',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249201',
        area: 'Rajpur',
      });
    }, 1000);
  });
};

export const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
  // Simulate address search
  const mockSuggestions: AddressSuggestion[] = [
    {
      id: '1',
      name: 'Rajpur Market',
      address: 'Rajpur Market, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9462, longitude: 78.1638 },
      distance: 0.8,
    },
    {
      id: '2',
      name: 'Temple Area',
      address: 'Near Temple, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9450, longitude: 78.1645 },
      distance: 0.3,
    },
    {
      id: '3',
      name: 'Civil Lines',
      address: 'Civil Lines, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249408',
      coordinates: { latitude: 29.9445, longitude: 78.1650 },
      distance: 1.8,
    },
    {
      id: '4',
      name: 'Main Market',
      address: 'Main Market, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9465, longitude: 78.1635 },
      distance: 1.0,
    },
  ];

  return mockSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.address.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.city.toLowerCase().includes(query.toLowerCase())
  );
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<MapLocation> => {
  // Simulate reverse geocoding
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        latitude,
        longitude,
        address: 'Rajpur Village, Near Temple',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249201',
        area: 'Rajpur',
      });
    }, 500);
  });
};

// Default export
export default {
  defaultFormData,
  defaultValidation,
  addressTypes,
  citiesData,
  areasData,
  validatePhoneNumber,
  validatePincode,
  validateForm,
  isFormValid,
  getCities,
  getStateForCity,
  getAreasForCity,
  getAddressTypeInfo,
  getCurrentLocation,
  searchAddresses,
  reverseGeocode,
}; 