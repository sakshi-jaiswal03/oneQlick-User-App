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
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  sampleOrderConfirmation,
  celebrationMessages,
  progressColors,
  socialShareContent,
  pushNotificationSetup,
} from './orderConfirmationData';

const { width, height } = Dimensions.get('window');

export default function OrderConfirmationScreen() {
  const router = useRouter();
  
  // All state hooks must be at the top level
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPushNotificationPrompt, setShowPushNotificationPrompt] = useState(true);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [deliveryCountdown, setDeliveryCountdown] = useState(sampleOrderConfirmation.delivery.estimatedTimeMinutes * 60);
  
  // All refs must be at the top level
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const messageSlideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const celebrationScale = useRef(new Animated.Value(0.8)).current;
  const ratingScale = useRef(new Animated.Value(0)).current;
  const floatingButtonScale = useRef(new Animated.Value(0)).current;
  
  // Create confetti refs array at the top level
  const confettiRefs = useRef(
    Array(40).fill(null).map(() => ({
      translateY: new Animated.Value(-20),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }))
  ).current;

  useEffect(() => {
    // Start celebration animations
    startCelebrationAnimations();
    
    // Rotate through celebration messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % celebrationMessages.length);
    }, 3000);

    // Show rating prompt after 5 seconds
    const ratingTimer = setTimeout(() => {
      setShowRating(true);
      Animated.spring(ratingScale, { toValue: 1, useNativeDriver: true }).start();
    }, 5000);

    // Show floating actions after 3 seconds
    const floatingTimer = setTimeout(() => {
      setShowFloatingActions(true);
      Animated.spring(floatingButtonScale, { toValue: 1, useNativeDriver: true }).start();
    }, 3000);

    // Countdown timer for delivery
    const countdownInterval = setInterval(() => {
      setDeliveryCountdown((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(ratingTimer);
      clearTimeout(floatingTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  const startCelebrationAnimations = () => {
    // Checkmark animation with bounce effect
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(checkmarkScale, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(checkmarkOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.spring(checkmarkScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    // Confetti animation with staggered timing
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(confettiAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]).start(() => setShowConfetti(true));

    // Animate individual confetti pieces
    confettiRefs.forEach((confetti, index) => {
      const delay = index * 50;
      const duration = 3000 + Math.random() * 2000;
      
      // Falling animation
      Animated.sequence([
        Animated.delay(delay + 800), // Start after confetti container appears
        Animated.parallel([
          Animated.timing(confetti.translateY, {
            toValue: height + 50,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.rotation, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(confetti.scale, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(confetti.scale, { toValue: 0.8, duration: duration - 200, useNativeDriver: true }),
          ]),
        ]),
      ]).start();
    });

    // Message slide animation with bounce
    Animated.sequence([
      Animated.delay(1200),
      Animated.spring(messageSlideAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();

    // Progress bar animation with easing
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(progressAnim, { toValue: 0.4, duration: 1200, useNativeDriver: false }),
    ]).start();

    // Card slide animations with staggered timing
    Animated.sequence([
      Animated.delay(1800),
      Animated.timing(cardSlideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Celebration scale animation
    Animated.sequence([
      Animated.delay(2000),
      Animated.spring(celebrationScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    // Success celebration effect
    Animated.sequence([
      Animated.delay(2500),
      Animated.parallel([
        Animated.spring(checkmarkScale, { toValue: 1.1, useNativeDriver: true }),
        Animated.spring(celebrationScale, { toValue: 1.05, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(checkmarkScale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(celebrationScale, { toValue: 1, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleTrackOrder = () => {
    router.push('/order-tracking');
  };

  const handleContinueShopping = () => {
    router.push('/(tabs)/home');
  };

  const handleCallRestaurant = () => {
    Linking.openURL(`tel:${sampleOrderConfirmation.restaurant.phone}`);
  };

  const handleCopyOrderId = async () => {
    try {
      await Clipboard.setString(sampleOrderConfirmation.orderId);
      Alert.alert('Copied!', 'Order ID copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy order ID');
    }
  };

  const handleShareOrder = async () => {
    try {
      await Share.share({
        title: socialShareContent.title,
        message: socialShareContent.message,
        url: socialShareContent.url,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share order');
    }
  };

  const handleEnableNotifications = () => {
    setShowPushNotificationPrompt(false);
    Alert.alert(
      'Notifications Enabled!',
      'You\'ll receive real-time updates about your order',
      [{ text: 'Great!' }]
    );
  };

  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);
    Alert.alert(
      'Thank You!',
      `You rated us ${selectedRating} stars. We appreciate your feedback!`,
      [{ text: 'Awesome!' }]
    );
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    return (
      <Animated.View
        style={[
          styles.confettiContainer,
          { opacity: confettiAnim },
        ]}
      >
        {confettiRefs.map((confetti, index) => {
          // Random confetti properties
          const isCircle = Math.random() > 0.5;
          const size = 6 + Math.random() * 8;
          const colors = ['#FF6B35', '#4ECDC4', '#FFE66D', '#FF6B9D', '#9C27B0', '#FF5722', '#00BCD4', '#8BC34A'];
          const color = colors[index % colors.length];
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  left: Math.random() * width,
                  width: size,
                  height: size,
                  borderRadius: isCircle ? size / 2 : 2,
                  backgroundColor: color,
                  transform: [
                    { translateY: confetti.translateY },
                    { 
                      rotate: confetti.rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '720deg'],
                      })
                    },
                    { scale: confetti.scale },
                  ],
                },
              ]}
            />
          );
        })}
      </Animated.View>
    );
  };

  const renderCelebrationHeader = () => (
    <Animated.View style={[styles.celebrationContainer, { transform: [{ scale: celebrationScale }] }]}>
      {/* Success Checkmark */}
      <Animated.View
        style={[
          styles.checkmarkContainer,
          {
            opacity: checkmarkOpacity,
            transform: [{ scale: checkmarkScale }],
          },
        ]}
      >
        <View style={styles.checkmarkCircle}>
          <MaterialIcons name="check" size={48} color="white" />
        </View>
      </Animated.View>

      {/* Celebration Messages */}
      <Animated.View
        style={[
          styles.messageContainer,
          { transform: [{ translateY: messageSlideAnim }] },
        ]}
      >
        <Text style={styles.celebrationTitle}>
          {celebrationMessages[currentMessageIndex]}
        </Text>
        <Text style={styles.celebrationSubtitle}>
          Order #{sampleOrderConfirmation.orderId}
        </Text>
        <Text style={styles.celebrationTime}>
          Estimated delivery in {sampleOrderConfirmation.delivery.estimatedTime}
        </Text>
      </Animated.View>

      {/* Enhanced Confetti Effect */}
      {renderConfetti()}
    </Animated.View>
  );

  const renderOrderSummary = () => (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardSlideAnim }] },
      ]}
    >
      <Surface style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="receipt" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <IconButton
            icon="content-copy"
            size={20}
            iconColor="#666"
            onPress={handleCopyOrderId}
          />
        </View>
        
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID:</Text>
          <Text style={styles.orderId}>{sampleOrderConfirmation.orderNumber}</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.orderItemsContainer}>
          {sampleOrderConfirmation.orderDetails.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
              
              {item.addOns.length > 0 && (
                <View style={styles.addOnsList}>
                  {item.addOns.map((addOn: any, index: number) => (
                    <Text key={index} style={styles.addOnText}>
                      + {addOn.name} (₹{addOn.price})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{sampleOrderConfirmation.orderDetails.total.toFixed(2)}</Text>
        </View>
      </Surface>
    </Animated.View>
  );

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    const totalTime = sampleOrderConfirmation.delivery.estimatedTimeMinutes * 60;
    const elapsed = totalTime - deliveryCountdown;
    return Math.min(elapsed / totalTime, 1);
  };

  const renderCountdownTimer = () => (
    <View style={styles.countdownContainer}>
      <MaterialIcons name="timer" size={20} color="#FF6B35" />
      <Text style={styles.countdownText}>
        Delivery in: {formatCountdown(deliveryCountdown)}
      </Text>
    </View>
  );

  const renderDeliveryProgress = () => (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardSlideAnim }] },
      ]}
    >
      <Surface style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="access-time" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Delivery Progress</Text>
          <Text style={styles.estimatedTime}>
            {sampleOrderConfirmation.delivery.estimatedTime}
          </Text>
        </View>
        
        {/* Countdown Timer */}
        {renderCountdownTimer()}
        
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={getProgressValue()}
            color={progressColors.current}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {deliveryCountdown > 0 ? 'Preparing your order...' : 'Order delivered!'}
          </Text>
        </View>
        
        <View style={styles.timelineContainer}>
          {sampleOrderConfirmation.timeline.map((step, index) => (
            <View key={step.id} style={styles.timelineStep}>
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIcon,
                    {
                      backgroundColor:
                        step.status === 'completed'
                          ? progressColors.completed
                          : step.status === 'current'
                          ? progressColors.current
                          : progressColors.pending,
                    },
                  ]}
                >
                  <Text style={styles.timelineIconText}>{step.icon}</Text>
                </View>
                {index < sampleOrderConfirmation.timeline.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor:
                          step.status === 'completed'
                            ? progressColors.completed
                            : progressColors.pending,
                      },
                    ]}
                  />
                )}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{step.title}</Text>
                <Text style={styles.timelineDescription}>{step.description}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </Surface>
    </Animated.View>
  );

  const renderRestaurantInfo = () => (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardSlideAnim }] },
      ]}
    >
      <Surface style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="restaurant" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Restaurant Details</Text>
        </View>
        
        <View style={styles.restaurantInfoContainer}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>
              {sampleOrderConfirmation.restaurant.name}
            </Text>
            <View style={styles.restaurantRating}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {sampleOrderConfirmation.restaurant.rating}
              </Text>
            </View>
          </View>
          
          <Text style={styles.restaurantCuisine}>
            {sampleOrderConfirmation.restaurant.cuisine}
          </Text>
          
          <Text style={styles.restaurantAddress}>
            {sampleOrderConfirmation.restaurant.address}
          </Text>
          
          <Text style={styles.restaurantHours}>
            Hours: {sampleOrderConfirmation.restaurant.openingHours}
          </Text>
          
          <View style={styles.restaurantActions}>
            <Button
              mode="outlined"
              onPress={handleCallRestaurant}
              style={styles.callButton}
              icon="phone"
            >
              Call Restaurant
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleShareOrder}
              style={styles.shareButton}
              icon="share"
            >
              Share Order
            </Button>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderDeliveryInfo = () => (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardSlideAnim }] },
      ]}
    >
      <Surface style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="place" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Delivery Details</Text>
        </View>
        
        <View style={styles.deliveryInfoContainer}>
          <View style={styles.deliveryAddressContainer}>
            <MaterialIcons name="home" size={20} color="#666" />
            <View style={styles.deliveryAddressText}>
              <Text style={styles.deliveryAddressLabel}>Delivery Address:</Text>
              <Text style={styles.deliveryAddress}>
                {sampleOrderConfirmation.delivery.address}
              </Text>
            </View>
          </View>
          
          {sampleOrderConfirmation.delivery.deliveryInstructions && (
            <View style={styles.deliveryInstructionsContainer}>
              <MaterialIcons name="info" size={20} color="#666" />
              <Text style={styles.deliveryInstructions}>
                {sampleOrderConfirmation.delivery.deliveryInstructions}
              </Text>
            </View>
          )}
          
          <View style={styles.paymentInfoContainer}>
            <MaterialIcons name="payment" size={20} color="#666" />
            <View style={styles.paymentInfoText}>
              <Text style={styles.paymentMethodLabel}>Payment Method:</Text>
              <Text style={styles.paymentMethod}>
                {sampleOrderConfirmation.payment.methodIcon} {sampleOrderConfirmation.payment.method}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderPushNotificationPrompt = () => (
    showPushNotificationPrompt && (
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ translateY: cardSlideAnim }] },
        ]}
      >
        <Surface style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <MaterialIcons name="notifications" size={24} color="#FF6B35" />
            <Text style={styles.notificationTitle}>{pushNotificationSetup.title}</Text>
            <IconButton
              icon="close"
              size={20}
              iconColor="#666"
              onPress={() => setShowPushNotificationPrompt(false)}
            />
          </View>
          
          <Text style={styles.notificationMessage}>
            {pushNotificationSetup.message}
          </Text>
          
          <View style={styles.notificationBenefits}>
            {pushNotificationSetup.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
          
          <Button
            mode="contained"
            onPress={handleEnableNotifications}
            style={styles.enableNotificationsButton}
          >
            Enable Notifications
          </Button>
        </Surface>
      </Animated.View>
    )
  );

  const renderRatingPrompt = () => (
    showRating && (
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ scale: ratingScale }] },
        ]}
      >
        <Surface style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <MaterialIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.ratingTitle}>Rate Your Experience</Text>
          </View>
          
          <Text style={styles.ratingMessage}>
            How was your ordering experience today?
          </Text>
          
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable 
                key={star} 
                style={styles.starButton}
                onPress={() => handleRating(star)}
              >
                <MaterialIcons
                  name={rating >= star ? "star" : "star-border"}
                  size={32}
                  color={rating >= star ? "#FFD700" : "#E0E0E0"}
                />
              </Pressable>
            ))}
          </View>
          
          <Text style={styles.ratingSubtext}>
            Tap to rate from 1 to 5 stars
          </Text>
        </Surface>
      </Animated.View>
    )
  );

  const renderActionButtons = () => (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardSlideAnim }] },
      ]}
    >
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="contained"
          onPress={handleTrackOrder}
          style={styles.trackOrderButton}
          contentStyle={styles.buttonContent}
          icon="map-marker-path"
        >
          Track Order
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleContinueShopping}
          style={styles.continueShoppingButton}
          contentStyle={styles.buttonContent}
          icon="shopping"
        >
          Continue Shopping
        </Button>
      </View>
    </Animated.View>
  );

  const renderFloatingActions = () => (
    showFloatingActions && (
      <Animated.View
        style={[
          styles.floatingActionsContainer,
          { transform: [{ scale: floatingButtonScale }] },
        ]}
      >
        <View style={styles.floatingActions}>
          <Button
            mode="contained"
            onPress={handleTrackOrder}
            style={styles.floatingTrackButton}
            icon="map-marker-path"
            compact
          >
            Track
          </Button>
          
          <Button
            mode="contained"
            onPress={handleCallRestaurant}
            style={styles.floatingCallButton}
            icon="phone"
            compact
          >
            Call
          </Button>
          
          <Button
            mode="contained"
            onPress={handleShareOrder}
            style={styles.floatingShareButton}
            icon="share"
            compact
          >
            Share
          </Button>
        </View>
      </Animated.View>
    )
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        {renderCelebrationHeader()}
        
        {/* Order Summary */}
        {renderOrderSummary()}
        
        {/* Delivery Progress */}
        {renderDeliveryProgress()}
        
        {/* Restaurant Info */}
        {renderRestaurantInfo()}
        
        {/* Delivery Info */}
        {renderDeliveryInfo()}
        
        {/* Push Notification Prompt */}
        {renderPushNotificationPrompt()}
        
        {/* Rating Prompt */}
        {renderRatingPrompt()}
        
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  celebrationContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  checkmarkContainer: { marginBottom: 20 },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  messageContainer: { alignItems: 'center' },
  celebrationTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  celebrationSubtitle: { fontSize: 18, color: '#666', textAlign: 'center' },
  celebrationTime: { fontSize: 14, color: '#FF6B35', fontWeight: '500', marginTop: 8 },
  confettiContainer: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -20,
  },
  cardContainer: { marginHorizontal: 16, marginBottom: 16 },
  sectionCard: { padding: 20, borderRadius: 16, elevation: 2, backgroundColor: 'white' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 8, flex: 1 },
  estimatedTime: { fontSize: 14, color: '#FF6B35', fontWeight: '500' },
  orderIdContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  orderIdLabel: { fontSize: 16, fontWeight: '500', color: '#333', marginRight: 8 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#FF6B35' },
  divider: { marginVertical: 16 },
  orderItemsContainer: { gap: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderItemInfo: { flex: 1, marginRight: 16 },
  orderItemName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  orderItemQuantity: { fontSize: 14, color: '#666' },
  orderItemPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
  addOnsList: { marginTop: 4, marginLeft: 16 },
  addOnText: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#FF6B35' },
  progressContainer: { marginBottom: 20 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 12 },
  progressText: { fontSize: 14, color: '#666', textAlign: 'center' },
  timelineContainer: { gap: 20 },
  timelineStep: { flexDirection: 'row' },
  timelineIconContainer: { alignItems: 'center', marginRight: 16 },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timelineIconText: { fontSize: 20 },
  timelineLine: {
    width: 2,
    height: 30,
    borderRadius: 1,
  },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  timelineDescription: { fontSize: 14, color: '#666', marginBottom: 4 },
  timelineTime: { fontSize: 12, color: '#999' },
  restaurantInfoContainer: { gap: 12 },
  restaurantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { fontSize: 18, fontWeight: '600', color: '#333' },
  restaurantRating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, fontWeight: '500', color: '#333', marginLeft: 4 },
  restaurantCuisine: { fontSize: 14, color: '#666' },
  restaurantAddress: { fontSize: 14, color: '#666' },
  restaurantHours: { fontSize: 14, color: '#666' },
  restaurantActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  callButton: { flex: 1, borderColor: '#FF6B35' },
  shareButton: { flex: 1, borderColor: '#4ECDC4' },
  deliveryInfoContainer: { gap: 12 },
  deliveryAddressContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  deliveryAddressText: { flex: 1, marginLeft: 12 },
  deliveryAddressLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
  deliveryAddress: { fontSize: 14, color: '#666', lineHeight: 20 },
  deliveryInstructionsContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  deliveryInstructions: { fontSize: 14, color: '#666', marginLeft: 12, flex: 1 },
  paymentInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  paymentInfoText: { flex: 1, marginLeft: 12 },
  paymentMethodLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
  paymentMethod: { fontSize: 14, color: '#666' },
  notificationCard: { padding: 20, borderRadius: 16, elevation: 2, backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFE0B2' },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  notificationTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 8, flex: 1 },
  notificationMessage: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  notificationBenefits: { marginBottom: 16 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  benefitText: { fontSize: 14, color: '#666', marginLeft: 8 },
  enableNotificationsButton: { backgroundColor: '#FF6B35' },
  actionButtonsContainer: { gap: 16, marginBottom: 24 },
  trackOrderButton: { backgroundColor: '#FF6B35' },
  continueShoppingButton: { borderColor: '#4ECDC4' },
  buttonContent: { paddingVertical: 8 },
  ratingCard: { padding: 20, borderRadius: 16, elevation: 2, backgroundColor: '#FFFDE7', borderWidth: 1, borderColor: '#FFF9C4' },
  ratingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 8 },
  ratingMessage: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 },
  ratingStars: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  starButton: { padding: 10 },
  ratingSubtext: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 10 },
  floatingActionsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  floatingTrackButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  floatingCallButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  floatingShareButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B35',
    marginLeft: 8,
  },
}); 