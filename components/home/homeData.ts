import { FoodItem } from '../../types';

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

export interface QuickReorder {
  id: string;
  restaurantName: string;
  lastOrderDate: string;
  items: string[];
  totalAmount: number;
}



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

// Popular dishes with high-quality Unsplash images
export const popularDishes: FoodItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Rich and creamy butter chicken cooked in aromatic spices with tender chicken pieces',
    price: 280,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center',
    category: 'Main Course',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese and basil',
    price: 320,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
    category: 'Pizza',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '3',
    name: 'Hyderabadi Biryani',
    description: 'Aromatic basmati rice with tender meat, cooked with traditional spices and herbs',
    price: 350,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=400&h=300&fit=crop&crop=center',
    category: 'Biryani',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Sweet and soft milk solids dumplings soaked in rose-flavored sugar syrup',
    price: 80,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center',
    category: 'Dessert',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '5',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk, ginger, cardamom and aromatic spices',
    price: 25,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center',
    category: 'Beverages',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '6',
    name: 'Chicken Tikka',
    description: 'Grilled chicken tikka marinated in yogurt and spices with mint chutney',
    price: 220,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center',
    category: 'Appetizer',
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '7',
    name: 'Veg Fried Rice',
    description: 'Chinese style vegetable fried rice with fresh vegetables and soy sauce',
    price: 160,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
    category: 'Chinese',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
  },
  {
    id: '8',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato gravy with cream and butter',
    price: 240,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center',
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isRecommended: false,
    addOns: [],
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