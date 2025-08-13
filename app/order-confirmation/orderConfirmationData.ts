export interface OrderConfirmationData {
  orderId: string;
  orderNumber: string;
  restaurant: {
    name: string;
    address: string;
    phone: string;
    rating: number;
    cuisine: string;
    openingHours: string;
  };
  orderDetails: {
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      addOns: Array<{
        name: string;
        price: number;
      }>;
    }>;
    subtotal: number;
    gst: number;
    deliveryFee: number;
    packagingCharges: number;
    discount: number;
    total: number;
  };
  delivery: {
    address: string;
    estimatedTime: string;
    estimatedTimeMinutes: number;
    deliveryInstructions?: string;
  };
  payment: {
    method: string;
    methodIcon: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending';
    time: string;
    icon: string;
  }>;
  contactInfo: {
    customerSupport: string;
    emergencyContact: string;
    whatsappSupport: string;
  };
}

// Sample order confirmation data
export const sampleOrderConfirmation: OrderConfirmationData = {
  orderId: 'ORD001234',
  orderNumber: '#ORD001234',
  restaurant: {
    name: "Sharma's Kitchen",
    address: "Near Bus Stand, Rajpur Village, Haridwar, Uttarakhand - 249401",
    phone: "+91 98765 43210",
    rating: 4.3,
    cuisine: "North Indian, Chinese",
    openingHours: "11:00 AM - 11:00 PM",
  },
  orderDetails: {
    items: [
      {
        id: 'item-1',
        name: 'Chicken Biryani',
        quantity: 2,
        price: 180,
        addOns: [
          { name: 'Extra Raita', price: 20 },
          { name: 'Boiled Egg', price: 15 },
        ],
      },
      {
        id: 'item-2',
        name: 'Paneer Butter Masala',
        quantity: 1,
        price: 160,
        addOns: [
          { name: 'Extra Naan', price: 25 },
        ],
      },
      {
        id: 'item-3',
        name: 'Dal Makhani',
        quantity: 1,
        price: 120,
        addOns: [],
      },
      {
        id: 'item-4',
        name: 'Gulab Jamun',
        quantity: 2,
        price: 80,
        addOns: [],
      },
    ],
    subtotal: 450,
    gst: 22.50,
    deliveryFee: 30,
    packagingCharges: 15,
    discount: 0,
    total: 517.50,
  },
  delivery: {
    address: "House No. 45, Rajpur Village, Near Bus Stand, Haridwar, Uttarakhand - 249401",
    estimatedTime: "35-40 minutes",
    estimatedTimeMinutes: 37,
    deliveryInstructions: "Please call when you reach the gate",
  },
  payment: {
    method: "PhonePe",
    methodIcon: "📱",
    status: 'completed',
    transactionId: 'TXN789456',
  },
  timeline: [
    {
      id: 'order-placed',
      title: 'Order Placed',
      description: 'Your order has been successfully placed',
      status: 'completed',
      time: '12:30 PM',
      icon: '🎯',
    },
    {
      id: 'order-confirmed',
      title: 'Order Confirmed',
      description: 'Restaurant has confirmed your order',
      status: 'completed',
      time: '12:32 PM',
      icon: '✅',
    },
    {
      id: 'preparing',
      title: 'Preparing',
      description: 'Chef is preparing your delicious food',
      status: 'current',
      time: '12:35 PM',
      icon: '👨‍🍳',
    },
    {
      id: 'out-for-delivery',
      title: 'Out for Delivery',
      description: 'Your order is on its way to you',
      status: 'pending',
      time: '1:05 PM',
      icon: '🚚',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Enjoy your meal!',
      status: 'pending',
      time: '1:10 PM',
      icon: '🎉',
    },
  ],
  contactInfo: {
    customerSupport: "+91 1800 123 4567",
    emergencyContact: "+91 98765 43210",
    whatsappSupport: "+91 98765 43210",
  },
};

// Celebration messages
export const celebrationMessages = [
  "🎉 Order Placed Successfully!",
  "🍽️ Your delicious food is on its way!",
  "🚚 Sit back and relax while we prepare your order",
  "⏰ Estimated delivery: 35-40 minutes",
  "📱 Track your order in real-time",
];

// Progress bar colors
export const progressColors = {
  completed: '#4CAF50',
  current: '#FF6B35',
  pending: '#E0E0E0',
};

// Social sharing content
export const socialShareContent = {
  title: "Just ordered delicious food from Sharma's Kitchen! 🍽️",
  message: "Order #ORD001234 - Estimated delivery in 35-40 minutes. Can't wait! 😋",
  url: "https://oneqlick.app/order/ORD001234",
};

// Push notification setup
export const pushNotificationSetup = {
  title: "Stay Updated! 📱",
  message: "Enable push notifications to get real-time updates about your order",
  benefits: [
    "Order confirmation",
    "Preparation updates",
    "Delivery tracking",
    "Special offers",
  ],
};

// Default export to prevent routing issues
export default {
  sampleOrderConfirmation,
  celebrationMessages,
  progressColors,
  socialShareContent,
  pushNotificationSetup,
}; 