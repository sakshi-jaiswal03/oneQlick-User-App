import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  Alert,
  Dimensions,
  Linking,
  Share,
  Clipboard,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Divider,
  Chip,
  ProgressBar,
  Badge,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  sampleOrderTracking,
  orderStatusSteps,
} from './orderTrackingData';
import MapComponent from './MapComponent';

const { width, height } = Dimensions.get('window');

export default function OrderTrackingScreen() {
  const router = useRouter();
  
  // State management
  const [orderData, setOrderData] = useState(sampleOrderTracking);
  const [deliveryCountdown, setDeliveryCountdown] = useState(
    (sampleOrderTracking.estimatedDeliveryMinutes || 30) * 60
  );
  const [showMap, setShowMap] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  // Animation values
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const mapScaleAnim = useRef(new Animated.Value(0.8)).current;
  const notificationSlideAnim = useRef(new Animated.Value(100)).current;
  const countdownPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setDeliveryCountdown((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      simulateRealTimeUpdates();
    }, 30000); // Update every 30 seconds

    // Countdown pulse animation
    const pulseInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(countdownPulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
        Animated.timing(countdownPulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 10000); // Pulse every 10 seconds

    return () => {
      clearInterval(countdownInterval);
      clearInterval(updateInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  const startAnimations = () => {
    // Header slide animation
    Animated.timing(headerSlideAnim, { toValue: 0, duration: 800, useNativeDriver: true }).start();
    
    // Progress bar animation
    Animated.timing(progressAnim, { toValue: orderData.currentStep / orderData.totalSteps, duration: 1000, useNativeDriver: false }).start();
    
    // Map scale animation
    Animated.spring(mapScaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const simulateRealTimeUpdates = () => {
    // Simulate delivery partner location updates
    if (orderData.deliveryPartner) {
      setOrderData(prev => ({
        ...prev,
        deliveryPartner: prev.deliveryPartner ? {
          ...prev.deliveryPartner,
          currentLocation: {
            ...prev.deliveryPartner.currentLocation,
            latitude: prev.deliveryPartner.currentLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: prev.deliveryPartner.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
            lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          },
        } : undefined,
      }));
    }
  };

  const formatCountdown = (seconds: number) => {
    // Validate input to prevent NaN
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    // Validate data to prevent NaN
    if (!orderData.estimatedDeliveryMinutes || orderData.estimatedDeliveryMinutes <= 0) {
      return 0;
    }
    
    const totalTime = orderData.estimatedDeliveryMinutes * 60;
    const elapsed = totalTime - deliveryCountdown;
    const progress = Math.min(elapsed / totalTime, 1);
    
    // Ensure progress is a valid number
    return isNaN(progress) ? 0 : progress;
  };

  const handleCallRestaurant = () => {
    Linking.openURL(`tel:${orderData.restaurantContact.phone}`);
  };

  const handleCallDeliveryPartner = () => {
    if (orderData.deliveryPartner) {
      Linking.openURL(`tel:${orderData.deliveryPartner.phone}`);
    }
  };

  const handleMessageDeliveryPartner = () => {
    if (orderData.deliveryPartner) {
      const message = `Hi ${orderData.deliveryPartner.name}, I have a question about my order #${orderData.orderId}`;
      Linking.openURL(`sms:${orderData.deliveryPartner.phone}&body=${encodeURIComponent(message)}`);
    }
  };

  const handleShareTracking = async () => {
    try {
      await Share.share({
        title: 'Track My Order',
        message: `Track my oneQlick order #${orderData.orderId} in real-time! Estimated delivery in ${orderData.estimatedDeliveryTime}.`,
        url: `https://oneqlick.app/track/${orderData.orderId}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share tracking link');
    }
  };

  const handleCopyOrderId = async () => {
    try {
      await Clipboard.setString(orderData.orderId);
      Alert.alert('Copied!', 'Order ID copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy order ID');
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No, Keep Order', style: 'cancel' },
        { 
          text: 'Yes, Cancel Order', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Order Cancelled', 'Your order has been cancelled. You will receive a refund within 3-5 business days.');
          }
        },
      ]
    );
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { transform: [{ translateY: headerSlideAnim }] }]}>
      <View style={styles.headerTop}>
        <IconButton
          icon="keyboard-arrow-left"
          size={24}
          iconColor="white"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <IconButton
          icon="share"
          size={24}
          iconColor="white"
          onPress={handleShareTracking}
        />
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>{orderData.orderNumber}</Text>
        <Text style={styles.currentStatus}>{orderData.currentStatus}</Text>
        <Text style={styles.estimatedTime}>
          Estimated delivery in {orderData.estimatedDeliveryTime}
        </Text>
      </View>
    </Animated.View>
  );

  const renderProgressBar = () => (
    <Surface style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Order Progress</Text>
        <Text style={styles.progressStep}>
          Step {orderData.currentStep} of {orderData.totalSteps}
        </Text>
      </View>
      
      <ProgressBar
        progress={getProgressValue()}
        color="#4CAF50"
        style={styles.progressBar}
      />
      
      <View style={styles.progressSteps}>
        {orderStatusSteps.map((step, index) => (
          <View key={step.id} style={styles.progressStepItem}>
            <View
              style={[
                styles.progressStepIcon,
                {
                  backgroundColor:
                    index < orderData.currentStep
                      ? '#4CAF50'
                      : index === orderData.currentStep
                      ? '#FF9800'
                      : '#E0E0E0',
                },
              ]}
            >
              <Text style={styles.progressStepIconText}>{step.icon}</Text>
            </View>
            <Text style={styles.progressStepTitle}>{step.title}</Text>
          </View>
        ))}
      </View>
    </Surface>
  );

  const renderCountdownTimer = () => (
    <Surface style={styles.countdownCard}>
      <View style={styles.countdownHeader}>
        <MaterialIcons name="timer" size={24} color="#FF6B35" />
        <Text style={styles.countdownTitle}>Delivery Countdown</Text>
      </View>
      
      <Animated.View style={[styles.countdownDisplay, { transform: [{ scale: countdownPulseAnim }] }]}>
        <Text style={styles.countdownTime}>
          {formatCountdown(deliveryCountdown)}
        </Text>
        <Text style={styles.countdownLabel}>remaining</Text>
      </Animated.View>
      
      <Text style={styles.countdownStatus}>
        {deliveryCountdown > 0 && !isNaN(deliveryCountdown)
          ? 'Your order is being prepared with care' 
          : 'Order delivered! Enjoy your meal!'
        }
      </Text>
    </Surface>
  );

  const renderMapSection = () => {
    // Debug logging
    console.log('Rendering map section with data:', {
      restaurant: orderData.restaurant,
      deliveryAddress: orderData.deliveryAddress,
      deliveryPartner: orderData.deliveryPartner,
      routeCoordinates: orderData.mapData?.routeCoordinates,
      showMap
    });

    // Ensure we have valid data before rendering
    if (!orderData.restaurant || !orderData.deliveryAddress) {
      console.log('Map data missing, showing error state');
      return (
        <Surface style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Live Tracking</Text>
          </View>
          <View style={styles.mapError}>
            <MaterialIcons name="error" size={48} color="#ccc" />
            <Text style={styles.mapErrorText}>Map data unavailable</Text>
            <Text style={styles.mapErrorSubtext}>
              Restaurant: {orderData.restaurant ? '✓' : '✗'}, 
              Address: {orderData.deliveryAddress ? '✓' : '✗'}
            </Text>
          </View>
        </Surface>
      );
    }

    console.log('Rendering map component with valid data');
    return (
      <Surface style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Live Tracking</Text>
          <View style={styles.mapControls}>
            <IconButton
              icon={showMap ? "visibility-off" : "visibility"}
              size={20}
              iconColor="#666"
              onPress={() => setShowMap(!showMap)}
            />
            <IconButton
              icon="my-location"
              size={20}
              iconColor="#666"
              onPress={() => {/* TODO: Center map on user location */}}
            />
          </View>
        </View>
        
        <MapComponent
          restaurant={orderData.restaurant}
          deliveryAddress={orderData.deliveryAddress}
          deliveryPartner={orderData.deliveryPartner}
          routeCoordinates={orderData.mapData?.routeCoordinates || []}
          showMap={showMap}
        />
        
        {/* Fallback map display in case MapComponent fails */}
        {showMap && (
          <View style={styles.fallbackMap}>
            <View style={styles.mapMarkers}>
              <View style={styles.mapMarker}>
                <MaterialIcons name="restaurant" size={20} color="#FF6B35" />
                <Text style={styles.mapMarkerText}>Restaurant</Text>
              </View>
              
              {orderData.deliveryPartner && (
                <View style={styles.mapMarker}>
                  <MaterialIcons name="delivery-dining" size={20} color="#4CAF50" />
                  <Text style={styles.mapMarkerText}>Delivery Partner</Text>
                </View>
              )}
              
              <View style={styles.mapMarker}>
                <MaterialIcons name="home" size={20} color="#2196F3" />
                <Text style={styles.mapMarkerText}>Your Location</Text>
              </View>
            </View>
          </View>
        )}
      </Surface>
    );
  };

  const renderDeliveryPartner = () => {
    if (!orderData.deliveryPartner) return null;
    
    return (
      <Surface style={styles.deliveryPartnerCard}>
        <View style={styles.deliveryPartnerHeader}>
          <MaterialIcons name="delivery-dining" size={24} color="#4CAF50" />
          <Text style={styles.deliveryPartnerTitle}>Delivery Partner</Text>
          <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#4CAF50' }}>
            Assigned
          </Chip>
        </View>
        
        <View style={styles.deliveryPartnerInfo}>
          <View style={styles.partnerDetails}>
            <Text style={styles.partnerName}>{orderData.deliveryPartner.name}</Text>
            <View style={styles.partnerRating}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {orderData.deliveryPartner.rating} ({orderData.deliveryPartner.totalDeliveries} deliveries)
              </Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {orderData.deliveryPartner.vehicle.type} • {orderData.deliveryPartner.vehicle.color} • {orderData.deliveryPartner.vehicle.number}
            </Text>
            <Text style={styles.estimatedArrival}>
              Estimated arrival: {orderData.deliveryPartner.estimatedArrival}
            </Text>
          </View>
          
          <View style={styles.partnerActions}>
            <Button
              mode="contained"
              onPress={handleCallDeliveryPartner}
              style={styles.callButton}
              icon="phone"
              compact
            >
              Call
            </Button>
            <Button
              mode="outlined"
              onPress={handleMessageDeliveryPartner}
              style={styles.messageButton}
              icon="message"
              compact
            >
              Message
            </Button>
          </View>
        </View>
        
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.locationText}>
            Last updated: {orderData.deliveryPartner.currentLocation.lastUpdated}
          </Text>
        </View>
      </Surface>
    );
  };

  const renderOrderTimeline = () => (
    <Surface style={styles.timelineCard}>
      <View style={styles.timelineHeader}>
        <MaterialIcons name="schedule" size={24} color="#FF6B35" />
        <Text style={styles.timelineTitle}>Order Timeline</Text>
      </View>
      
      <View style={styles.timelineContainer}>
        {orderData.timeline.map((item, index) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <View
                style={[
                  styles.timelineIcon,
                  {
                    backgroundColor:
                      item.status === 'completed'
                        ? '#4CAF50'
                        : item.status === 'current'
                        ? '#FF9800'
                        : '#E0E0E0',
                  },
                ]}
              >
                <Text style={styles.timelineIconText}>{item.icon}</Text>
              </View>
              {index < orderData.timeline.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor:
                        item.status === 'completed'
                          ? '#4CAF50'
                          : '#E0E0E0',
                    },
                  ]}
                />
              )}
            </View>
            
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeaderRow}>
                <Text style={styles.timelineItemTitle}>{item.title}</Text>
                <Text style={styles.timelineTime}>{item.timestamp}</Text>
              </View>
              <Text style={styles.timelineDescription}>{item.description}</Text>
              {item.details && (
                <Text style={styles.timelineDetails}>{item.details}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </Surface>
  );

  const renderNotifications = () => (
    <Surface style={styles.notificationsCard}>
      <View style={styles.notificationsHeader}>
        <MaterialIcons name="notifications" size={24} color="#FF6B35" />
        <Text style={styles.notificationsTitle}>Recent Updates</Text>
        <IconButton
          icon={showNotifications ? "expand-less" : "expand-more"}
          size={20}
          iconColor="#666"
          onPress={() => setShowNotifications(!showNotifications)}
        />
      </View>
      
      {showNotifications && (
        <View style={styles.notificationsList}>
          {orderData.notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationIcon}>
                <MaterialIcons
                  name={
                    notification.type === 'status_update'
                      ? 'update'
                      : notification.type === 'delivery_update'
                      ? 'delivery-dining'
                      : 'info'
                  }
                  size={20}
                  color="#FF6B35"
                />
                {!notification.read && (
                  <View style={styles.unreadDot} />
                )}
              </View>
              
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Surface>
  );

  const renderOrderSummary = () => (
    <Surface style={styles.orderSummaryCard}>
      <View style={styles.orderSummaryHeader}>
        <MaterialIcons name="receipt" size={24} color="#FF6B35" />
        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
        <IconButton
          icon={showOrderSummary ? "expand-less" : "expand-more"}
          size={20}
          iconColor="#666"
          onPress={() => setShowOrderSummary(!showOrderSummary)}
        />
      </View>
      
      {showOrderSummary && (
        <View style={styles.orderSummaryContent}>
          {orderData.orderSummary.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          
          <Divider style={styles.divider} />
          
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{orderData.orderSummary.total.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </Surface>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <Button
        mode="contained"
        onPress={handleCallRestaurant}
        style={styles.callRestaurantButton}
        icon="phone"
        contentStyle={styles.buttonContent}
      >
        Call Restaurant
      </Button>
      
      <Button
        mode="outlined"
        onPress={handleCancelOrder}
        style={styles.cancelOrderButton}
        icon="cancel"
        contentStyle={styles.buttonContent}
        textColor="#d32f2f"
      >
        Cancel Order
      </Button>
    </View>
  );

  const renderFloatingActions = () => (
    <View style={styles.floatingActionsContainer}>
      <View style={styles.floatingActions}>
        <Button
          mode="contained"
          onPress={handleCallRestaurant}
          style={styles.floatingCallButton}
          icon="phone"
          compact
        >
          Restaurant
        </Button>
        
        {orderData.deliveryPartner && (
          <Button
            mode="contained"
            onPress={handleCallDeliveryPartner}
            style={styles.floatingPartnerButton}
            icon="delivery-dining"
            compact
          >
            Partner
          </Button>
        )}
        
        <Button
          mode="contained"
          onPress={handleShareTracking}
          style={styles.floatingShareButton}
          icon="share"
          compact
        >
          Share
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Countdown Timer */}
        {renderCountdownTimer()}
        
        {/* Map Section */}
        {renderMapSection()}
        
        {/* Delivery Partner */}
        {renderDeliveryPartner()}
        
        {/* Order Timeline */}
        {renderOrderTimeline()}
        
        {/* Notifications */}
        {renderNotifications()}
        
        {/* Order Summary */}
        {renderOrderSummary()}
        
        {/* Action Buttons */}
        {renderActionButtons()}
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Floating Action Buttons */}
      {renderFloatingActions()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  orderInfo: {
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  currentStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  estimatedTime: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  
  // Progress Card Styles
  progressCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressStep: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStepItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressStepIconText: {
    fontSize: 18,
  },
  progressStepTitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Countdown Card Styles
  countdownCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  countdownDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  countdownStatus: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Map Card Styles
  mapCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mapControls: {
    flexDirection: 'row',
    gap: 8,
  },
  mapContainer: {
    height: 200,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  mapMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  mapMarker: {
    alignItems: 'center',
  },
  mapMarkerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  mapHidden: {
    padding: 40,
    alignItems: 'center',
  },
  mapHiddenText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  mapError: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapErrorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  mapErrorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Delivery Partner Card Styles
  deliveryPartnerCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  deliveryPartnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryPartnerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  deliveryPartnerInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  partnerDetails: {
    flex: 1,
    marginRight: 16,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  estimatedArrival: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  partnerActions: {
    gap: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  messageButton: {
    borderColor: '#2196F3',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  
  // Timeline Card Styles
  timelineCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  timelineContainer: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timelineIconText: {
    fontSize: 20,
  },
  timelineLine: {
    width: 2,
    height: 30,
    borderRadius: 1,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timelineTime: {
    fontSize: 12,
    color: '#999',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  timelineDetails: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  
  // Notifications Card Styles
  notificationsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  notificationsList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  
  // Order Summary Card Styles
  orderSummaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  orderSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  orderSummaryContent: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  divider: {
    marginVertical: 16,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  
  // Action Buttons Styles
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    margin: 16,
    marginTop: 0,
  },
  callRestaurantButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  cancelOrderButton: {
    flex: 1,
    borderColor: '#d32f2f',
  },
  buttonContent: {
    paddingVertical: 8,
  },

  // Floating Action Buttons Styles
  floatingActionsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  floatingCallButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
  },
  floatingPartnerButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
  },
  floatingShareButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
  },
  fallbackMap: {
    height: 200,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
}); 