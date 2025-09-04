export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradientColors: string[];
  actionText: string;
  badge?: string;
  offerCode?: string;
  discount?: string;
}

export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    title: 'MEGA SALE',
    subtitle: 'Up to 60% OFF',
    description: 'On your first 3 orders above ₹199',
    icon: 'fire',
    gradientColors: ['#FF6B35', '#FF8562', '#FFA726'],
    actionText: 'Order Now',
    badge: 'LIMITED TIME',
    offerCode: 'MEGA60',
    discount: '60%',
  },
  {
    id: '2',
    title: 'FREE DELIVERY',
    subtitle: 'No delivery charges',
    description: 'On orders above ₹299 from top restaurants',
    icon: 'truck-delivery',
    gradientColors: ['#4CAF50', '#66BB6A', '#81C784'],
    actionText: 'Browse Restaurants',
    badge: 'POPULAR',
    offerCode: 'FREEDEL',
  },
  {
    id: '3',
    title: 'FLAT ₹100 OFF',
    subtitle: 'Weekend Special',
    description: 'Valid on minimum order of ₹500',
    icon: 'percent',
    gradientColors: ['#2196F3', '#42A5F5', '#64B5F6'],
    actionText: 'Grab Deal',
    badge: 'WEEKEND',
    offerCode: 'WEEK100',
    discount: '₹100',
  },
  {
    id: '4',
    title: 'CASHBACK ₹50',
    subtitle: 'Pay with UPI',
    description: 'Get instant cashback on UPI payments',
    icon: 'wallet',
    gradientColors: ['#9C27B0', '#BA68C8', '#CE93D8'],
    actionText: 'Pay Now',
    badge: 'INSTANT',
    offerCode: 'UPI50',
    discount: '₹50',
  },
  {
    id: '5',
    title: 'COMBO DEALS',
    subtitle: 'Buy 1 Get 1 FREE',
    description: 'On selected items from partner restaurants',
    icon: 'food-variant',
    gradientColors: ['#FF5722', '#FF7043', '#FF8A65'],
    actionText: 'View Combos',
    badge: 'HOT DEAL',
  },
]; 