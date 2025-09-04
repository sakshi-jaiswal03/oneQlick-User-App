import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'order' | 'offer' | 'promotion' | 'system' | 'restaurant';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'order' | 'offer'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order Delivered Successfully!',
        message: 'Your order from Spice Garden has been delivered. Hope you enjoy your delicious meal!',
        timestamp: '2 minutes ago',
        isRead: false,
        actionUrl: '/order-tracking',
        priority: 'high',
      },
      {
        id: '2',
        type: 'offer',
        title: 'MEGA PIZZA SALE - 50% OFF!',
        message: 'Get 50% off on all pizzas at Pizza Palace. Valid till midnight today! Limited time offer.',
        timestamp: '1 hour ago',
        isRead: false,
        actionUrl: '/restaurant/pizza-palace',
        priority: 'high',
      },
      {
        id: '3',
        type: 'promotion',
        title: 'Free Delivery Weekend!',
        message: 'Enjoy free delivery on all orders above ₹199 this weekend. No hidden charges!',
        timestamp: '3 hours ago',
        isRead: false,
        priority: 'medium',
      },
      {
        id: '4',
        type: 'restaurant',
        title: 'New Restaurant: Chinese Wok',
        message: 'Chinese Wok is now available in your area. Try their authentic Chinese cuisine with special launch offers!',
        timestamp: '1 day ago',
        isRead: true,
        actionUrl: '/restaurant/chinese-wok',
        priority: 'medium',
      },
      {
        id: '5',
        type: 'system',
        title: 'App Update Available',
        message: 'A new version of oneQlick is available with exciting features and performance improvements!',
        timestamp: '2 days ago',
        isRead: true,
        priority: 'low',
      },
      {
        id: '6',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order from Dosa Corner has been confirmed and the restaurant is preparing your food.',
        timestamp: '2 days ago',
        isRead: true,
        actionUrl: '/order-tracking',
        priority: 'medium',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadNotifications();
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All Read',
          onPress: () => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'truck-delivery';
      case 'offer':
        return 'sale';
      case 'promotion':
        return 'gift';
      case 'restaurant':
        return 'storefront';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return '#4CAF50';
      case 'offer':
        return '#FF9800';
      case 'promotion':
        return '#2196F3';
      case 'restaurant':
        return '#9C27B0';
      case 'system':
        return '#607D8B';
      default:
        return '#666';
    }
  };

  const getNotificationTypeText = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'Order Update';
      case 'offer':
        return 'Special Offer';
      case 'promotion':
        return 'Promotion';
      case 'restaurant':
        return 'New Restaurant';
      case 'system':
        return 'System Update';
      default:
        return 'Notification';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#FF5722';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'order':
        return notifications.filter(n => n.type === 'order');
      case 'offer':
        return notifications.filter(n => n.type === 'offer');
      default:
        return notifications;
    }
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, icon: string) => (
    <Pressable
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <MaterialCommunityIcons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderNotification = (notification: Notification) => (
    <Pressable
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      {/* Priority Indicator */}
      {notification.priority && (
        <View style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(notification.priority) }
        ]} />
      )}

      {/* Main Content */}
      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(notification.type) + '20' }
        ]}>
          <MaterialCommunityIcons
            name={getNotificationIcon(notification.type) as any}
              size={24}
              color={getNotificationColor(notification.type)}
            />
          </View>
          
        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {notification.title}
              </Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
          
          {/* Type Badge */}
          <View style={[
            styles.typeBadge,
                  { backgroundColor: getNotificationColor(notification.type) }
          ]}>
            <Text style={styles.typeText}>
                {getNotificationTypeText(notification.type)}
            </Text>
            </View>
            
          {/* Message */}
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            
          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.timestamp}>
              {notification.timestamp}
            </Text>
            {notification.actionUrl && (
              <View style={styles.actionHint}>
                <Text style={styles.actionText}>Tap to view</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#FF6B35" />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const filteredNotifications = getFilteredNotifications();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.backButton}
          onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
          </Pressable>
          <View>
        <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCountText}>
                {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <MaterialCommunityIcons name="check-all" size={18} color="#FF6B35" />
              <Text style={styles.markAllText}>Mark all read</Text>
            </Pressable>
          )}
        </View>
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {renderFilterButton('all', 'All', 'view-list')}
          {renderFilterButton('unread', 'Unread', 'bell-ring')}
          {renderFilterButton('order', 'Orders', 'truck-delivery')}
          {renderFilterButton('offer', 'Offers', 'sale')}
        </ScrollView>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {filteredNotifications.map(renderNotification)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="bell-sleep" size={48} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'all' ? 'No Notifications' : `No ${selectedFilter} notifications`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? "You're all caught up! Check back later for new updates."
                : `No ${selectedFilter} notifications found. Try a different filter.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  unreadCountText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  markAllText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 22,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginLeft: 8,
    marginTop: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

