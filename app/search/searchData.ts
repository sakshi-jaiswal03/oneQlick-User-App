export interface SearchFilter {
  id: string;
  name: string;
  type: 'cuisine' | 'price' | 'rating' | 'delivery';
  value: string | number;
  count?: number;
  active?: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  icon?: string;
}

export interface SearchResult {
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
}

export interface SearchFilters {
  cuisines: SearchFilter[];
  priceRanges: SearchFilter[];
  ratings: SearchFilter[];
  deliveryTimes: SearchFilter[];
}

export interface SortOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Search filters data
export const searchFilters: SearchFilters = {
  cuisines: [
    { id: 'north-indian', name: 'North Indian', type: 'cuisine', value: 'north-indian', count: 45, active: false },
    { id: 'south-indian', name: 'South Indian', type: 'cuisine', value: 'south-indian', count: 32, active: false },
    { id: 'chinese', name: 'Chinese', type: 'cuisine', value: 'chinese', count: 28, active: false },
    { id: 'fast-food', name: 'Fast Food', type: 'cuisine', value: 'fast-food', count: 38, active: false },
    { id: 'continental', name: 'Continental', type: 'cuisine', value: 'continental', count: 22, active: false },
    { id: 'desserts', name: 'Desserts', type: 'cuisine', value: 'desserts', count: 18, active: false },
  ],
  
  priceRanges: [
    { id: 'under-200', name: 'Under ₹200', type: 'price', value: 200, count: 156, active: false },
    { id: '200-500', name: '₹200-500', type: 'price', value: 500, count: 89, active: false },
    { id: 'above-500', name: 'Above ₹500', type: 'price', value: 1000, count: 34, active: false },
  ],
  
  ratings: [
    { id: '4-0-plus', name: '4.0+', type: 'rating', value: 4.0, count: 78, active: false },
    { id: '4-5-plus', name: '4.5+', type: 'rating', value: 4.5, count: 45, active: false },
  ],
  
  deliveryTimes: [
    { id: 'under-30', name: 'Under 30 mins', type: 'delivery', value: 30, count: 67, active: false },
    { id: '30-60', name: '30-60 mins', type: 'delivery', value: 60, count: 112, active: false },
  ],
};

// Sort options
export const sortOptions: SortOption[] = [
  { id: 'relevance', name: 'Relevance', description: 'Most relevant results', icon: 'star' },
  { id: 'rating', name: 'Rating', description: 'Highest rated first', icon: 'star' },
  { id: 'delivery-time', name: 'Delivery Time', description: 'Fastest delivery first', icon: 'access-time' },
  { id: 'price-low', name: 'Price: Low to High', description: 'Lowest price first', icon: 'trending-up' },
  { id: 'price-high', name: 'Price: High to Low', description: 'Highest price first', icon: 'trending-down' },
  { id: 'distance', name: 'Distance', description: 'Nearest first', icon: 'place' },
];

// Recent searches
export const recentSearches: SearchSuggestion[] = [
  { id: '1', text: 'biryani', type: 'recent', icon: 'history' },
  { id: '2', text: 'pizza', type: 'recent', icon: 'history' },
  { id: '3', text: 'chinese', type: 'recent', icon: 'history' },
  { id: '4', text: 'butter chicken', type: 'recent', icon: 'history' },
  { id: '5', text: 'masala dosa', type: 'recent', icon: 'history' },
];

// Trending searches
export const trendingSearches: SearchSuggestion[] = [
  { id: '1', text: 'masala dosa', type: 'trending', icon: 'trending-up' },
  { id: '2', text: 'butter chicken', type: 'trending', icon: 'trending-up' },
  { id: '3', text: 'gulab jamun', type: 'trending', icon: 'trending-up' },
  { id: '4', text: 'paneer tikka', type: 'trending', icon: 'trending-up' },
  { id: '5', text: 'chicken biryani', type: 'trending', icon: 'trending-up' },
  { id: '6', text: 'dal makhani', type: 'trending', icon: 'trending-up' },
];

