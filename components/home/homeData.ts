export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  offerText: string;
  backgroundColor: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: string;
  distance: string;
  image: string;
  isOpen: boolean;
  offers: string[];
}

export interface PopularDish {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  restaurant: string;
  preparationTime: string;
  isVeg: boolean;
}

export interface QuickReorder {
  id: string;
  restaurantName: string;
  lastOrderDate: string;
  items: string[];
  totalAmount: number;
}

// Promotional banners with Unsplash images
export const promotionalBanners: PromotionalBanner[] = [
  {
    id: '1',
    title: 'Diwali Special',
    subtitle: 'Get 50% OFF on sweets',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=200&fit=crop&crop=center',
    offerText: '50% OFF',
    backgroundColor: '#FF6B35',
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹200',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center',
    offerText: 'FREE',
    backgroundColor: '#4CAF50',
  },
  {
    id: '3',
    title: 'New User Bonus',
    subtitle: '₹100 OFF on first order',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop&crop=center',
    offerText: '₹100 OFF',
    backgroundColor: '#2196F3',
  },
  {
    id: '4',
    title: 'Weekend Special',
    subtitle: 'Buy 1 Get 1 on selected items',
    image: 'https://images.unsplash.com/photo-1504674900242-87fec7f58d7e?w=400&h=200&fit=crop&crop=center',
    offerText: 'B1G1',
    backgroundColor: '#FF9800',
  },
];

// Food categories
export const foodCategories: FoodCategory[] = [
  { id: '1', name: 'Biryani', icon: 'restaurant', color: '#FF6B35', itemCount: 45 },
  { id: '2', name: 'Pizza', icon: 'local-pizza', color: '#FFD93D', itemCount: 32 },
  { id: '3', name: 'Chinese', icon: 'fastfood', color: '#6BCF7F', itemCount: 28 },
  { id: '4', name: 'South Indian', icon: 'restaurant', color: '#4ECDC4', itemCount: 38 },
  { id: '5', name: 'Sweets', icon: 'cake', color: '#FF8E9E', itemCount: 25 },
  { id: '6', name: 'Tea/Coffee', icon: 'local-cafe', color: '#A8E6CF', itemCount: 18 },
  { id: '7', name: 'Fast Food', icon: 'fastfood', color: '#FFB74D', itemCount: 42 },
  { id: '8', name: 'North Indian', icon: 'restaurant', color: '#9C27B0', itemCount: 55 },
];

// Nearby restaurants with Unsplash images
export const nearbyRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Spice Garden',
    cuisine: 'North Indian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    minOrder: '₹150',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&crop=center',
    isOpen: true,
    offers: ['20% OFF', 'Free Delivery'],
  },
  {
    id: '2',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.3,
    deliveryTime: '30-40 min',
    minOrder: '₹200',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
    isOpen: true,
    offers: ['Buy 1 Get 1'],
  },
  {
    id: '3',
    name: 'Biryani House',
    cuisine: 'Hyderabadi',
    rating: 4.7,
    deliveryTime: '20-30 min',
    minOrder: '₹180',
    distance: '0.5 km',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop&crop=center',
    isOpen: true,
    offers: ['15% OFF'],
  },
  {
    id: '4',
    name: 'Sweet Corner',
    cuisine: 'Desserts',
    rating: 4.2,
    deliveryTime: '15-25 min',
    minOrder: '₹100',
    distance: '0.3 km',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center',
    isOpen: true,
    offers: ['Diwali Special'],
  },
  {
    id: '5',
    name: 'Chai Point',
    cuisine: 'Beverages',
    rating: 4.0,
    deliveryTime: '10-20 min',
    minOrder: '₹50',
    distance: '0.6 km',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop&crop=center',
    isOpen: true,
    offers: ['Free Tea'],
  },
  {
    id: '6',
    name: 'Dhaba Express',
    cuisine: 'Punjabi',
    rating: 4.4,
    deliveryTime: '35-45 min',
    minOrder: '₹120',
    distance: '1.5 km',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&crop=center',
    isOpen: false,
    offers: ['30% OFF'],
  },
];

// Popular dishes with Unsplash images
export const popularDishes: PopularDish[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Rich and creamy butter chicken with naan',
    price: 280,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Spice Garden',
    preparationTime: '20 min',
    isVeg: false,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato and mozzarella',
    price: 320,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Pizza Palace',
    preparationTime: '25 min',
    isVeg: true,
  },
  {
    id: '3',
    name: 'Hyderabadi Biryani',
    description: 'Aromatic biryani with tender meat',
    price: 350,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Biryani House',
    preparationTime: '30 min',
    isVeg: false,
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Sweet and soft gulab jamun',
    price: 80,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Sweet Corner',
    preparationTime: '5 min',
    isVeg: true,
  },
  {
    id: '5',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk',
    price: 25,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Chai Point',
    preparationTime: '8 min',
    isVeg: true,
  },
  {
    id: '6',
    name: 'Chicken Tikka',
    description: 'Grilled chicken tikka with mint chutney',
    price: 220,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Spice Garden',
    preparationTime: '18 min',
    isVeg: false,
  },
  {
    id: '7',
    name: 'Veg Fried Rice',
    description: 'Chinese style vegetable fried rice',
    price: 160,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Pizza Palace',
    preparationTime: '15 min',
    isVeg: true,
  },
  {
    id: '8',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich tomato gravy',
    price: 240,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    restaurant: 'Spice Garden',
    preparationTime: '22 min',
    isVeg: true,
  },
];

// Quick reorders
export const quickReorders: QuickReorder[] = [
  {
    id: '1',
    restaurantName: 'Spice Garden',
    lastOrderDate: '2 days ago',
    items: ['Butter Chicken', 'Naan', 'Dal Makhani'],
    totalAmount: 450,
  },
  {
    id: '2',
    restaurantName: 'Biryani House',
    lastOrderDate: '1 week ago',
    items: ['Hyderabadi Biryani', 'Raita'],
    totalAmount: 380,
  },
]; 