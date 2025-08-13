export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicle: {
    type: string;
    number: string;
    color: string;
  };
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    lastUpdated: string;
  };
  estimatedArrival: string;
}

export interface OrderStatus {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
  icon: string;
  details?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export interface OrderTrackingData {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  currentStep: number;
  totalSteps: number;
  estimatedDeliveryTime: string;
  estimatedDeliveryMinutes: number;
  actualDeliveryTime?: string;
  
  // Progress tracking
  progress: {
    orderPlaced: boolean;
    restaurantConfirmed: boolean;
    foodPreparing: boolean;
    readyForPickup: boolean;
    outForDelivery: boolean;
    delivered: boolean;
  };
  
  // Timeline
  timeline: OrderStatus[];
  
  // Locations
  restaurant: Location;
  deliveryAddress: Location;
  deliveryPartner?: DeliveryPartner;
  
  // Order details
  orderSummary: {
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  };
  
  // Contact information
  restaurantContact: {
    phone: string;
    name: string;
  };
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'status_update' | 'delivery_update' | 'system';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  
  // Map data
  mapData: {
    center: {
      latitude: number;
      longitude: number;
    };
    zoom: number;
    routeCoordinates: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
}

// Sample order tracking data
export const sampleOrderTracking: OrderTrackingData = {
  orderId: 'ORD001234',
  orderNumber: '#ORD001234',
  currentStatus: 'Food Being Prepared',
  currentStep: 3,
  totalSteps: 6,
  estimatedDeliveryTime: '25 minutes',
  estimatedDeliveryMinutes: 25,
  
  progress: {
    orderPlaced: true,
    restaurantConfirmed: true,
    foodPreparing: true,
    readyForPickup: false,
    outForDelivery: false,
    delivered: false,
  },
  
  timeline: [
    {
      id: 'order-placed',
      title: 'Order Placed',
      description: 'Your order has been successfully placed',
      status: 'completed',
      timestamp: '12:30 PM',
      icon: '🎯',
      details: 'Order #ORD001234 confirmed',
    },
    {
      id: 'restaurant-confirmed',
      title: 'Restaurant Confirmed',
      description: 'Restaurant has confirmed your order',
      status: 'completed',
      timestamp: '12:32 PM',
      icon: '✅',
      details: 'Sharma\'s Kitchen accepted your order',
    },
    {
      id: 'food-preparing',
      title: 'Food Being Prepared',
      description: 'Chef is preparing your delicious food',
      status: 'current',
      timestamp: '12:35 PM',
      icon: '👨‍🍳',
      details: 'Estimated preparation time: 15-20 minutes',
    },
    {
      id: 'ready-pickup',
      title: 'Ready for Pickup',
      description: 'Your order is ready for pickup',
      status: 'pending',
      timestamp: '12:50 PM',
      icon: '📦',
      details: 'Waiting for delivery partner',
    },
    {
      id: 'out-delivery',
      title: 'Out for Delivery',
      description: 'Your order is on its way to you',
      status: 'pending',
      timestamp: '1:00 PM',
      icon: '🚚',
      details: 'Delivery partner: Rajesh Kumar',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Enjoy your meal!',
      status: 'pending',
      timestamp: '1:25 PM',
      icon: '🎉',
      details: 'Order completed successfully',
    },
  ],
  
  restaurant: {
    latitude: 29.9457,
    longitude: 78.1642,
    address: 'Near Bus Stand, Rajpur Village, Haridwar, Uttarakhand - 249401',
    name: 'Sharma\'s Kitchen',
  },
  
  deliveryAddress: {
    latitude: 29.9467,
    longitude: 78.1652,
    address: 'House No. 45, Rajpur Village, Near Bus Stand, Haridwar, Uttarakhand - 249401',
    name: 'Home',
  },
  
  deliveryPartner: {
    id: 'partner-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765-43210',
    rating: 4.7,
    totalDeliveries: 150,
    vehicle: {
      type: 'Motorcycle',
      number: 'UP-05-AB-1234',
      color: 'Red',
    },
    currentLocation: {
      latitude: 29.9450,
      longitude: 78.1630,
      accuracy: 10,
      lastUpdated: '12:40 PM',
    },
    estimatedArrival: '1:00 PM',
  },
  
  orderSummary: {
    items: [
      {
        id: 'item-1',
        name: 'Chicken Biryani',
        quantity: 2,
        price: 180,
      },
      {
        id: 'item-2',
        name: 'Paneer Butter Masala',
        quantity: 1,
        price: 160,
      },
      {
        id: 'item-3',
        name: 'Dal Makhani',
        quantity: 1,
        price: 120,
      },
      {
        id: 'item-4',
        name: 'Gulab Jamun',
        quantity: 2,
        price: 80,
      },
    ],
    total: 517.50,
  },
  
  restaurantContact: {
    phone: '+91 98765 43210',
    name: 'Sharma\'s Kitchen',
  },
  
  notifications: [
    {
      id: 'notif-1',
      type: 'status_update',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed by Sharma\'s Kitchen',
      timestamp: '12:32 PM',
      read: true,
    },
    {
      id: 'notif-2',
      type: 'delivery_update',
      title: 'Food Preparation Started',
      message: 'Chef has started preparing your order',
      timestamp: '12:35 PM',
      read: true,
    },
    {
      id: 'notif-3',
      type: 'system',
      title: 'Delivery Partner Assigned',
      message: 'Rajesh Kumar will deliver your order',
      timestamp: '12:38 PM',
      read: false,
    },
  ],
  
  mapData: {
    center: {
      latitude: 29.9462,
      longitude: 78.1647,
    },
    zoom: 15,
    routeCoordinates: [
      { latitude: 29.9457, longitude: 78.1642 }, // Restaurant
      { latitude: 29.9455, longitude: 78.1640 },
      { latitude: 29.9453, longitude: 78.1645 },
      { latitude: 29.9450, longitude: 78.1630 }, // Current partner location
      { latitude: 29.9460, longitude: 78.1645 },
      { latitude: 29.9467, longitude: 78.1652 }, // Delivery address
    ],
  },
};

// Order status steps for progress tracking
export const orderStatusSteps = [
  { id: 1, title: 'Order Placed', icon: '🎯' },
  { id: 2, title: 'Restaurant Confirmed', icon: '✅' },
  { id: 3, title: 'Food Being Prepared', icon: '👨‍🍳' },
  { id: 4, title: 'Ready for Pickup', icon: '📦' },
  { id: 5, title: 'Out for Delivery', icon: '🚚' },
  { id: 6, title: 'Delivered', icon: '🎉' },
];

// Default export to prevent routing issues
export default {
  sampleOrderTracking,
  orderStatusSteps,
}; 