import { useState, useEffect, useCallback } from 'react';
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

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [cart, isLoaded]);

  const loadCart = useCallback(async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure the cart has the correct structure
        if (parsedCart && parsedCart.items) {
          setCart(parsedCart);
          console.log('Cart loaded from storage:', parsedCart);
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading cart:', error);
      setIsLoaded(true);
    }
  }, []);

  const saveCart = useCallback(async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log('Cart saved to storage:', cart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  const addToCart = useCallback(async (foodItem: FoodItem, quantity: number = 1, customization?: Record<string, string>, addOns: string[] = []) => {
    console.log('Adding to cart:', foodItem.name, quantity);
    
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

        const newCart = calculateCartTotals({
          ...prevCart,
          items: updatedItems,
        });
        console.log('Updated existing item, new cart:', newCart);
        return newCart;
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

        const newCart = calculateCartTotals({
          ...prevCart,
          items: [...prevCart.items, newItem],
        });
        console.log('Added new item, new cart:', newCart);
        return newCart;
      }
    });

    // Force immediate save to ensure badge updates
    await new Promise(resolve => setTimeout(resolve, 0));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    console.log('Removing from cart:', itemId);
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const newCart = calculateCartTotals({
        ...prevCart,
        items: updatedItems,
      });
      console.log('Item removed, new cart:', newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    console.log('Updating quantity:', itemId, quantity);
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

      const newCart = calculateCartTotals({
        ...prevCart,
        items: updatedItems,
      });
      console.log('Quantity updated, new cart:', newCart);
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    console.log('Clearing cart');
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
  }, []);

  const calculateCartTotals = useCallback((cartData: Cart): Cart => {
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
  }, []);

  const getCartItemCount = useCallback((): number => {
    const count = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    console.log('Cart item count:', count);
    return count;
  }, [cart.items]);

  const isCartEmpty = useCallback((): boolean => {
    return cart.items.length === 0;
  }, [cart.items.length]);

  const getRestaurantId = useCallback((): string | undefined => {
    if (cart.items.length === 0) return undefined;
    return cart.items[0].foodItem.id.split('_')[0]; // Assuming food item ID contains restaurant ID
  }, [cart.items]);

  const canCheckout = useCallback((): boolean => {
    return !isCartEmpty() && cart.total > 0;
  }, [cart.total, isCartEmpty]);

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