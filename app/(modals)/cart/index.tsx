import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  BackHandler,
  Text,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../../hooks/useCart';
import { cartData, availableCoupons } from './cartData';
import { getCurrentLocation } from '../../../utils/locationUtils';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [userLocation, setUserLocation] = useState('Getting your location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  const displayCart = cart;
  const deliveryTime = '25-30 mins';
  const contactName = 'Taha';
  const contactPhone = '+91 98765 43210';

  // Get location on component mount (same as home page)
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const locationData = await getCurrentLocation();
        setUserLocation(locationData.displayName);
        setIsLoadingLocation(false);
      } catch (error) {
        console.log('Location not available:', error);
        setUserLocation('Tap to set your location');
        setIsLoadingLocation(false);
      }
    };
    
    initializeLocation();
  }, []);

  // Handle back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push('/(tabs)/home');
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  // Handle location edit
  const handleEditLocation = () => {
    Alert.alert(
      'Update Location',
      'Get your precise location for accurate delivery and nearby restaurant suggestions.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Detect My Location', onPress: async () => {
          setIsLoadingLocation(true);
          setUserLocation('Getting your location...');
          try {
            const locationData = await getCurrentLocation();
            setUserLocation(locationData.displayName);
          } catch (error) {
            setUserLocation('Tap to set your location');
          }
          setIsLoadingLocation(false);
        }},
        { text: 'Enter Manually', onPress: () => {
          Alert.alert('Coming Soon', 'Manual location entry will be available soon!');
        }}
      ]
    );
  };

  // Calculate bill
  const calculateBill = () => {
    if (displayCart.items.length === 0) {
      return { subtotal: 0, gst: 0, deliveryFee: 0, platformFee: 0, discount: 0, total: 0 };
    }

    const subtotal = displayCart.items.reduce((total, item) => {
      const itemTotal = (item.foodItem?.price || 0) * (item.quantity || 1);
      const addOnsTotal = (item.addOns || []).reduce((sum, addOn) => sum + (addOn?.price || 0), 0);
      return total + itemTotal + addOnsTotal;
    }, 0);

    const deliveryFee = subtotal >= 199 ? 0 : 49;
    const platformFee = 5;
    const gst = subtotal * 0.05;
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.min(subtotal * (appliedCoupon.discount / 100), appliedCoupon.maxDiscount || subtotal);
      } else {
        discount = appliedCoupon.discount;
      }
    }

    const total = subtotal + gst + deliveryFee + platformFee - discount;

    return { subtotal, gst, deliveryFee, platformFee, discount, total };
  };

  const bill = calculateBill();

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    const item = displayCart.items.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = increment ? (item.quantity || 1) + 1 : Math.max(1, (item.quantity || 1) - 1);
    
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleApplyCoupon = (coupon: any) => {
    if (bill.subtotal < coupon.minOrder) {
      Alert.alert('Invalid Coupon', `Minimum order amount is ₹${coupon.minOrder}`);
      return;
    }
    setAppliedCoupon(coupon);
  };



  const handleProceedToCheckout = () => {
    if (displayCart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    router.push('/checkout');
  };

    // Get eligible coupons for display
  const getEligibleCoupons = () => {
    return availableCoupons.filter(coupon => bill.subtotal >= coupon.minOrder).slice(0, 2);
  };

  const eligibleCoupons = getEligibleCoupons();

  // Empty cart
  if (displayCart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCart}>
          <MaterialCommunityIcons name="cart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Pressable style={styles.shopBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Top Navigation with Dynamic Address */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.push('/(tabs)/home')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.deliveryTime}>{deliveryTime}</Text>
          <Pressable style={styles.addressContainer} onPress={handleEditLocation}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#FF6B35" />
            <Text style={styles.address} numberOfLines={1}>
              {isLoadingLocation ? 'Getting location...' : userLocation}
            </Text>
            <MaterialCommunityIcons name="pencil" size={14} color="#666" />
          </Pressable>
        </View>
        <View style={styles.navRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Items - Just dish names with veg/non-veg icons */}
        <View style={styles.section}>
          {displayCart.items.map((item) => {
            const foodItem = item.foodItem || {};
            const quantity = item.quantity || 1;
            
            return (
              <View key={item.id} style={styles.dishItem}>
                <View style={styles.dishLeft}>
                  <View style={[styles.vegIcon, { backgroundColor: foodItem.isVeg ? '#4CAF50' : '#F44336' }]}>
                    <MaterialCommunityIcons 
                      name={foodItem.isVeg ? 'leaf' : 'food-drumstick'} 
                      size={10} 
                      color="#fff" 
                    />
                  </View>
                  <Text style={styles.dishName}>{foodItem.name}</Text>
                </View>
                <View style={styles.dishRight}>
                  <View style={styles.qtyControls}>
                    <Pressable 
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityChange(item.id, false)}
                    >
                      <MaterialCommunityIcons name="minus" size={16} color="#FF6B35" />
                    </Pressable>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <Pressable 
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityChange(item.id, true)}
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#FF6B35" />
                    </Pressable>
                  </View>
                  <Text style={styles.dishPrice}>₹{((foodItem.price || 0) * quantity).toFixed(0)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Available Coupons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coupons</Text>
          
          {/* Quick Apply Coupons */}
          {eligibleCoupons.length > 0 && (
            <View style={styles.quickCouponsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {eligibleCoupons.map((coupon, index) => (
                  <Pressable 
                    key={index} 
                    style={[styles.quickCouponCard, appliedCoupon?.code === coupon.code && styles.appliedQuickCoupon]}
                    onPress={() => appliedCoupon?.code === coupon.code ? setAppliedCoupon(null) : handleApplyCoupon(coupon)}
                  >
                    <View style={styles.quickCouponHeader}>
                      <MaterialCommunityIcons name="tag" size={16} color="#FF6B35" />
                      <Text style={styles.quickCouponCode}>{coupon.code}</Text>
                      {appliedCoupon?.code === coupon.code && (
                        <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                      )}
                    </View>
                    <Text style={styles.quickCouponOffer}>
                      {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                    </Text>
                    <Text style={styles.quickCouponDesc} numberOfLines={2}>
                      {coupon.description}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Applied Coupon Display */}
          {appliedCoupon && (
            <View style={styles.appliedCouponBox}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.appliedCouponText}>{appliedCoupon.code} applied • Saved ₹{bill.discount}</Text>
              <Pressable onPress={() => setAppliedCoupon(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </Pressable>
            </View>
          )}
        </View>

        {/* Time taking for delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.deliveryBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.deliveryText}>Your order will be delivered in {deliveryTime}</Text>
          </View>
        </View>

        {/* Name and phone number for delivery contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Contact</Text>
          <View style={styles.contactBox}>
            <MaterialCommunityIcons name="account" size={20} color="#666" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contactName}</Text>
              <Text style={styles.contactPhone}>{contactPhone}</Text>
            </View>
          </View>
        </View>

        {/* Bill and all other */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billBox}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{bill.subtotal.toFixed(0)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={[styles.billValue, bill.deliveryFee === 0 && styles.freeText]}>
                {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹{bill.platformFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST</Text>
              <Text style={styles.billValue}>₹{bill.gst.toFixed(0)}</Text>
            </View>
            {appliedCoupon && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Discount</Text>
                <Text style={[styles.billValue, styles.discountText]}>-₹{bill.discount.toFixed(0)}</Text>
              </View>
            )}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billTotal}>Total</Text>
              <Text style={styles.billTotalValue}>₹{bill.total.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Payment Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.policyText}>
          By placing this order, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Pressable style={styles.payBtn} onPress={handleProceedToCheckout}>
          <Text style={styles.payBtnText}>Pay ₹{bill.total.toFixed(0)} & Place Order</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Top Navigation
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    maxWidth: 250,
  },
  address: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  navRight: {
    width: 24,
  },
  
  // Content
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  
  // Dish Items
  dishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dishLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  vegIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  dishRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    minWidth: 16,
    textAlign: 'center',
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  // Coupons
  appliedCouponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8,
  },
  appliedCouponText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    flex: 1,
  },
  
  // Quick Coupons
  quickCouponsContainer: {
    marginBottom: 12,
  },
  quickCouponCard: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ffe0d6',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 160,
    minHeight: 90,
  },
  appliedQuickCoupon: {
    backgroundColor: '#f0f9f0',
    borderColor: '#4CAF50',
  },
  quickCouponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  quickCouponCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
    flex: 1,
  },
  quickCouponOffer: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  quickCouponDesc: {
    fontSize: 10,
    color: '#666',
    lineHeight: 12,
  },
  
  // Delivery Time
  deliveryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Contact
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  contactPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // Bill
  billBox: {
    gap: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  freeText: {
    color: '#4CAF50',
  },
  discountText: {
    color: '#4CAF50',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  billTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  billTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  
  // Bottom Section
  bottomSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  policyText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  payBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  
  // Empty Cart
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
}); 