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
    <Surface key={item.foodItem.id} style={styles.cartItemCard}>
      {/* Item Image */}
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.foodItem.image }} style={styles.itemImage} />
        {item.foodItem.isVeg && (
          <View style={styles.vegIndicator}>
            <MaterialIcons name="circle" size={12} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.foodItem.name}
        </Text>
        
        {item.foodItem.description && (
          <Text style={styles.itemDescription} numberOfLines={1}>
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
        <View style={styles.itemFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>₹{item.foodItem.price}</Text>
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
    <Surface style={styles.billCard}>
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
          
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{bill.total.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </Surface>
  );

  const renderCouponSection = () => (
    <Surface style={styles.couponCard}>
      <Text style={styles.sectionTitle}>Apply Coupon</Text>
      
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
            style={styles.applyCouponButton}
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
      <View style={styles.emptyCartIllustration}>
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
        <View style={styles.header}>
          <IconButton
            icon="arrow-back-ios"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 48 }} />
        </View>
        
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-back-ios"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Cart ({cart.items.length})</Text>
          <IconButton
            icon="delete-sweep"
            size={24}
            iconColor="#F44336"
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
          />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
      </Animated.View>

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
  cartItemsContainer: { padding: 16, gap: 16 },
  cartItemCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  itemImageContainer: { position: 'relative', marginRight: 16 },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  vegIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  itemDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  addOnsContainer: { marginBottom: 8 },
  addOnsLabel: { fontSize: 12, color: '#666', fontWeight: '500', marginBottom: 2 },
  addOnText: { fontSize: 12, color: '#666', marginLeft: 8 },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#333', minWidth: 24, textAlign: 'center' },
  removeButton: { marginLeft: 8 },
  couponCard: { margin: 16, padding: 16, borderRadius: 16, elevation: 2, backgroundColor: 'white' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 },
  couponInputContainer: { flexDirection: 'row', gap: 12 },
  couponInput: { flex: 1 },
  applyCouponButton: { backgroundColor: '#FF6B35' },
  appliedCouponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  appliedCouponInfo: { flex: 1 },
  appliedCouponCode: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginBottom: 2 },
  appliedCouponDescription: { fontSize: 14, color: '#666' },
  couponError: { color: '#F44336', fontSize: 14, marginTop: 8 },
  couponSuccess: { color: '#4CAF50', fontSize: 14, marginTop: 8 },
  deliveryCard: { margin: 16, padding: 16, borderRadius: 16, elevation: 2, backgroundColor: 'white' },
  deliveryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  deliveryTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 8, flex: 1 },
  deliveryAddress: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 },
  deliveryMeta: { gap: 8 },
  deliveryMetaItem: { flexDirection: 'row', alignItems: 'center' },
  deliveryMetaText: { fontSize: 14, color: '#666', marginLeft: 8 },
  billCard: { margin: 16, borderRadius: 16, elevation: 2, backgroundColor: 'white', overflow: 'hidden' },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  billTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  billDetails: { padding: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  billLabel: { fontSize: 14, color: '#666' },
  billValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  discountText: { color: '#4CAF50', fontWeight: 'bold' },
  billDivider: { marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF6B35' },
  checkoutBar: {
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
  checkoutInfo: { flex: 1 },
  checkoutTotalLabel: { fontSize: 14, color: '#666', marginBottom: 2 },
  checkoutTotalPrice: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35' },
  checkoutButton: { backgroundColor: '#FF6B35' },
  checkoutButtonContent: { paddingHorizontal: 32, paddingVertical: 8 },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCartIllustration: { marginBottom: 24 },
  emptyCartTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  continueShoppingButton: { backgroundColor: '#FF6B35' },
  continueShoppingButtonContent: { paddingHorizontal: 32, paddingVertical: 12 },
}); 