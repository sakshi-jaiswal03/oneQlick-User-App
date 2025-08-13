import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Button, Chip, Surface, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
  estimatedDelivery: string;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const router = useRouter();

  useEffect(() => {
    // Mock data - replace with actual API call
    setOrders([
      {
        id: '1',
        restaurantName: 'Spice Garden',
        items: ['Butter Chicken', 'Naan', 'Dal Makhani'],
        total: 450,
        status: 'out_for_delivery',
        orderDate: '2024-01-15',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra',
        estimatedDelivery: '25-30 min',
      },
      {
        id: '2',
        restaurantName: 'Pizza Palace',
        items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
        total: 380,
        status: 'preparing',
        orderDate: '2024-01-15',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra',
        estimatedDelivery: '40-50 min',
      },
      {
        id: '3',
        restaurantName: 'Biryani House',
        items: ['Chicken Biryani', 'Raita', 'Salad'],
        total: 320,
        status: 'delivered',
        orderDate: '2024-01-14',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra',
        estimatedDelivery: 'Delivered',
      },
      {
        id: '4',
        restaurantName: 'Chinese Wok',
        items: ['Fried Rice', 'Manchurian', 'Soup'],
        total: 280,
        status: 'delivered',
        orderDate: '2024-01-13',
        deliveryAddress: '123 Main St, Mumbai, Maharashtra',
        estimatedDelivery: 'Delivered',
      },
    ]);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#2196F3';
      case 'preparing':
        return '#9C27B0';
      case 'out_for_delivery':
        return '#FF6B35';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'confirmed':
        return 'check-circle';
      case 'preparing':
        return 'restaurant';
      case 'out_for_delivery':
        return 'delivery-dining';
      case 'delivered':
        return 'done-all';
      case 'cancelled':
        return 'cancel';
      default:
        return 'info';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'current') {
      return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
    } else {
      return ['delivered', 'cancelled'].includes(order.status);
    }
  });

  const renderOrder = ({ item }: { item: Order }) => (
    <Card style={styles.orderCard} mode="outlined">
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text variant="titleMedium" style={styles.restaurantName}>
            {item.restaurantName}
          </Text>
          <Chip
            mode="flat"
            textStyle={{ color: 'white' }}
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <View style={styles.orderItems}>
          <Text variant="bodyMedium" style={styles.itemsText}>
            {item.items.join(', ')}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.estimatedDelivery}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.deliveryAddress}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="receipt" size={16} color="#666" />
            <Text style={styles.detailText}>
              ₹{item.total}
            </Text>
          </View>
        </View>

        <View style={styles.orderActions}>
          {item.status === 'out_for_delivery' && (
            <Button
              mode="contained"
              onPress={() => router.push('/order-tracking')}
              style={styles.trackButton}
              icon="location-on"
            >
              Track Order
            </Button>
          )}
          {item.status === 'delivered' && (
            <Button
              mode="outlined"
              onPress={() => {/* TODO: Implement reorder */}}
              style={styles.reorderButton}
              icon="refresh"
            >
              Reorder
            </Button>
          )}
          <Button
            mode="text"
            onPress={() => {/* TODO: Show order details */}}
            icon="visibility"
          >
            View Details
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'current' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('current')}
          style={[
            styles.tabButton,
            activeTab === 'current' && styles.activeTabButton
          ]}
        >
          Current Orders
        </Button>
        <Button
          mode={activeTab === 'past' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('past')}
          style={[
            styles.tabButton,
            activeTab === 'past' && styles.activeTabButton
          ]}
        >
          Past Orders
        </Button>
      </View>

      {/* Orders List */}
      <View style={styles.ordersContainer}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons 
              name={activeTab === 'current' ? 'receipt' : 'history'} 
              size={64} 
              color="#ccc" 
            />
            <Text style={styles.emptyStateText}>
              {activeTab === 'current' 
                ? 'No active orders' 
                : 'No past orders'
              }
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === 'current'
                ? 'Start ordering delicious food!'
                : 'Your order history will appear here'
              }
            </Text>
            {activeTab === 'current' && (
              <Button
                mode="contained"
                onPress={() => router.push('/(tabs)/home')}
                style={styles.orderNowButton}
                icon="restaurant"
              >
                Order Now
              </Button>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrder}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#FF6B35',
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsText: {
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackButton: {
    backgroundColor: '#FF6B35',
  },
  reorderButton: {
    borderColor: '#FF6B35',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  orderNowButton: {
    backgroundColor: '#FF6B35',
  },
}); 