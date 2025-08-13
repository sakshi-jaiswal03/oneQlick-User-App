export interface RestaurantData {
  id: string;
  name: string;
  cuisine: string[];
  location: string;
  address: string;
  rating: number;
  totalRatings: number;
  deliveryTime: string;
  distance: string;
  deliveryFee: number;
  costForTwo: number;
  bannerImage: string;
  openingHours: string;
  phone: string;
  reviews: Review[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  isVeg: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  preparationTime: string;
  allergens?: string[];
  customizationOptions?: string[];
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Restaurant data
export const restaurantData: RestaurantData = {
  id: 'sharmas-kitchen',
  name: "Sharma's Kitchen",
  cuisine: ['North Indian', 'Chinese', 'Mughlai'],
  location: 'Near Bus Stand, Rajpur',
  address: 'Shop No. 15, Bus Stand Road, Rajpur Village, Haridwar, Uttarakhand 249401',
  rating: 4.3,
  totalRatings: 450,
  deliveryTime: '25-30 mins',
  distance: '0.8 km',
  deliveryFee: 20,
  costForTwo: 400,
  bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop&crop=center',
  openingHours: '11:00 AM - 11:00 PM',
  phone: '+91 98765 43210',
  reviews: [
    {
      id: '1',
      reviewerName: 'Rahul Kumar',
      rating: 5,
      comment: 'Amazing food! The butter chicken is to die for. Delivery was quick and food was piping hot. Highly recommended!',
      date: '2 days ago',
      helpful: 12,
    },
    {
      id: '2',
      reviewerName: 'Priya Sharma',
      rating: 4,
      comment: 'Good quality food, reasonable prices. The biryani was delicious. Will definitely order again.',
      date: '1 week ago',
      helpful: 8,
    },
    {
      id: '3',
      reviewerName: 'Amit Singh',
      rating: 4,
      comment: 'Nice restaurant with authentic North Indian taste. Portion sizes are good. Delivery time was as expected.',
      date: '2 weeks ago',
      helpful: 15,
    },
    {
      id: '4',
      reviewerName: 'Neha Patel',
      rating: 5,
      comment: 'Excellent food quality! The paneer dishes are my favorite. Service is great and delivery is always on time.',
      date: '3 weeks ago',
      helpful: 20,
    },
    {
      id: '5',
      reviewerName: 'Vikram Malhotra',
      rating: 4,
      comment: 'Good food, reasonable prices. The Chinese dishes are also quite good. Overall a great experience.',
      date: '1 month ago',
      helpful: 6,
    },
  ],
};

// Menu categories
export const menuCategories: MenuCategory[] = [
  {
    id: 'starters',
    name: 'Starters',
    icon: 'restaurant',
    description: 'Appetizers and snacks',
  },
  {
    id: 'main-course',
    name: 'Main Course',
    icon: 'restaurant',
    description: 'Main dishes and curries',
  },
  {
    id: 'breads',
    name: 'Breads',
    icon: 'restaurant',
    description: 'Fresh breads and rotis',
  },
  {
    id: 'rice',
    name: 'Rice & Biryani',
    icon: 'restaurant',
    description: 'Rice dishes and biryanis',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: 'local-cafe',
    description: 'Drinks and refreshments',
  },
];

// Food items
export const foodItems: FoodItem[] = [
  // Starters
  {
    id: '1',
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken with curry leaves and spices',
    price: 180,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    categoryId: 'starters',
    isVeg: false,
    isPopular: true,
    isAvailable: true,
    preparationTime: '15 min',
    allergens: ['Chicken', 'Gluten'],
  },
  {
    id: '2',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices and yogurt',
    price: 160,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    categoryId: 'starters',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '12 min',
    allergens: ['Dairy'],
  },
  {
    id: '3',
    name: 'Veg Spring Roll',
    description: 'Crispy spring rolls filled with mixed vegetables',
    price: 120,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'starters',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '10 min',
    allergens: ['Gluten'],
  },
  {
    id: '4',
    name: 'Chicken Manchurian',
    description: 'Indo-Chinese style chicken in spicy sauce',
    price: 200,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    categoryId: 'starters',
    isVeg: false,
    isPopular: true,
    isAvailable: true,
    preparationTime: '18 min',
    allergens: ['Chicken', 'Soy'],
  },

  // Main Course
  {
    id: '5',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and butter gravy',
    price: 280,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    categoryId: 'main-course',
    isVeg: false,
    isPopular: true,
    isAvailable: true,
    preparationTime: '25 min',
    allergens: ['Chicken', 'Dairy'],
  },
  {
    id: '6',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in creamy tomato gravy',
    price: 240,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&crop=center',
    categoryId: 'main-course',
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    preparationTime: '20 min',
    allergens: ['Dairy'],
  },
  {
    id: '7',
    name: 'Chicken Biryani',
    description: 'Aromatic rice with tender chicken and spices',
    price: 320,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
    categoryId: 'main-course',
    isVeg: false,
    isPopular: true,
    isAvailable: true,
    preparationTime: '30 min',
    allergens: ['Chicken', 'Gluten'],
  },
  {
    id: '8',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in creamy gravy',
    price: 160,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'main-course',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '15 min',
    allergens: ['Dairy'],
  },
  {
    id: '9',
    name: 'Veg Fried Rice',
    description: 'Chinese style vegetable fried rice',
    price: 140,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'main-course',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '12 min',
    allergens: ['Soy'],
  },

  // Breads
  {
    id: '10',
    name: 'Butter Naan',
    description: 'Soft leavened bread brushed with butter',
    price: 30,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'breads',
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    preparationTime: '8 min',
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: '11',
    name: 'Roti',
    description: 'Whole wheat flatbread',
    price: 20,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'breads',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '5 min',
    allergens: ['Gluten'],
  },
  {
    id: '12',
    name: 'Laccha Paratha',
    description: 'Layered whole wheat bread',
    price: 35,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'breads',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '10 min',
    allergens: ['Gluten'],
  },

  // Rice & Biryani
  {
    id: '13',
    name: 'Veg Biryani',
    description: 'Aromatic rice with mixed vegetables and spices',
    price: 200,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
    categoryId: 'rice',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '25 min',
    allergens: ['Gluten'],
  },
  {
    id: '14',
    name: 'Jeera Rice',
    description: 'Basmati rice tempered with cumin seeds',
    price: 80,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=center',
    categoryId: 'rice',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '10 min',
    allergens: [],
  },
  {
    id: '15',
    name: 'Hyderabadi Biryani',
    description: 'Traditional Hyderabadi style biryani with meat',
    price: 350,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=200&fit=crop&crop=center',
    categoryId: 'rice',
    isVeg: false,
    isPopular: true,
    isAvailable: true,
    preparationTime: '35 min',
    allergens: ['Chicken', 'Gluten'],
  },

  // Beverages
  {
    id: '16',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk',
    price: 25,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&crop=center',
    categoryId: 'beverages',
    isVeg: true,
    isPopular: true,
    isAvailable: true,
    preparationTime: '5 min',
    allergens: ['Dairy'],
  },
  {
    id: '17',
    name: 'Lassi',
    description: 'Sweet yogurt-based drink',
    price: 40,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&crop=center',
    categoryId: 'beverages',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '3 min',
    allergens: ['Dairy'],
  },
  {
    id: '18',
    name: 'Cold Coffee',
    description: 'Iced coffee with milk and cream',
    price: 60,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop&crop=center',
    categoryId: 'beverages',
    isVeg: true,
    isPopular: false,
    isAvailable: true,
    preparationTime: '8 min',
    allergens: ['Dairy'],
  },
];

// Default export to prevent routing issues
export default {
  restaurantData,
}; 