import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Animated,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
  Divider,
  Searchbar,
  Menu,
  ActivityIndicator,
  Badge,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  orderHistoryData,
  getOrderStatusColor,
  getOrderStatusIcon,
  formatOrderDate,
  formatOrderTime,
  getOrderItemsSummary,
  OrderHistoryItem,
} from './orderHistoryData';

const { width } = Dimensions.get('window');

type TabType = 'active' | 'past' | 'cancelled';

export default function OrderHistoryScreen() {
  const router = useRouter();
  
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderHistoryItem[]>([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Load initial data
    filterOrders();
  }, [activeTab, searchQuery, selectedDateRange]);

  const startAnimations = () => {
    // Tab indicator animation
    const tabIndex = activeTab === 'active' ? 0 : activeTab === 'past' ? 1 : 2;
    Animated.spring(tabIndicatorAnim, { 
      toValue: tabIndex, 
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    
    // Content fade animation
    Animated.sequence([
      Animated.timing(contentAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const filterOrders = () => {
    let orders: OrderHistoryItem[] = [];
    
    // Get orders based on active tab
    switch (activeTab) {
      case 'active':
        orders = orderHistoryData.activeOrders;
        break;
      case 'past':
        orders = orderHistoryData.pastOrders;
        break;
      case 'cancelled':
        orders = orderHistoryData.cancelledOrders;
        break;
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      orders = orders.filter(order =>
        order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply date filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      orders = orders.filter(order => new Date(order.orderDate) >= filterDate);
    }
    
    setFilteredOrders(orders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      filterOrders();
      setRefreshing(false);
    }, 1000);
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleOrderPress = (order: OrderHistoryItem) => {
    // Navigate to order details
    router.push('/order-confirmation');
  };

  const handleTrackOrder = (order: OrderHistoryItem) => {
    // Navigate to order tracking
    router.push('/order-tracking');
  };

  const handleReorder = (order: OrderHistoryItem) => {
    Alert.alert(
      'Reorder',
      `Add items from ${order.restaurantName} to cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Cart', 
          onPress: () => {
            // TODO: Implement add to cart functionality
            Alert.alert('Success', 'Items added to cart!');
          }
        },
      ]
    );
  };

  const handleRateOrder = (order: OrderHistoryItem) => {
    Alert.alert(
      'Rate Order',
      `Rate your experience with ${order.restaurantName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => {
            // TODO: Navigate to rating screen
            Alert.alert('Rating', 'Rating feature coming soon!');
          }
        },
      ]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDateFilterChange = (range: string) => {
    setSelectedDateRange(range);
    setShowDateFilter(false);
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <View style={styles.tabContainer}>
        {(['active', 'past', 'cancelled'] as TabType[]).map((tab, index) => {
          const isActive = activeTab === tab;
          const orderCount = tab === 'active' ? orderHistoryData.activeOrders.length :
                           tab === 'past' ? orderHistoryData.pastOrders.length :
                           orderHistoryData.cancelledOrders.length;
          
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab === 'active' ? 'Active' : tab === 'past' ? 'Past' : 'Cancelled'}
              </Text>
              <Badge
                size={20}
                style={[styles.tabBadge, isActive && styles.activeTabBadge]}
              >
                {orderCount}
              </Badge>
            </Pressable>
          );
        })}
      </View>
      
      {/* Animated tab indicator */}
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            transform: [{
              translateX: tabIndicatorAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, width / 3, (width / 3) * 2],
              }),
            }],
          },
        ]}
      />
    </View>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <Searchbar
        placeholder="Search orders by restaurant, items, or order number..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />
      
      <Menu
        visible={showDateFilter}
        onDismiss={() => setShowDateFilter(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setShowDateFilter(true)}
            icon="calendar-today"
            compact
          >
            {selectedDateRange === 'all' ? 'All Time' :
             selectedDateRange === 'today' ? 'Today' :
             selectedDateRange === 'week' ? 'This Week' :
             selectedDateRange === 'month' ? 'This Month' : 'Last 3 Months'}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => handleDateFilterChange('all')}
          title="All Time"
          leadingIcon="all-inclusive"
        />
        <Menu.Item
          onPress={() => handleDateFilterChange('today')}
          title="Today"
          leadingIcon="today"
        />
        <Menu.Item
          onPress={() => handleDateFilterChange('week')}
          title="This Week"
          leadingIcon="view-week"
        />
        <Menu.Item
          onPress={() => handleDateFilterChange('month')}
          title="This Month"
          leadingIcon="calendar-month"
        />
        <Menu.Item
          onPress={() => handleDateFilterChange('3months')}
          title="Last 3 Months"
          leadingIcon="calendar-view-month"
        />
      </Menu>
    </View>
  );

  const renderOrderCard = ({ item }: { item: OrderHistoryItem }) => (
    <Pressable
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <Surface style={styles.orderSurface}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantImage}>
              <MaterialIcons name="restaurant" size={32} color="#666" />
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{item.restaurantName}</Text>
              <Text style={styles.orderNumber}>{item.orderNumber}</Text>
              <Text style={styles.orderDate}>
                {formatOrderDate(item.orderDate)} • {formatOrderTime(item.orderDate)}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <Chip
              mode="flat"
              textStyle={{ color: 'white' }}
              style={[styles.statusChip, { backgroundColor: getOrderStatusColor(item.orderStatus) }]}
              icon={getOrderStatusIcon(item.orderStatus)}
            >
              {item.orderStatus}
            </Chip>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Order Items Summary */}
        <View style={styles.orderItemsSummary}>
          <Text style={styles.itemsSummaryText}>
            {getOrderItemsSummary(item.orderItems)}
          </Text>
          <Text style={styles.itemCount}>
            {item.orderItems.length} item{item.orderItems.length > 1 ? 's' : ''}
          </Text>
        </View>
        
        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.detailValue}>₹{item.totalAmount.toFixed(2)}</Text>
          </View>
          
          {item.deliveryFee > 0 && (
            <View style={styles.orderDetailRow}>
              <Text style={styles.detailLabel}>Delivery Fee:</Text>
              <Text style={styles.detailValue}>₹{item.deliveryFee}</Text>
            </View>
          )}
          
          {item.estimatedDeliveryTime && (
            <View style={styles.orderDetailRow}>
              <Text style={styles.detailLabel}>Estimated Delivery:</Text>
              <Text style={styles.detailValue}>{item.estimatedDeliveryTime}</Text>
            </View>
          )}
          
          {item.actualDeliveryTime && (
            <View style={styles.orderDetailRow}>
              <Text style={styles.detailLabel}>Delivered At:</Text>
              <Text style={styles.detailValue}>{item.actualDeliveryTime}</Text>
            </View>
          )}
          
          {item.cancellationReason && (
            <View style={styles.cancellationReason}>
              <Text style={styles.cancellationLabel}>Cancellation Reason:</Text>
              <Text style={styles.cancellationText}>{item.cancellationReason}</Text>
            </View>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {item.canTrack && (
            <Button
              mode="outlined"
              onPress={() => handleTrackOrder(item)}
              icon="location-on"
              style={styles.actionButton}
              compact
            >
              Track Order
            </Button>
          )}
          
          {item.canReorder && (
            <Button
              mode="outlined"
              onPress={() => handleReorder(item)}
              icon="refresh"
              style={styles.actionButton}
              compact
            >
              Reorder
            </Button>
          )}
          
          {item.canRate && (
            <Button
              mode="outlined"
              onPress={() => handleRateOrder(item)}
              icon="star"
              style={styles.actionButton}
              compact
            >
              Rate Order
            </Button>
          )}
          
          {item.isRated && item.rating && (
            <View style={styles.ratingDisplay}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}/5</Text>
            </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons 
        name={activeTab === 'active' ? 'schedule' : activeTab === 'past' ? 'history' : 'cancel'} 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'active' ? 'No Active Orders' : 
         activeTab === 'past' ? 'No Past Orders' : 'No Cancelled Orders'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'active' ? 'Your active orders will appear here' : 
         activeTab === 'past' ? 'Your order history will appear here' : 'Your cancelled orders will appear here'}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (filteredOrders.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <IconButton
          icon="help-outline"
          size={24}
          iconColor="#666"
          onPress={() => Alert.alert('Help', 'Order history help coming soon!')}
        />
      </View>
      
      {/* Tab Navigation */}
      {renderTabBar()}
      
      {/* Search and Filters */}
      {renderSearchAndFilters()}
      
      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentAnim }]}>
        {renderContent()}
      </Animated.View>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Tab Bar Styles
  tabBar: {
    backgroundColor: 'white',
    elevation: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#ddd',
  },
  activeTabBadge: {
    backgroundColor: '#FF6B35',
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: width / 3,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  
  // Search and Filters Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    elevation: 0,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Order Card Styles
  orderCard: {
    marginBottom: 16,
  },
  orderSurface: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  
  // Order Header Styles
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusChip: {
    borderRadius: 12,
  },
  
  // Divider Styles
  divider: {
    marginVertical: 16,
    backgroundColor: '#f0f0f0',
  },
  
  // Order Items Summary Styles
  orderItemsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsSummaryText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Order Details Styles
  orderDetails: {
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  cancellationReason: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  cancellationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e65100',
    marginBottom: 4,
  },
  cancellationText: {
    fontSize: 14,
    color: '#bf360c',
    lineHeight: 20,
  },
  
  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    borderColor: '#FF6B35',
    borderRadius: 20,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
    marginLeft: 4,
  },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
}); 