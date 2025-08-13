// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  locationServices: boolean;
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn';
  currency: 'INR' | 'USD';
}

// Restaurant related types
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  totalRatings: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  image: string;
  banner?: string;
  isOpen: boolean;
  isVeg: boolean;
  isPureVeg: boolean;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  categories: string[];
  offers: Offer[];
  featured: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
  customizationOptions?: CustomizationOption[];
  addOns?: AddOn[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  options: string[];
  required: boolean;
  maxSelections?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  validUntil: string;
}

// Order related types
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  trackingInfo?: TrackingInfo;
}

export interface OrderItem {
  id: string;
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: Record<string, string>;
  addOns?: string[];
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface DeliveryAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  lastFourDigits?: string;
  isDefault: boolean;
}

export interface TrackingInfo {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedTimeRemaining: string;
  driverInfo?: DriverInfo;
  updates: TrackingUpdate[];
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  photo?: string;
}

export interface TrackingUpdate {
  timestamp: string;
  status: OrderStatus;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Cart related types
export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  customization?: Record<string, string>;
  addOns: AddOn[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedOffers: Offer[];
  discountAmount: number;
}

// Search and Filter types
export interface SearchFilters {
  cuisine?: string[];
  priceRange?: [number, number];
  rating?: number;
  deliveryTime?: number;
  isVeg?: boolean;
  isOpen?: boolean;
  offers?: boolean;
  sortBy?: 'rating' | 'delivery_time' | 'price_low' | 'price_high' | 'distance';
}

export interface SearchResult {
  restaurants: Restaurant[];
  totalCount: number;
  hasMore: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Navigation types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  '(modals)': undefined;
  restaurant: { id: string };
  checkout: undefined;
  'order-tracking': { id: string };
  profile: undefined;
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
  'forgot-password': undefined;
};

export type TabParamList = {
  home: undefined;
  search: undefined;
  orders: undefined;
  profile: undefined;
};

export type ModalParamList = {
  cart: undefined;
  filter: undefined;
  'location-picker': undefined;
}; 