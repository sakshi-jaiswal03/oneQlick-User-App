import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  TextInput,
  IconButton,
  Divider,
} from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../../hooks/useCart';
import { cartData, availableCoupons } from './cartData';
import { CartItem } from '../../../components/cart';
import AddressSelector from './AddressSelector';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(cartData.deliveryAddress);
  const [isBillExpanded, setIsBillExpanded] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Use only the actual cart from the hook, no default sample data
  const displayCart = cart;

  // Handle phone back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate to home screen when phone back button is pressed
        router.push('/(tabs)/home');
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [router])
  );

  // Debug logging
  useEffect(() => {
    console.log('Cart screen mounted');
    console.log('Hook cart items:', cart.items.length);
    console.log('Display cart items:', displayCart.items.length);
    console.log('Cart items data:', displayCart.items);
    console.log('Cart total items count:', cart.items.reduce((total, item) => total + (item.quantity || 1), 0));
  }, [cart.items.length, displayCart.items.length, cart.items]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBackPress = () => {
    console.log('Back button pressed, navigating to home...');
    // Navigate to home screen instead of just going back
    router.push('/(tabs)/home');
  };

  // Calculate bill breakdown
  const calculateBill = () => {
    if (displayCart.items.length === 0) {
      return {
        subtotal: 0,
        gst: 0,
        deliveryFee: 0,
        packagingCharges: 0,
        discount: 0,
        total: 0,
      };
    }

    const subtotal = displayCart.items.reduce((total, item) => {
      const itemTotal = (item.foodItem?.price || 0) * (item.quantity || 1);
      const addOnsTotal = (item.addOns || []).reduce((sum, addOn) => sum + (addOn?.price || 0), 0);
      return total + itemTotal + addOnsTotal;
    }, 0);

    const gst = subtotal * 0.05; // 5% GST
    const deliveryFee = cartData.deliveryFee;
    const packagingCharges = cartData.packagingCharges;
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.min(subtotal * (appliedCoupon.discount / 100), appliedCoupon.maxDiscount);
      } else {
        discount = appliedCoupon.discount;
      }
    }

    const total = subtotal + gst + deliveryFee + packagingCharges - discount;

    return {
      subtotal,
      gst,
      deliveryFee,
      packagingCharges,
      discount,
      total,
    };
  };

  const bill = calculateBill();

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    console.log('Quantity change requested:', itemId, increment);
    const item = displayCart.items.find(item => item.id === itemId);
    if (!item) {
      console.log('Item not found:', itemId);
      return;
    }

    const newQuantity = increment ? (item.quantity || 1) + 1 : Math.max(1, (item.quantity || 1) - 1);
    console.log('New quantity:', newQuantity);
    
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      // Call the actual updateQuantity function from the hook
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          // Call the actual removeFromCart function from the hook
          removeFromCart(itemId);
        }}
      ]
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    const coupon = availableCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (bill.subtotal < coupon.minOrder) {
      setCouponError(`Minimum order amount is ₹${coupon.minOrder}`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon applied! ${coupon.description}`);
    setCouponCode('');
    
    // Auto-hide success message
    setTimeout(() => setCouponSuccess(''), 3000);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
  };

  const handleProceedToCheckout = () => {
    if (displayCart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/(tabs)/home');
  };

  const renderBillBreakdown = () => (
    <Surface style={styles.billContainer}>
      <Pressable
        style={styles.billHeader}
        onPress={() => setIsBillExpanded(!isBillExpanded)}
      >
        <Text style={styles.billTitle}>Bill Details</Text>
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
            <Text style={styles.billValue}>₹{bill.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (5%)</Text>
            <Text style={styles.billValue}>₹{bill.gst.toFixed(2)}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{bill.deliveryFee}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packaging Charges</Text>
            <Text style={styles.billValue}>₹{bill.packagingCharges}</Text>
          </View>
          
          {appliedCoupon && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount ({appliedCoupon.code})</Text>
              <Text style={[styles.billValue, styles.discountText]}>
                -₹{bill.discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <Divider style={styles.billDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{bill.total.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </Surface>
  );

  const renderCouponSection = () => (
    <Surface style={styles.couponContainer}>
      <Text style={styles.couponHeader}>Apply Coupon</Text>
      
      {appliedCoupon ? (
        <View style={styles.appliedCouponContainer}>
          <View style={styles.appliedCouponInfo}>
            <Text style={styles.appliedCouponCode}>{appliedCoupon.code}</Text>
            <Text style={styles.appliedCouponDescription}>{appliedCoupon.description}</Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            iconColor="#F44336"
            onPress={handleRemoveCoupon}
          />
        </View>
      ) : (
        <View style={styles.couponInputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            style={styles.couponInput}
          />
          
          <Button
            mode="contained"
            onPress={handleApplyCoupon}
            disabled={!couponCode.trim()}
            style={styles.applyButton}
          >
            Apply
          </Button>
        </View>
      )}
      
      {couponError && (
        <Text style={styles.couponError}>{couponError}</Text>
      )}
      
      {couponSuccess && (
        <Text style={styles.couponSuccess}>{couponSuccess}</Text>
      )}
    </Surface>
  );

  const renderDeliveryInfo = () => (
    <AddressSelector
      selectedAddress={selectedAddress}
      onAddressChange={setSelectedAddress}
    />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartIcon}>
        <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
      </View>
      
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Looks like you haven't added any items to your cart yet
      </Text>
      
      <Button
        mode="contained"
        onPress={handleContinueShopping}
        style={styles.continueShoppingButton}
        contentStyle={styles.continueShoppingButtonContent}
      >
        Continue Shopping
      </Button>
    </View>
  );

  console.log('About to render cart screen with items:', displayCart.items.length);

  // Always show empty cart initially - no default items
  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Cart</Text>
        {displayCart.items.length > 0 && (
          <Pressable 
            onPress={() => {
              Alert.alert(
                'Clear Cart',
                'Are you sure you want to clear your entire cart?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => {
                    clearCart();
                  }}
                ]
              );
            }}
            style={styles.clearCartButton}
          >
            <MaterialIcons name="delete-sweep" size={24} color="#F44336" />
          </Pressable>
        )}
        {displayCart.items.length === 0 && <View style={styles.headerRight} />}
      </View>

      {displayCart.items.length === 0 ? (
        // Show empty cart
        renderEmptyCart()
      ) : (
        // Show cart with items
        <>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Cart Items */}
            <View style={styles.cartItemsContainer}>
              {displayCart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </View>

            {/* Coupon Section */}
            {renderCouponSection()}

            {/* Delivery Info */}
            {renderDeliveryInfo()}

            {/* Bill Breakdown */}
            {renderBillBreakdown()}

            {/* Bottom spacing */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Checkout Button */}
          <Surface style={styles.checkoutBar}>
            <View style={styles.checkoutInfo}>
              <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
              <Text style={styles.checkoutTotalPrice}>₹{bill.total.toFixed(2)}</Text>
            </View>
            
            <Button
              mode="contained"
              onPress={handleProceedToCheckout}
              style={styles.checkoutButton}
              contentStyle={styles.checkoutButtonContent}
            >
              Proceed to Checkout
            </Button>
          </Surface>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for checkout bar
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  headerRight: {
    width: 48,
  },
  clearCartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
  },
  cartItemsContainer: {
    padding: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCartIcon: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyCartTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueShoppingButtonContent: {
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  billContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  billTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  billDetails: { 
    padding: 0 
  },
  billRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f3f4' 
  },
  billLabel: { 
    fontSize: 15, 
    color: '#6c757d',
    fontWeight: '500',
  },
  billValue: { 
    fontSize: 15, 
    color: '#2c3e50', 
    fontWeight: '600' 
  },
  discountText: { 
    color: '#28a745', 
    fontWeight: '700' 
  },
  billDivider: { 
    marginVertical: 16 
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
    marginTop: 12,
  },
  totalLabel: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#2c3e50' 
  },
  totalValue: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#FF6B35' 
  },
  couponContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  couponHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  couponInput: {
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  couponError: {
    color: '#dc3545',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  couponSuccess: {
    color: '#28a745',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  appliedCouponContainer: {
    backgroundColor: '#d4edda',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  appliedCouponInfo: { 
    flex: 1 
  },
  appliedCouponCode: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#155724', 
    marginBottom: 4 
  },
  appliedCouponDescription: { 
    fontSize: 14, 
    color: '#155724' 
  },

  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  checkoutTotalPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutButtonContent: {
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
}); 