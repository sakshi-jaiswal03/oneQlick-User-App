export interface DeliveryAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  contactPerson: string;
  contactNumber: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'upi' | 'card' | 'wallet';
  icon: string;
  description: string;
  isAvailable: boolean;
  processingFee?: number;
}

export interface TimeSlot {
  id: string;
  label: string;
  time: string;
  isAvailable: boolean;
  isRecommended?: boolean;
}

export interface OrderSummary {
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
}

// Sample delivery addresses
export const deliveryAddresses: DeliveryAddress[] = [
  {
    id: 'addr-1',
    type: 'home',
    address: 'House No. 45, Rajpur Village',
    landmark: 'Near Bus Stand',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249401',
    isDefault: true,
    contactPerson: 'Taha Kotwal',
    contactNumber: '+91 98765 43210',
  },
  {
    id: 'addr-2',
    type: 'work',
    address: 'Flat 12, Green Valley Apartments, Jwalapur',
    landmark: 'Opposite Railway Station',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249407',
    isDefault: false,
    contactPerson: 'Taha Kotwal',
    contactNumber: '+91 98765 43210',
  },
  {
    id: 'addr-3',
    type: 'other',
    address: 'Shop No. 8, Bus Stand Market',
    landmark: 'Near Police Station',
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincode: '249401',
    isDefault: false,
    contactPerson: 'Taha Kotwal',
    contactNumber: '+91 98765 43210',
  },
];

// Available payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
    type: 'cash',
    icon: '💵',
    description: 'Pay when your order arrives',
    isAvailable: true,
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    type: 'upi',
    icon: '📱',
    description: 'UPI payment via PhonePe',
    isAvailable: true,
    processingFee: 0,
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    type: 'upi',
    icon: '📱',
    description: 'UPI payment via Google Pay',
    isAvailable: true,
    processingFee: 0,
  },
  {
    id: 'paytm',
    name: 'Paytm',
    type: 'wallet',
    icon: '📱',
    description: 'Pay using Paytm wallet',
    isAvailable: true,
    processingFee: 0,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: '💳',
    description: 'Pay using credit or debit card',
    isAvailable: true,
    processingFee: 2.5,
  },
];

// Available time slots
export const timeSlots: TimeSlot[] = [
  {
    id: 'asap',
    label: 'ASAP',
    time: '35-40 minutes',
    isAvailable: true,
    isRecommended: true,
  },
  {
    id: '1hr',
    label: '1 hour later',
    time: '1:30 PM - 1:45 PM',
    isAvailable: true,
  },
  {
    id: '2hr',
    label: '2 hours later',
    time: '2:30 PM - 2:45 PM',
    isAvailable: true,
  },
  {
    id: '3hr',
    label: '3 hours later',
    time: '3:30 PM - 3:45 PM',
    isAvailable: false,
  },
  {
    id: '4hr',
    label: '4 hours later',
    time: '4:30 PM - 4:45 PM',
    isAvailable: true,
  },
];

// Sample order summary
export const sampleOrderSummary: OrderSummary = {
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
};

// Restaurant information
export const restaurantInfo = {
  name: "Sharma's Kitchen",
  address: "Near Bus Stand, Rajpur Village, Haridwar",
  phone: "+91 98765 43210",
  openingHours: "11:00 AM - 11:00 PM",
  estimatedDelivery: "35-40 minutes",
  minOrder: 100,
  deliveryFee: 30,
  packagingCharges: 15,
};

// Terms and conditions
export const termsAndConditions = [
  "By placing this order, you agree to our terms of service and privacy policy.",
  "Delivery time is estimated and may vary based on traffic and weather conditions.",
  "We reserve the right to cancel orders in case of unavailability or technical issues.",
  "Payment will be collected at the time of delivery for cash on delivery orders.",
  "Refunds will be processed within 3-5 business days for cancelled orders.",
  "For any queries or complaints, please contact our customer support.",
]; 