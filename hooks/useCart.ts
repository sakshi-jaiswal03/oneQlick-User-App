import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, CartItem, Cart } from '../types';

const CART_STORAGE_KEY = 'oneQlick_cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    id: '',
    userId: '',
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    appliedOffers: [],
    discountAmount: 0,
  });

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (foodItem: FoodItem, quantity: number = 1, customization?: Record<string, string>, addOns: string[] = []) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => 
          item.foodItem.id === foodItem.id &&
          JSON.stringify(item.customization) === JSON.stringify(customization) &&
          JSON.stringify(item.addOns.map(a => a.id)) === JSON.stringify(addOns)
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].totalPrice = 
          (updatedItems[existingItemIndex].foodItem.price + 
           updatedItems[existingItemIndex].addOns.reduce((sum, addOn) => {
             return sum + addOn.price;
           }, 0)) * updatedItems[existingItemIndex].quantity;

        return calculateCartTotals({
          ...prevCart,
          items: updatedItems,
        });
      } else {
        // Add new item
        const addOnObjects = foodItem.addOns?.filter(addOn => addOns.includes(addOn.id)) || [];
        const addOnsTotal = addOnObjects.reduce((sum, addOn) => sum + addOn.price, 0);
        const itemTotalPrice = (foodItem.price + addOnsTotal) * quantity;

        const newItem: CartItem = {
          id: Date.now().toString(),
          foodItem: foodItem,
          quantity,
          customization,
          addOns: addOns.map(addOnId => {
            const addOn = foodItem.addOns?.find(a => a.id === addOnId);
            return addOn || { id: addOnId, name: '', price: 0, isAvailable: true };
          }),
          totalPrice: itemTotalPrice,
        };

        return calculateCartTotals({
          ...prevCart,
          items: [...prevCart.items, newItem],
        });
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return calculateCartTotals({
        ...prevCart,
        items: updatedItems,
      });
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          const addOnsTotal = item.addOns.reduce((sum, addOn) => {
            return sum + addOn.price;
          }, 0);
          return {
            ...item,
            quantity,
            totalPrice: (item.foodItem.price + addOnsTotal) * quantity,
          };
        }
        return item;
      });

      return calculateCartTotals({
        ...prevCart,
        items: updatedItems,
      });
    });
  };

  const clearCart = () => {
    setCart({
      id: '',
      userId: '',
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      appliedOffers: [],
      discountAmount: 0,
    });
  };

  const calculateCartTotals = (cartData: Cart): Cart => {
    const subtotal = cartData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryFee = subtotal > 0 ? 30 : 0; // Base delivery fee
    const tax = Math.round((subtotal * 5) / 100); // 5% tax
    const total = subtotal + deliveryFee + tax - cartData.discountAmount;

    return {
      ...cartData,
      subtotal,
      deliveryFee,
      tax,
      total: Math.max(0, total),
    };
  };

  const getCartItemCount = (): number => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isCartEmpty = (): boolean => {
    return cart.items.length === 0;
  };

  const getRestaurantId = (): string | undefined => {
    if (cart.items.length === 0) return undefined;
    return cart.items[0].foodItem.id.split('_')[0]; // Assuming food item ID contains restaurant ID
  };

  const canCheckout = (): boolean => {
    return !isCartEmpty() && cart.total > 0;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    isCartEmpty,
    getRestaurantId,
    canCheckout,
  };
} 