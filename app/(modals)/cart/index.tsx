import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  TextInput,
  IconButton,
  Divider,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../../hooks/useCart';
import { cartData, availableCoupons } from './cartData';

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
  const quantityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  // Calculate bill breakdown
  const calculateBill = () => {
    const subtotal = cart.items.reduce((total, item) => {
      const itemTotal = item.foodItem.price * item.quantity;
      const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
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
    const item = cart.items.find(item => item.foodItem.id === itemId);
    if (!item) return;

    const newQuantity = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
      
      // Animate quantity change
      Animated.sequence([
        Animated.timing(quantityAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(quantityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) }
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
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/(tabs)/home');
  };

  const renderCartItem = (item: any) => (
    <Surface key={item.foodItem.id} style={styles.cartItem}>
      {/* Item Image */}
      <View style={styles.cartItemHeader}>
        <Image source={{ uri: item.foodItem.image }} style={styles.cartItemImage} />
        {item.foodItem.isVeg && (
          <View style={styles.vegIndicator}>
            <MaterialIcons name="circle" size={12} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={2}>
          {item.foodItem.name}
        </Text>
        
        {item.foodItem.description && (
          <Text style={styles.cartItemDescription} numberOfLines={1}>
            {item.foodItem.description}
          </Text>
        )}

        {/* Add-ons */}
        {item.addOns && item.addOns.length > 0 && (
          <View style={styles.addOnsContainer}>
            <Text style={styles.addOnsLabel}>Add-ons:</Text>
            {item.addOns.map((addOn: any, index: number) => (
              <Text key={index} style={styles.addOnText}>
                • {addOn.name} (+₹{addOn.price})
              </Text>
            ))}
          </View>
        )}

        {/* Price and Quantity */}
        <View style={styles.cartItemPriceContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>₹{item.foodItem.price}</Text>
            {item.foodItem.originalPrice && (
              <Text style={styles.originalPrice}>₹{item.foodItem.originalPrice}</Text>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.foodItem.id, false)}
            >
              <MaterialIcons name="remove" size={20} color="#FF6B35" />
            </Pressable>
            
            <Animated.Text style={[styles.quantityText, { transform: [{ scale: quantityAnim }] }]}>
              {item.quantity}
            </Animated.Text>
            
            <Pressable
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.foodItem.id, true)}
            >
              <MaterialIcons name="add" size={20} color="#FF6B35" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Remove Button */}
      <IconButton
        icon="delete-outline"
        size={24}
        iconColor="#F44336"
        onPress={() => handleRemoveItem(item.foodItem.id)}
        style={styles.removeButton}
      />
    </Surface>
  );

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
    <Surface style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <MaterialIcons name="location-on" size={20} color="#FF6B35" />
        <Text style={styles.deliveryTitle}>Delivery Address</Text>
      </View>
      
      <Text style={styles.deliveryAddress}>{selectedAddress}</Text>
      
      <View style={styles.deliveryMeta}>
        <View style={styles.deliveryMetaItem}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.deliveryMetaText}>
            Estimated delivery: {cartData.estimatedDelivery}
          </Text>
        </View>
        
        <View style={styles.deliveryMetaItem}>
          <MaterialIcons name="local-shipping" size={16} color="#666" />
          <Text style={styles.deliveryMetaText}>
            Delivery fee: ₹{cartData.deliveryFee}
          </Text>
        </View>
      </View>
    </Surface>
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

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.customHeader}>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={styles.headerRight} />
        </View>
        
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Cart ({cart.items.length})</Text>
        <Pressable 
          onPress={() => {
            Alert.alert(
              'Clear Cart',
              'Are you sure you want to clear your entire cart?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearCart }
              ]
            );
          }}
          style={styles.clearCartButton}
        >
          <MaterialIcons name="delete-sweep" size={24} color="#F44336" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
          {/* Cart Items */}
          <View style={styles.cartItemsContainer}>
            {cart.items.map(renderCartItem)}
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
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for checkout bar
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 48,
  },
  clearCartButton: {
    padding: 8,
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
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#FF6B35',
  },
  continueShoppingButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cartItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  cartItemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 8 },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  removeButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  vegIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  addOnsContainer: { marginBottom: 8 },
  addOnsLabel: { fontSize: 12, color: '#666', fontWeight: '500', marginBottom: 2 },
  addOnText: { fontSize: 12, color: '#666', marginLeft: 8 },
  billContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    marginRight: 4,
  },
  billDetails: { padding: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  billLabel: { fontSize: 14, color: '#666' },
  billValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  discountText: { color: '#4CAF50', fontWeight: 'bold' },
  billDivider: { marginVertical: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
    marginTop: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#FF6B35' },
  couponContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  couponHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    marginRight: 12,
  },
  applyButton: {
    backgroundColor: '#FF6B35',
  },
  applyButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  couponError: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 8,
  },
  couponSuccess: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 8,
  },
  appliedCouponContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  appliedCouponInfo: { flex: 1 },
  appliedCouponCode: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginBottom: 2 },
  appliedCouponDescription: { fontSize: 14, color: '#666' },
  deliveryCard: { margin: 16, padding: 16, borderRadius: 16, elevation: 2, backgroundColor: 'white' },
  deliveryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  deliveryTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 8, flex: 1 },
  deliveryAddress: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 },
  deliveryMeta: { gap: 8 },
  deliveryMetaItem: { flexDirection: 'row', alignItems: 'center' },
  deliveryMetaText: { fontSize: 14, color: '#666', marginLeft: 8 },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  checkoutTotalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
  },
  checkoutButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
}); 