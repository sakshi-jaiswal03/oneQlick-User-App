export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  orderItems: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  orderDate: string;
  deliveryDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  orderStatus: string;
  orderStatusStep: number;
  totalSteps: number;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryAddress: string;
  paymentMethod: string;
  isRated: boolean;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  canReorder: boolean;
  canTrack: boolean;
  canRate: boolean;
}

export interface OrderHistoryData {
  activeOrders: OrderHistoryItem[];
  pastOrders: OrderHistoryItem[];
  cancelledOrders: OrderHistoryItem[];
}

// Sample order items
const sampleOrderItems: OrderItem[] = [
  {
    id: 'item-1',
    name: 'Chicken Biryani',
    quantity: 2,
    price: 180,
    specialInstructions: 'Extra spicy, less oil',
  },
  {
    id: 'item-2',
    name: 'Butter Chicken',
    quantity: 1,
    price: 160,
  },
  {
    id: 'item-3',
    name: 'Naan Bread',
    quantity: 3,
    price: 25,
  },
  {
    id: 'item-4',
    name: 'Raita',
    quantity: 1,
    price: 30,
  },
];

const pizzaOrderItems: OrderItem[] = [
  {
    id: 'item-5',
    name: 'Margherita Pizza',
    quantity: 1,
    price: 250,
    specialInstructions: 'Extra cheese, thin crust',
  },
  {
    id: 'item-6',
    name: 'Garlic Bread',
    quantity: 1,
    price: 80,
  },
  {
    id: 'item-7',
    name: 'Coke',
    quantity: 1,
    price: 50,
  },
];

const pastOrderItems: OrderItem[] = [
  {
    id: 'item-8',
    name: 'Masala Dosa',
    quantity: 2,
    price: 80,
  },
  {
    id: 'item-9',
    name: 'Sambar',
    quantity: 1,
    price: 20,
  },
  {
    id: 'item-10',
    name: 'Coconut Chutney',
    quantity: 1,
    price: 15,
  },
];

