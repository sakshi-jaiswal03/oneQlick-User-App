import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Chip,
  Divider,
  Badge,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'order' | 'offer' | 'promotion' | 'system' | 'restaurant';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  image?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order Delivered!',
        message: 'Your order from Spice Garden has been delivered successfully. Enjoy your meal!',
        timestamp: '2 minutes ago',
        isRead: false,
        actionUrl: '/order-tracking',
      },
      {
        id: '2',
        type: 'offer',
        title: '50% OFF on Pizza!',
        message: 'Get 50% off on all pizzas at Pizza Palace. Valid till midnight!',
        timestamp: '1 hour ago',
        isRead: false,
        actionUrl: '/restaurant/pizza-palace',
      },
      {
        id: '3',
        type: 'promotion',
        title: 'Free Delivery!',
        message: 'Free delivery on orders above ₹199. Limited time offer!',
        timestamp: '3 hours ago',
        isRead: true,
      },
      {
        id: '4',
        type: 'restaurant',
        title: 'New Restaurant Added!',
        message: 'Chinese Wok is now available in your area. Try their delicious Chinese cuisine!',
        timestamp: '1 day ago',
        isRead: true,
        actionUrl: '/restaurant/chinese-wok',
      },
      {
        id: '5',
        type: 'system',
        title: 'App Update Available',
        message: 'A new version of oneQlick is available. Update now for better experience!',
        timestamp: '2 days ago',
        isRead: true,
      },
      {
        id: '6',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order from Dosa Corner has been confirmed and is being prepared.',
        timestamp: '2 days ago',
        isRead: true,
        actionUrl: '/order-tracking',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      // Mark as read
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    }

    if (notification.actionUrl) {
      // Navigate to the action URL
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
        return 'local-shipping';
      case 'offer':
        return 'local-offer';
      case 'promotion':
        return 'campaign';
      case 'restaurant':
        return 'restaurant';
      case 'system':
        return 'info';
      default:
        return 'notifications';
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
        return 'Order';
      case 'offer':
        return 'Offer';
      case 'promotion':
        return 'Promotion';
      case 'restaurant':
        return 'Restaurant';
      case 'system':
        return 'System';
      default:
        return 'Notification';
    }
  };

  const renderNotification = (notification: Notification) => (
    <Pressable
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <Surface style={styles.notificationSurface}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <MaterialIcons
              name={getNotificationIcon(notification.type)}
              size={24}
              color={getNotificationColor(notification.type)}
            />
          </View>
          
          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {notification.title}
              </Text>
              <Chip
                mode="flat"
                textStyle={{ color: 'white', fontSize: 10 }}
                style={[
                  styles.typeChip,
                  { backgroundColor: getNotificationColor(notification.type) }
                ]}
                compact
              >
                {getNotificationTypeText(notification.type)}
              </Chip>
            </View>
            
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            
            <Text style={styles.notificationTimestamp}>
              {notification.timestamp}
            </Text>
          </View>
          
          {!notification.isRead && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </Surface>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={() => <MaterialIcons name="arrow-back" size={24} color="#333" />}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <Pressable onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </Pressable>
          )}
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {notifications.map(renderNotification)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! Check back later for new updates.
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationsList: {
    gap: 12,
  },
  notificationItem: {
    marginBottom: 8,
  },
  unreadNotification: {
    opacity: 1,
  },
  notificationSurface: {
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    padding: 16,
    position: 'relative',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  typeChip: {
    height: 20,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
