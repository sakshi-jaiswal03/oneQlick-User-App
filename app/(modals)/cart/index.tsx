import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  BackHandler,
  Text,
  Modal,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../../hooks/useCart';
import { cartData, availableCoupons } from './cartData';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  const displayCart = cart;
  const deliveryTime = '25-30 mins';
  const deliveryAddress = 'Home - Konkan, Mumbai';
  const contactName = 'Taha';
  const contactPhone = '+91 98765 43210';

  // Handle back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showCouponModal) {
          setShowCouponModal(false);
          return true;
        }
        router.push('/(tabs)/home');
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router, showCouponModal])
  );

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
    setShowCouponModal(false);
  };

  const handleProceedToCheckout = () => {
    if (displayCart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    router.push('/checkout');
  };

  // Coupon Modal
  const renderCouponModal = () => (
    <Modal
      visible={showCouponModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCouponModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.couponModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Available Coupons</Text>
            <Pressable onPress={() => setShowCouponModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {availableCoupons.map((coupon, index) => {
              const isEligible = bill.subtotal >= coupon.minOrder;
              const isApplied = appliedCoupon?.code === coupon.code;
              
              return (
                <View key={index} style={[styles.couponItem, !isEligible && styles.disabledCoupon]}>
                  <View style={styles.couponLeft}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                    <Text style={styles.couponTitle}>{coupon.title}</Text>
                    <Text style={styles.couponDesc}>{coupon.description}</Text>
                    {!isEligible && (
                      <Text style={styles.minOrderText}>Min order ₹{coupon.minOrder}</Text>
                    )}
                  </View>
                  <View style={styles.couponRight}>
                    {isApplied ? (
                      <Text style={styles.appliedText}>Applied</Text>
                    ) : isEligible ? (
                      <Pressable style={styles.applyBtn} onPress={() => handleApplyCoupon(coupon)}>
                        <Text style={styles.applyText}>Apply</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

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
      {/* 1. Top Navigation with Delivery Time + Address */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.push('/(tabs)/home')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.deliveryTime}>{deliveryTime}</Text>
          <Text style={styles.address}>{deliveryAddress}</Text>
        </View>
        <View style={styles.navRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* 1. Items - Just dish names with veg/non-veg icons */}
        <View style={styles.section}>
          {displayCart.items.map((item) => {
            const foodItem = item.foodItem || {};
            const quantity = item.quantity || 1;
            
            return (
              <View key={item.id} style={styles.dishItem}>
                <View style={styles.dishLeft}>
                  <View style={[styles.vegIcon, { backgroundColor: foodItem.isVeg ? '#0f8644' : '#e43b4f' }]}>
                    <MaterialCommunityIcons 
                      name={foodItem.isVeg ? 'circle' : 'triangle'} 
                      size={8} 
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

        {/* 2. Available Coupons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coupons</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCouponBox}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.appliedCouponText}>{appliedCoupon.code} applied • Saved ₹{bill.discount}</Text>
              <Pressable onPress={() => setAppliedCoupon(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.couponBox} onPress={() => setShowCouponModal(true)}>
              <MaterialCommunityIcons name="tag" size={20} color="#FF6B35" />
              <Text style={styles.couponText}>Apply Coupon</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
            </Pressable>
          )}
        </View>

        {/* 3. Time taking for delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.deliveryBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.deliveryText}>Your order will be delivered in {deliveryTime}</Text>
          </View>
        </View>

        {/* 4. Name and phone number for delivery contact */}
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

        {/* 5. Bill and all other */}
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

      {/* 6. Bottom section with policy and payment (no bottom nav) */}
      <View style={styles.bottomSection}>
        <Text style={styles.policyText}>
          By placing this order, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Pressable style={styles.payBtn} onPress={handleProceedToCheckout}>
          <Text style={styles.payBtnText}>Pay ₹{bill.total.toFixed(0)} & Place Order</Text>
        </Pressable>
      </View>

      {renderCouponModal()}
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
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
    width: 16,
    height: 16,
    borderRadius: 2,
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
  couponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe0d6',
    gap: 8,
  },
  couponText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    flex: 1,
  },
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
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  couponModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  couponItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  disabledCoupon: {
    opacity: 0.5,
  },
  couponLeft: {
    flex: 1,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  minOrderText: {
    fontSize: 12,
    color: '#F44336',
  },
  couponRight: {
    justifyContent: 'center',
  },
  applyBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  appliedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
}); 