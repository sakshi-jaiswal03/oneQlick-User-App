export interface FoodItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isPopular: boolean;
  prepTime: string;
  calories: number;
  cuisine: string;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: string;
  allergens: string[];
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelections?: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface SimilarItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

// Main food item data
export const foodItemData: FoodItemData = {
  id: 'chicken-biryani',
  name: 'Chicken Biryani',
  description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices and herbs. Served with raita and pickle.',
  price: 180,
  originalPrice: 220,
  images: [
    'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center',
  ],
  rating: 4.5,
  reviewCount: 120,
  isVeg: false,
  isPopular: true,
  prepTime: '20-25 minutes',
  calories: 450,
  cuisine: 'Hyderabadi',
  nutrition: {
    protein: 25,
    carbs: 65,
    fat: 12,
    fiber: 8,
  },
  ingredients: 'Basmati rice, chicken, onions, tomatoes, ginger, garlic, green chilies, mint leaves, coriander leaves, whole spices (cardamom, cinnamon, cloves, bay leaves), ghee, yogurt, saffron, food color, salt.',
  allergens: ['Dairy', 'Gluten'],
};

// Customization options
export const customizationOptions: CustomizationGroup[] = [
  {
    id: 'addons',
    name: 'Add-ons',
    required: false,
    maxSelections: 3,
    options: [
      {
        id: 'extra-raita',
        name: 'Extra Raita',
        price: 20,
        selected: false,
      },
      {
        id: 'boiled-egg',
        name: 'Boiled Egg',
        price: 15,
        selected: false,
      },
      {
        id: 'extra-pickle',
        name: 'Extra Pickle',
        price: 10,
        selected: false,
      },
      {
        id: 'fried-onions',
        name: 'Fried Onions',
        price: 12,
        selected: false,
      },
      {
        id: 'cashew-nuts',
        name: 'Cashew Nuts',
        price: 25,
        selected: false,
      },
    ],
  },
  {
    id: 'extras',
    name: 'Extra Items',
    required: false,
    maxSelections: 2,
    options: [
      {
        id: 'extra-rice',
        name: 'Extra Rice',
        price: 30,
        selected: false,
      },
      {
        id: 'extra-chicken',
        name: 'Extra Chicken',
        price: 50,
        selected: false,
      },
      {
        id: 'salad',
        name: 'Fresh Salad',
        price: 15,
        selected: false,
      },
    ],
  },
];

// Similar items
export const similarItems: SimilarItem[] = [
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    price: 160,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=150&fit=crop&crop=center',
    rating: 4.3,
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    price: 220,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop&crop=center',
    rating: 4.6,
  },
  {
    id: 'paneer-biryani',
    name: 'Paneer Biryani',
    price: 180,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=150&fit=crop&crop=center',
    rating: 4.4,
  },
  {
    id: 'chicken-pulao',
    name: 'Chicken Pulao',
    price: 150,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=150&fit=crop&crop=center',
    rating: 4.2,
  },
  {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    price: 80,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop&crop=center',
    rating: 4.0,
  },
];

// Default export to prevent routing issues
export default {
  foodItemData,
  customizationOptions,
  similarItems,
}; 