import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  TextInput,
  IconButton,
  Divider,
  Chip,
  Portal,
  Modal,
  Checkbox,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';
import {
  deliveryAddresses,
  paymentMethods,
  timeSlots,
  sampleOrderSummary,
  restaurantInfo,
  termsAndConditions,
  DeliveryAddress,
  PaymentMethod,
  TimeSlot,
} from './checkoutData';

const { width, height } = Dimensions.get('window');

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(deliveryAddresses[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>(timeSlots[0]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isTimeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [isBillExpanded, setIsBillExpanded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const orderAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Calculate final bill with processing fees
  const calculateFinalBill = () => {
    const baseTotal = sampleOrderSummary.total;
    const processingFee = selectedPaymentMethod?.processingFee || 0;
    return baseTotal + processingFee;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address.');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a delivery time slot.');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions.');
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Animate order placement
    Animated.sequence([
      Animated.timing(orderAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(orderAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setIsPlacingOrder(false);

    // Show success and navigate to order confirmation
    Alert.alert(
      'Order Placed Successfully! 🎉',
      `Your order has been placed and will be delivered to ${selectedAddress.address}`,
      [
        {
          text: 'View Order Details',
          onPress: () => {
            clearCart();
            router.push('/order-confirmation');
          }
        },
        {
          text: 'Continue Shopping',
          onPress: () => {
            clearCart();
            router.push('/(tabs)/home');
          }
        }
      ]
    );
  };

  const renderOrderSummary = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="receipt" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.itemCount}>({sampleOrderSummary.items.length} items)</Text>
      </View>
      
      <View style={styles.orderItemsContainer}>
        {sampleOrderSummary.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
            </View>
            
            <View style={styles.orderItemPrice}>
              <Text style={styles.orderItemPriceText}>₹{item.price * item.quantity}</Text>
              
              {item.addOns.length > 0 && (
                <View style={styles.addOnsList}>
                  {item.addOns.map((addOn, index) => (
                    <Text key={index} style={styles.addOnText}>
                      + {addOn.name} (₹{addOn.price})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.restaurantInfo}>
        <MaterialIcons name="restaurant" size={20} color="#666" />
        <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>
        <Text style={styles.restaurantAddress}>{restaurantInfo.address}</Text>
      </View>
    </Surface>
  );

  const renderAddressSelection = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="location-on" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <IconButton
          icon="edit"
          size={20}
          iconColor="#666"
          onPress={() => setAddressModalVisible(true)}
        />
      </View>
      
      <Pressable
        style={styles.selectedAddressCard}
        onPress={() => setAddressModalVisible(true)}
      >
        <View style={styles.addressTypeContainer}>
          <MaterialIcons
            name={selectedAddress.type === 'home' ? 'home' : selectedAddress.type === 'work' ? 'work' : 'location-on'}
            size={20}
            color="#FF6B35"
          />
          <Chip style={styles.addressTypeChip} textStyle={styles.addressTypeText}>
            {selectedAddress.type.toUpperCase()}
          </Chip>
        </View>
        
        <Text style={styles.addressText}>{selectedAddress.address}</Text>
        {selectedAddress.landmark && (
          <Text style={styles.landmarkText}>Landmark: {selectedAddress.landmark}</Text>
        )}
        <Text style={styles.cityText}>
          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
        </Text>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactPerson}>{selectedAddress.contactPerson}</Text>
          <Text style={styles.contactNumber}>{selectedAddress.contactNumber}</Text>
        </View>
        
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </Pressable>
    </Surface>
  );

  const renderPaymentMethodSelection = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="payment" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <IconButton
          icon="edit"
          size={20}
          iconColor="#666"
          onPress={() => setPaymentModalVisible(true)}
        />
      </View>
      
      {selectedPaymentMethod ? (
        <Pressable
          style={styles.selectedPaymentCard}
          onPress={() => setPaymentModalVisible(true)}
        >
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentIcon}>{selectedPaymentMethod.icon}</Text>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>{selectedPaymentMethod.name}</Text>
              <Text style={styles.paymentDescription}>{selectedPaymentMethod.description}</Text>
              {selectedPaymentMethod.processingFee && selectedPaymentMethod.processingFee > 0 && (
                <Text style={styles.processingFee}>
                  Processing fee: ₹{selectedPaymentMethod.processingFee}
                </Text>
              )}
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>
      ) : (
        <Pressable
          style={styles.selectPaymentButton}
          onPress={() => setPaymentModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#666" />
          <Text style={styles.selectPaymentText}>Select Payment Method</Text>
        </Pressable>
      )}
    </Surface>
  );

  const renderTimeSlotSelection = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="access-time" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Delivery Time</Text>
        <IconButton
          icon="edit"
          size={20}
          iconColor="#666"
          onPress={() => setTimeSlotModalVisible(true)}
        />
      </View>
      
      {selectedTimeSlot ? (
        <Pressable
          style={styles.selectedTimeSlotCard}
          onPress={() => setTimeSlotModalVisible(true)}
        >
          <View style={styles.timeSlotInfo}>
            <Text style={styles.timeSlotLabel}>{selectedTimeSlot.label}</Text>
            <Text style={styles.timeSlotTime}>{selectedTimeSlot.time}</Text>
            {selectedTimeSlot.isRecommended && (
              <Chip style={styles.recommendedChip} textStyle={styles.recommendedText}>
                Recommended
              </Chip>
            )}
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>
      ) : (
        <Pressable
          style={styles.selectTimeSlotButton}
          onPress={() => setTimeSlotModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#666" />
          <Text style={styles.selectTimeSlotText}>Select Delivery Time</Text>
        </Pressable>
      )}
    </Surface>
  );

  const renderSpecialInstructions = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="edit-note" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Special Instructions</Text>
        <Text style={styles.characterCount}>
          {specialInstructions.length}/100
        </Text>
      </View>
      
      <TextInput
        mode="outlined"
        placeholder="Any special requests or delivery instructions?"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        multiline
        numberOfLines={3}
        maxLength={100}
        style={styles.instructionsInput}
      />
    </Surface>
  );

  const renderBillSummary = () => (
    <Surface style={styles.sectionCard}>
      <Pressable
        style={styles.billHeader}
        onPress={() => setIsBillExpanded(!isBillExpanded)}
      >
        <View style={styles.billHeaderLeft}>
          <MaterialIcons name="receipt-long" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Bill Summary</Text>
        </View>
        <MaterialIcons
          name={isBillExpanded ? "expand-less" : "expand-more"}
          size={24}
          color="#666"
        />
      </Pressable>

      {isBillExpanded && (
        <View style={styles.billDetails}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{sampleOrderSummary.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (5%)</Text>
            <Text style={styles.billValue}>₹{sampleOrderSummary.gst.toFixed(2)}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{sampleOrderSummary.deliveryFee}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packaging Charges</Text>
            <Text style={styles.billValue}>₹{sampleOrderSummary.packagingCharges}</Text>
          </View>
          
          {selectedPaymentMethod?.processingFee && selectedPaymentMethod.processingFee > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Processing Fee</Text>
              <Text style={styles.billValue}>₹{selectedPaymentMethod.processingFee.toFixed(2)}</Text>
            </View>
          )}
          
          <Divider style={styles.billDivider} />
          
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{calculateFinalBill().toFixed(2)}</Text>
          </View>
        </View>
      )}
    </Surface>
  );

  const renderTermsAndConditions = () => (
    <Surface style={styles.sectionCard}>
      <View style={styles.termsContainer}>
        <Checkbox
          status={acceptedTerms ? 'checked' : 'unchecked'}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        />
        <View style={styles.termsTextContainer}>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          {renderOrderSummary()}

          {/* Delivery Address */}
          {renderAddressSelection()}

          {/* Payment Method */}
          {renderPaymentMethodSelection()}

          {/* Time Slot */}
          {renderTimeSlotSelection()}

          {/* Special Instructions */}
          {renderSpecialInstructions()}

          {/* Bill Summary */}
          {renderBillSummary()}

          {/* Terms and Conditions */}
          {renderTermsAndConditions()}

          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </Animated.View>

      {/* Place Order Button */}
      <Surface style={styles.placeOrderBar}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTotalLabel}>Total Amount</Text>
          <Text style={styles.orderTotalPrice}>₹{calculateFinalBill().toFixed(2)}</Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={isPlacingOrder}
          disabled={!selectedAddress || !selectedPaymentMethod || !selectedTimeSlot || !acceptedTerms || isPlacingOrder}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </Surface>

      {/* Address Selection Modal */}
      <Portal>
        <Modal
          visible={isAddressModalVisible}
          onDismiss={() => setAddressModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            <IconButton
              icon="close"
              size={24}
              iconColor="#333"
              onPress={() => setAddressModalVisible(false)}
            />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {deliveryAddresses.map((address) => (
              <Pressable
                key={address.id}
                style={[
                  styles.addressModalItem,
                  selectedAddress.id === address.id && styles.addressModalItemSelected
                ]}
                onPress={() => {
                  setSelectedAddress(address);
                  setAddressModalVisible(false);
                }}
              >
                <View style={styles.addressModalContent}>
                  <View style={styles.addressTypeContainer}>
                    <MaterialIcons
                      name={address.type === 'home' ? 'home' : address.type === 'work' ? 'work' : 'location-on'}
                      size={20}
                      color="#FF6B35"
                    />
                    <Chip style={styles.addressTypeChip} textStyle={styles.addressTypeText}>
                      {address.type.toUpperCase()}
                    </Chip>
                  </View>
                  
                  <Text style={styles.addressModalText}>{address.address}</Text>
                  {address.landmark && (
                    <Text style={styles.landmarkModalText}>Landmark: {address.landmark}</Text>
                  )}
                  <Text style={styles.cityModalText}>
                    {address.city}, {address.state} - {address.pincode}
                  </Text>
                  
                  <View style={styles.contactModalInfo}>
                    <Text style={styles.contactModalPerson}>{address.contactPerson}</Text>
                    <Text style={styles.contactModalNumber}>{address.contactNumber}</Text>
                  </View>
                </View>
                
                {selectedAddress.id === address.id && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Payment Method Modal */}
      <Portal>
        <Modal
          visible={isPaymentModalVisible}
          onDismiss={() => setPaymentModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <IconButton
              icon="close"
              size={24}
              iconColor="#333"
              onPress={() => setPaymentModalVisible(false)}
            />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {paymentMethods.map((method) => (
              <Pressable
                key={method.id}
                style={[
                  styles.paymentModalItem,
                  selectedPaymentMethod?.id === method.id && styles.paymentModalItemSelected
                ]}
                onPress={() => {
                  setSelectedPaymentMethod(method);
                  setPaymentModalVisible(false);
                }}
                disabled={!method.isAvailable}
              >
                <View style={styles.paymentModalContent}>
                  <Text style={styles.paymentModalIcon}>{method.icon}</Text>
                  <View style={styles.paymentModalDetails}>
                    <Text style={styles.paymentModalName}>{method.name}</Text>
                    <Text style={styles.paymentModalDescription}>{method.description}</Text>
                    {method.processingFee && method.processingFee > 0 && (
                      <Text style={styles.processingFeeModal}>
                        Processing fee: ₹{method.processingFee}
                      </Text>
                    )}
                  </View>
                </View>
                
                {selectedPaymentMethod?.id === method.id && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Time Slot Modal */}
      <Portal>
        <Modal
          visible={isTimeSlotModalVisible}
          onDismiss={() => setTimeSlotModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Delivery Time</Text>
            <IconButton
              icon="close"
              size={24}
              iconColor="#333"
              onPress={() => setTimeSlotModalVisible(false)}
            />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot.id}
                style={[
                  styles.timeSlotModalItem,
                  selectedTimeSlot.id === slot.id && styles.timeSlotModalItemSelected,
                  !slot.isAvailable && styles.timeSlotModalItemDisabled
                ]}
                onPress={() => {
                  if (slot.isAvailable) {
                    setSelectedTimeSlot(slot);
                    setTimeSlotModalVisible(false);
                  }
                }}
                disabled={!slot.isAvailable}
              >
                <View style={styles.timeSlotModalContent}>
                  <View style={styles.timeSlotModalInfo}>
                    <Text style={styles.timeSlotModalLabel}>{slot.label}</Text>
                    <Text style={styles.timeSlotModalTime}>{slot.time}</Text>
                    {slot.isRecommended && (
                      <Chip style={styles.recommendedModalChip} textStyle={styles.recommendedModalText}>
                        Recommended
                      </Chip>
                    )}
                  </View>
                  
                  {selectedTimeSlot.id === slot.id && (
                    <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollView: { flex: 1 },
  sectionCard: { margin: 16, marginTop: 0, padding: 16, borderRadius: 16, elevation: 2, backgroundColor: 'white' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 8, flex: 1 },
  itemCount: { fontSize: 14, color: '#666' },
  orderItemsContainer: { gap: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderItemInfo: { flex: 1, marginRight: 16 },
  orderItemName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  orderItemQuantity: { fontSize: 14, color: '#666' },
  orderItemPrice: { alignItems: 'flex-end' },
  orderItemPriceText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
  addOnsList: { marginTop: 4, alignItems: 'flex-end' },
  addOnText: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  divider: { marginVertical: 16 },
  restaurantInfo: { alignItems: 'center' },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 8, marginBottom: 4 },
  restaurantAddress: { fontSize: 14, color: '#666', textAlign: 'center' },
  selectedAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addressTypeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addressTypeChip: { backgroundColor: '#FFF3E0', marginLeft: 8 },
  addressTypeText: { color: '#FF6B35', fontSize: 10, fontWeight: 'bold' },
  addressText: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4, flex: 1 },
  landmarkText: { fontSize: 14, color: '#666', marginBottom: 4 },
  cityText: { fontSize: 14, color: '#666', marginBottom: 8 },
  contactInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  contactPerson: { fontSize: 14, fontWeight: '500', color: '#333' },
  contactNumber: { fontSize: 14, color: '#666' },
  selectedPaymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentMethodInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  paymentIcon: { fontSize: 32, marginRight: 16 },
  paymentDetails: { flex: 1 },
  paymentName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  paymentDescription: { fontSize: 14, color: '#666', marginBottom: 4 },
  processingFee: { fontSize: 12, color: '#FF6B35', fontWeight: '500' },
  selectPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  selectPaymentText: { fontSize: 16, color: '#666', marginLeft: 8 },
  selectedTimeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  timeSlotInfo: { flex: 1 },
  timeSlotLabel: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  timeSlotTime: { fontSize: 14, color: '#666', marginBottom: 8 },
  recommendedChip: { backgroundColor: '#E8F5E8', alignSelf: 'flex-start' },
  recommendedText: { color: '#4CAF50', fontSize: 10, fontWeight: 'bold' },
  selectTimeSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  selectTimeSlotText: { fontSize: 16, color: '#666', marginLeft: 8 },
  characterCount: { fontSize: 12, color: '#666' },
  instructionsInput: { backgroundColor: 'transparent' },
  billHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  billHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  billDetails: { marginTop: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  billLabel: { fontSize: 14, color: '#666' },
  billValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  billDivider: { marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF6B35' },
  termsContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  termsTextContainer: { flex: 1, marginLeft: 8 },
  termsText: { fontSize: 14, color: '#333', lineHeight: 20 },
  termsLink: { color: '#FF6B35', textDecorationLine: 'underline' },
  placeOrderBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },
  orderInfo: { flex: 1 },
  orderTotalLabel: { fontSize: 14, color: '#666', marginBottom: 2 },
  orderTotalPrice: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35' },
  placeOrderButton: { backgroundColor: '#FF6B35' },
  placeOrderButtonContent: { paddingHorizontal: 32, paddingVertical: 8 },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addressModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressModalItemSelected: { backgroundColor: '#FFF3E0' },
  addressModalContent: { flex: 1, marginRight: 16 },
  addressModalText: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  landmarkModalText: { fontSize: 14, color: '#666', marginBottom: 4 },
  cityModalText: { fontSize: 14, color: '#666', marginBottom: 8 },
  contactModalInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  contactModalPerson: { fontSize: 14, fontWeight: '500', color: '#333' },
  contactModalNumber: { fontSize: 14, color: '#666' },
  paymentModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentModalItemSelected: { backgroundColor: '#FFF3E0' },
  paymentModalContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  paymentModalIcon: { fontSize: 32, marginRight: 16 },
  paymentModalDetails: { flex: 1 },
  paymentModalName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  paymentModalDescription: { fontSize: 14, color: '#666', marginBottom: 4 },
  processingFeeModal: { fontSize: 12, color: '#FF6B35', fontWeight: '500' },
  timeSlotModalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeSlotModalItemSelected: { backgroundColor: '#FFF3E0' },
  timeSlotModalItemDisabled: { opacity: 0.5 },
  timeSlotModalContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeSlotModalInfo: { flex: 1 },
  timeSlotModalLabel: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  timeSlotModalTime: { fontSize: 14, color: '#666', marginBottom: 8 },
  recommendedModalChip: { backgroundColor: '#E8F5E8', alignSelf: 'flex-start' },
  recommendedModalText: { color: '#4CAF50', fontSize: 10, fontWeight: 'bold' },
}); 