// Sample search results
export const sampleSearchResults: SearchResult[] = [
  // Restaurant results
  {
    id: 'rest-1',
    type: 'restaurant',
    name: "Sharma's Kitchen",
    description: 'Authentic North Indian cuisine with traditional recipes',
    image: 'https://example.com/sharma-kitchen.jpg',
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '25-35 mins',
    deliveryFee: 30,
    minOrder: 150,
    cuisine: 'North Indian',
    isVeg: false,
    isPopular: true,
    isFastDelivery: true,
  },
  {
    id: 'rest-2',
    type: 'restaurant',
    name: 'Spice Garden',
    description: 'Modern Indian fusion with international flavors',
    image: 'https://example.com/spice-garden.jpg',
    rating: 4.3,
    reviewCount: 89,
    deliveryTime: '30-45 mins',
    deliveryFee: 25,
    minOrder: 200,
    cuisine: 'Fusion',
    isVeg: true,
    isPopular: false,
    isFastDelivery: false,
  },
  {
    id: 'rest-3',
    type: 'restaurant',
    name: 'Dosa Corner',
    description: 'Authentic South Indian dosas and breakfast items',
    image: 'https://example.com/dosa-corner.jpg',
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: '20-30 mins',
    deliveryFee: 20,
    minOrder: 100,
    cuisine: 'South Indian',
    isVeg: true,
    isPopular: true,
    isFastDelivery: true,
  },
  
  // Dish results
  {
    id: 'dish-1',
    type: 'dish',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken and spices',
    image: 'https://example.com/chicken-biryani.jpg',
    rating: 4.6,
    reviewCount: 234,
    deliveryTime: '25-35 mins',
    deliveryFee: 30,
    minOrder: 180,
    price: 180,
    restaurantName: "Sharma's Kitchen",
    restaurantId: 'rest-1',
    isVeg: false,
    isPopular: true,
    isFastDelivery: true,
  },
  {
    id: 'dish-2',
    type: 'dish',
    name: 'Masala Dosa',
    description: 'Crispy dosa filled with spiced potato mixture',
    image: 'https://example.com/masala-dosa.jpg',
    rating: 4.8,
    reviewCount: 189,
    deliveryTime: '20-30 mins',
    deliveryFee: 20,
    minOrder: 80,
    price: 80,
    restaurantName: 'Dosa Corner',
    restaurantId: 'rest-3',
    isVeg: true,
    isPopular: true,
    isFastDelivery: true,
  },
  {
    id: 'dish-3',
    type: 'dish',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and butter gravy',
    image: 'https://example.com/butter-chicken.jpg',
    rating: 4.4,
    reviewCount: 167,
    deliveryTime: '25-35 mins',
    deliveryFee: 30,
    minOrder: 160,
    price: 160,
    restaurantName: "Sharma's Kitchen",
    restaurantId: 'rest-1',
    isVeg: false,
    isPopular: true,
    isFastDelivery: true,
  },
  {
    id: 'dish-4',
    type: 'dish',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices',
    image: 'https://example.com/paneer-tikka.jpg',
    rating: 4.2,
    reviewCount: 98,
    deliveryTime: '30-45 mins',
    deliveryFee: 25,
    minOrder: 140,
    price: 140,
    restaurantName: 'Spice Garden',
    restaurantId: 'rest-2',
    isVeg: true,
    isPopular: false,
    isFastDelivery: false,
  },
  {
    id: 'dish-5',
    type: 'dish',
    name: 'Gulab Jamun',
    description: 'Sweet milk solids soaked in rose-flavored sugar syrup',
    image: 'https://example.com/gulab-jamun.jpg',
    rating: 4.5,
    reviewCount: 76,
    deliveryTime: '20-30 mins',
    deliveryFee: 20,
    minOrder: 60,
    price: 60,
    restaurantName: 'Dosa Corner',
    restaurantId: 'rest-3',
    isVeg: true,
    isPopular: true,
    isFastDelivery: true,
  },
];

// Quick filter presets
export const quickFilterPresets = [
  { id: 'veg-only', name: 'Veg Only', icon: 'eco', active: false },
  { id: 'fast-delivery', name: 'Fast Delivery', icon: 'flash-on', active: false },
  { id: 'popular', name: 'Popular', icon: 'trending-up', active: false },
  { id: 'budget-friendly', name: 'Budget Friendly', icon: 'account-balance-wallet', active: false },
];

// Search suggestions based on input
export const getSearchSuggestions = (query: string): SearchSuggestion[] => {
  if (!query.trim()) return [];
  
  const suggestions: SearchSuggestion[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Add trending searches that match
  trendingSearches.forEach(item => {
    if (item.text.toLowerCase().includes(lowerQuery)) {
      suggestions.push({ ...item, type: 'suggestion' });
    }
  });
  
  // Add cuisine suggestions
  searchFilters.cuisines.forEach(cuisine => {
    if (cuisine.name.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        id: `cuisine-${cuisine.id}`,
        text: `${cuisine.name} cuisine`,
        type: 'suggestion',
        icon: 'restaurant',
      });
    }
  });
  
  // Add popular dish suggestions
  const popularDishes = ['biryani', 'pizza', 'burger', 'noodles', 'rice', 'bread'];
  popularDishes.forEach(dish => {
    if (dish.includes(lowerQuery)) {
      suggestions.push({
        id: `dish-${dish}`,
        text: dish,
        type: 'suggestion',
        icon: 'restaurant-menu',
      });
    }
  });
  
  return suggestions.slice(0, 8); // Limit to 8 suggestions
};

// Default export to prevent routing issues
export default {
  searchFilters,
  sortOptions,
  recentSearches,
  trendingSearches,
  sampleSearchResults,
  quickFilterPresets,
  getSearchSuggestions,
}; 