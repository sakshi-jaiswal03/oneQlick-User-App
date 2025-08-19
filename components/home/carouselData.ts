export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  actionText: string;
}

export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    title: 'Fast Delivery',
    subtitle: 'Get your food delivered in under 30 minutes',
    icon: 'local-shipping',
    backgroundColor: '#FF6B35',
    actionText: 'Order Now',
  },
  {
    id: '2',
    title: 'Special Offers',
    subtitle: 'Up to 50% off on selected items',
    icon: 'local-offer',
    backgroundColor: '#4CAF50',
    actionText: 'View Offers',
  },
  {
    id: '3',
    title: 'New Restaurants',
    subtitle: 'Discover amazing new places to eat',
    icon: 'restaurant',
    backgroundColor: '#2196F3',
    actionText: 'Explore',
  },
  {
    id: '4',
    title: 'Premium Quality',
    subtitle: 'Handpicked restaurants for the best experience',
    icon: 'star',
    backgroundColor: '#9C27B0',
    actionText: 'Learn More',
  },
]; 