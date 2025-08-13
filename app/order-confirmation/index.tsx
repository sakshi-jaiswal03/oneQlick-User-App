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
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPushNotificationPrompt, setShowPushNotificationPrompt] = useState(true);
  
  // Animation values
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const messageSlideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const celebrationScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start celebration animations
    startCelebrationAnimations();
    
    // Rotate through celebration messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % celebrationMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  const startCelebrationAnimations = () => {
    // Checkmark animation
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(checkmarkScale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(checkmarkOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    // Confetti animation
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(confettiAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start(() => setShowConfetti(true));

    // Message slide animation
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(messageSlideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Progress bar animation
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(progressAnim, { toValue: 0.4, duration: 1000, useNativeDriver: false }),
    ]).start();

    // Card slide animations
    Animated.sequence([
      Animated.delay(1800),
      Animated.timing(cardSlideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Celebration scale animation
    Animated.sequence([
      Animated.delay(2000),
      Animated.spring(celebrationScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleTrackOrder = () => {
    router.push('/(tabs)/orders');
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
      </Animated.View>

      {/* Confetti Effect */}
      {showConfetti && (
        <Animated.View
          style={[
            styles.confettiContainer,
            { opacity: confettiAnim },
          ]}
        >
          {[...Array(20)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  left: Math.random() * width,
                  backgroundColor: ['#FF6B35', '#4ECDC4', '#FFE66D', '#FF6B9D'][index % 4],
                  animationDelay: `${index * 100}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      )}
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
        
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progressAnim as any}
            color={progressColors.current}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            Preparing your order...
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
          <MaterialIcons name="location-on" size={24} color="#FF6B35" />
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
      
      <View style={styles.rateExperienceContainer}>
        <Text style={styles.rateExperienceText}>Rate your experience</Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} style={styles.starButton}>
              <MaterialIcons
                name="star-border"
                size={24}
                color="#FFD700"
              />
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
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
        
        {/* Action Buttons */}
        {renderActionButtons()}
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  confettiContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -10,
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
  rateExperienceContainer: { alignItems: 'center' },
  rateExperienceText: { fontSize: 16, color: '#666', marginBottom: 12 },
  ratingStars: { flexDirection: 'row', gap: 8 },
  starButton: { padding: 4 },
}); 