// Sample order history data
export const orderHistoryData: OrderHistoryData = {
  activeOrders: [
    {
      id: 'active-1',
      orderNumber: 'ORD001234',
      restaurantId: 'rest-1',
      restaurantName: "Sharma's Kitchen",
      restaurantImage: 'https://example.com/sharma-kitchen.jpg',
      orderItems: sampleOrderItems,
      totalAmount: 517.50,
      deliveryFee: 30,
      orderDate: '2024-01-15T14:30:00Z',
      status: 'active',
      orderStatus: 'Out for Delivery',
      orderStatusStep: 5,
      totalSteps: 6,
      estimatedDeliveryTime: '15:45',
      deliveryAddress: '123 Main Street, City Center, 12345',
      paymentMethod: 'Credit Card',
      isRated: false,
      canReorder: false,
      canTrack: true,
      canRate: false,
    },
    {
      id: 'active-2',
      orderNumber: 'ORD001233',
      restaurantId: 'rest-4',
      restaurantName: 'Pizza Corner',
      restaurantImage: 'https://example.com/pizza-corner.jpg',
      orderItems: pizzaOrderItems,
      totalAmount: 380.00,
      deliveryFee: 25,
      orderDate: '2024-01-15T15:00:00Z',
      status: 'active',
      orderStatus: 'Being Prepared',
      orderStatusStep: 3,
      totalSteps: 6,
      estimatedDeliveryTime: '16:30',
      deliveryAddress: '456 Oak Avenue, Downtown, 12345',
      paymentMethod: 'UPI',
      isRated: false,
      canReorder: false,
      canTrack: true,
      canRate: false,
    },
  ],

  pastOrders: [
    {
      id: 'past-1',
      orderNumber: 'ORD001200',
      restaurantId: 'rest-3',
      restaurantName: 'Dosa Corner',
      restaurantImage: 'https://example.com/dosa-corner.jpg',
      orderItems: pastOrderItems,
      totalAmount: 195.00,
      deliveryFee: 20,
      orderDate: '2024-01-10T12:00:00Z',
      deliveryDate: '2024-01-10T12:45:00Z',
      status: 'completed',
      orderStatus: 'Delivered',
      orderStatusStep: 6,
      totalSteps: 6,
      actualDeliveryTime: '12:45',
      deliveryAddress: '789 Pine Street, Suburb, 12345',
      paymentMethod: 'Cash on Delivery',
      isRated: true,
      rating: 5,
      review: 'Excellent dosas! Very crispy and authentic taste.',
      canReorder: true,
      canTrack: false,
      canRate: false,
    },
    {
      id: 'past-2',
      orderNumber: 'ORD001198',
      restaurantId: 'rest-2',
      restaurantName: 'Spice Garden',
      restaurantImage: 'https://example.com/spice-garden.jpg',
      orderItems: [
        { id: 'item-11', name: 'Paneer Tikka', quantity: 1, price: 140 },
        { id: 'item-12', name: 'Dal Makhani', quantity: 1, price: 120 },
        { id: 'item-13', name: 'Jeera Rice', quantity: 1, price: 80 },
      ],
      totalAmount: 365.00,
      deliveryFee: 25,
      orderDate: '2024-01-08T19:00:00Z',
      deliveryDate: '2024-01-08T19:50:00Z',
      status: 'completed',
      orderStatus: 'Delivered',
      orderStatusStep: 6,
      totalSteps: 6,
      actualDeliveryTime: '19:50',
      deliveryAddress: '321 Elm Street, City Center, 12345',
      paymentMethod: 'Credit Card',
      isRated: false,
      canReorder: true,
      canTrack: false,
      canRate: true,
    },
    {
      id: 'past-3',
      orderNumber: 'ORD001195',
      restaurantId: 'rest-1',
      restaurantName: "Sharma's Kitchen",
      restaurantImage: 'https://example.com/sharma-kitchen.jpg',
      orderItems: [
        { id: 'item-14', name: 'Mutton Curry', quantity: 1, price: 220 },
        { id: 'item-15', name: 'Biryani Rice', quantity: 1, price: 150 },
        { id: 'item-16', name: 'Onion Raita', quantity: 1, price: 30 },
      ],
      totalAmount: 425.00,
      deliveryFee: 30,
      orderDate: '2024-01-05T18:30:00Z',
      deliveryDate: '2024-01-05T19:15:00Z',
      status: 'completed',
      orderStatus: 'Delivered',
      orderStatusStep: 6,
      totalSteps: 6,
      actualDeliveryTime: '19:15',
      deliveryAddress: '654 Maple Drive, Downtown, 12345',
      paymentMethod: 'UPI',
      isRated: true,
      rating: 4,
      review: 'Good food, but delivery was a bit slow.',
      canReorder: true,
      canTrack: false,
      canRate: false,
    },
    {
      id: 'past-4',
      orderNumber: 'ORD001190',
      restaurantId: 'rest-5',
      restaurantName: 'Burger House',
      restaurantImage: 'https://example.com/burger-house.jpg',
      orderItems: [
        { id: 'item-17', name: 'Classic Burger', quantity: 2, price: 120 },
        { id: 'item-18', name: 'French Fries', quantity: 1, price: 80 },
        { id: 'item-19', name: 'Chocolate Shake', quantity: 1, price: 90 },
      ],
      totalAmount: 410.00,
      deliveryFee: 25,
      orderDate: '2024-01-02T20:00:00Z',
      deliveryDate: '2024-01-02T20:35:00Z',
      status: 'completed',
      orderStatus: 'Delivered',
      orderStatusStep: 6,
      totalSteps: 6,
      actualDeliveryTime: '20:35',
      deliveryAddress: '987 Cedar Lane, Suburb, 12345',
      paymentMethod: 'Cash on Delivery',
      isRated: true,
      rating: 5,
      review: 'Amazing burgers! Will order again.',
      canReorder: true,
      canTrack: false,
      canRate: false,
    },
    {
      id: 'past-5',
      orderNumber: 'ORD001185',
      restaurantId: 'rest-6',
      restaurantName: 'Chinese Wok',
      restaurantImage: 'https://example.com/chinese-wok.jpg',
      orderItems: [
        { id: 'item-20', name: 'Chicken Fried Rice', quantity: 1, price: 160 },
        { id: 'item-21', name: 'Veg Manchurian', quantity: 1, price: 140 },
        { id: 'item-22', name: 'Sweet Corn Soup', quantity: 1, price: 80 },
      ],
      totalAmount: 405.00,
      deliveryFee: 25,
      orderDate: '2023-12-28T19:30:00Z',
      deliveryDate: '2023-12-28T20:20:00Z',
      status: 'completed',
      orderStatus: 'Delivered',
      orderStatusStep: 6,
      totalSteps: 6,
      actualDeliveryTime: '20:20',
      deliveryAddress: '147 Birch Street, City Center, 12345',
      paymentMethod: 'Credit Card',
      isRated: false,
      canReorder: true,
      canTrack: false,
      canRate: true,
    },
  ],

  cancelledOrders: [
    {
      id: 'cancelled-1',
      orderNumber: 'ORD001180',
      restaurantId: 'rest-7',
      restaurantName: 'Sushi Bar',
      restaurantImage: 'https://example.com/sushi-bar.jpg',
      orderItems: [
        { id: 'item-23', name: 'California Roll', quantity: 1, price: 180 },
        { id: 'item-24', name: 'Miso Soup', quantity: 1, price: 90 },
        { id: 'item-25', name: 'Green Tea', quantity: 1, price: 50 },
      ],
      totalAmount: 345.00,
      deliveryFee: 30,
      orderDate: '2023-12-25T18:00:00Z',
      status: 'cancelled',
      orderStatus: 'Cancelled',
      orderStatusStep: 0,
      totalSteps: 6,
      deliveryAddress: '258 Spruce Avenue, Downtown, 12345',
      paymentMethod: 'Credit Card',
      isRated: false,
      cancellationReason: 'Restaurant was closed due to holiday',
      canReorder: true,
      canTrack: false,
      canRate: false,
    },
  ],
};

// Helper functions
export const getOrderStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'out for delivery':
      return '#2196F3';
    case 'being prepared':
      return '#FF9800';
    case 'delivered':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#666';
  }
};

export const getOrderStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'out for delivery':
      return 'delivery-dining';
    case 'being prepared':
      return 'restaurant';
    case 'delivered':
      return 'check-circle';
    case 'cancelled':
      return 'cancel';
    default:
      return 'schedule';
  }
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const formatOrderTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const getOrderItemsSummary = (items: OrderItem[]): string => {
  if (items.length === 1) {
    return `${items[0].name} x${items[0].quantity}`;
  } else if (items.length === 2) {
    return `${items[0].name} x${items[0].quantity}, ${items[1].name} x${items[1].quantity}`;
  } else {
    return `${items[0].name} x${items[0].quantity} +${items.length - 1} more items`;
  }
};

// Default export to prevent routing issues
export default {
  orderHistoryData,
  getOrderStatusColor,
  getOrderStatusIcon,
  formatOrderDate,
  formatOrderTime,
  getOrderItemsSummary,
}; 