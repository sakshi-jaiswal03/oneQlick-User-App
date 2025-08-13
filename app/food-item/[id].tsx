import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  IconButton,
  Badge,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';

const { width, height } = Dimensions.get('window');

// Inline data for now
const foodItemData = {
  id: 'chicken-biryani',
  name: 'Chicken Biryani',
  description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices and herbs.',
  price: 180,
  originalPrice: 220,
  images: [
    'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
  ],
  rating: 4.5,
  reviewCount: 120,
  isVeg: false,
  isPopular: true,
  prepTime: '20-25 minutes',
  calories: 450,
  cuisine: 'Hyderabadi',
  nutrition: { protein: 25, carbs: 65, fat: 12, fiber: 8 },
  ingredients: 'Basmati rice, chicken, onions, tomatoes, ginger, garlic, spices.',
  allergens: ['Dairy', 'Gluten'],
};

const customizationOptions = [
  {
    id: 'addons',
    name: 'Add-ons',
    required: false,
    maxSelections: 3,
    options: [
      { id: 'extra-raita', name: 'Extra Raita', price: 20, selected: false },
      { id: 'boiled-egg', name: 'Boiled Egg', price: 15, selected: false },
      { id: 'extra-pickle', name: 'Extra Pickle', price: 10, selected: false },
    ],
  },
];

export default function FoodItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const foodItemId = params.id as string;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState(customizationOptions);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const foodItem = foodItemData;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const calculateTotalPrice = () => {
    let basePrice = foodItem.price;
    if (selectedSize === 'large') basePrice += 50;
    
    let customizationPrice = 0;
    customizations.forEach(group => {
      group.options.forEach(option => {
        if (option.selected) customizationPrice += option.price;
      });
    });
    
    return (basePrice + customizationPrice) * quantity;
  };

  const handleCustomizationToggle = (groupId: string, optionId: string) => {
    setCustomizations(prev => prev.map(group => {
      if (group.id === groupId) {
        const newOptions = group.options.map(option => {
          if (option.id === optionId) {
            if (group.maxSelections && 
                option.selected === false && 
                group.options.filter(opt => opt.selected).length >= group.maxSelections) {
              return option;
            }
            return { ...option, selected: !option.selected };
          }
          return option;
        });
        return { ...group, options: newOptions };
      }
      return group;
    }));
  };

  const handleAddToCart = () => {
    const selectedCustomizations = customizations
      .flatMap(group => group.options.filter(option => option.selected))
      .map(option => ({
        id: option.id,
        name: option.name,
        price: option.price,
        isAvailable: true,
      }));

    const cartItem = {
      id: `${foodItem.id}-${Date.now()}`,
      name: foodItem.name,
      description: foodItem.description,
      price: foodItem.price,
      image: foodItem.images[currentImageIndex],
      category: 'Customized',
      isVeg: foodItem.isVeg,
      isAvailable: true,
      isPopular: foodItem.isPopular,
      isRecommended: false,
      addOns: selectedCustomizations,
    };

    addToCart(cartItem, quantity);
    
    Alert.alert(
      'Added to Cart!',
      `${quantity}x ${foodItem.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(modals)/cart') }
      ]
    );
  };

  const renderImageCarousel = () => (
    <View style={styles.imageSection}>
      <Pressable style={styles.imageContainer}>
        <Image
          source={{ uri: foodItem.images[currentImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        <View style={styles.imageOverlay}>
          <View style={styles.imageBadges}>
            {foodItem.isVeg && (
              <Chip style={styles.vegBadge} textStyle={styles.vegBadgeText}>
                Veg
              </Chip>
            )}
            {foodItem.isPopular && (
              <Chip style={styles.popularBadge} textStyle={styles.popularBadgeText}>
                Popular
              </Chip>
            )}
          </View>
          
          {foodItem.images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {foodItem.images.length}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.zoomIndicator}>
          <MaterialIcons name="zoom-in" size={24} color="white" />
        </View>
      </Pressable>
      
      {foodItem.images.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
          {foodItem.images.map((image: string, index: number) => (
            <Pressable
              key={index}
              onPress={() => setCurrentImageIndex(index)}
              style={[styles.thumbnail, currentImageIndex === index && styles.thumbnailActive]}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderBasicInfo = () => (
    <Surface style={styles.basicInfoCard}>
      <View style={styles.basicInfoHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.itemName}>{foodItem.name}</Text>
          <Text style={styles.itemDescription}>{foodItem.description}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <IconButton
            icon={isFavorite ? "favorite" : "favorite-border"}
            size={24}
            iconColor={isFavorite ? "#FF6B35" : "#666"}
            onPress={() => setIsFavorite(!isFavorite)}
          />
        </View>
      </View>
      
      <View style={styles.ratingSection}>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{foodItem.rating}</Text>
          <Text style={styles.ratingCount}>({foodItem.reviewCount} reviews)</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{foodItem.price}</Text>
          {foodItem.originalPrice && (
            <Text style={styles.originalPrice}>₹{foodItem.originalPrice}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.metaText}>{foodItem.prepTime}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <MaterialIcons name="local-fire-department" size={16} color="#666" />
          <Text style={styles.metaText}>{foodItem.calories} cal</Text>
        </View>
        
        <View style={styles.metaItem}>
          <MaterialIcons name="restaurant" size={16} color="#666" />
          <Text style={styles.metaText}>{foodItem.cuisine}</Text>
        </View>
      </View>
    </Surface>
  );

  const renderCustomizationSection = () => (
    <Surface style={styles.customizationCard}>
      <Text style={styles.sectionTitle}>Customize Your Order</Text>
      
      <View style={styles.customizationGroup}>
        <Text style={styles.groupTitle}>Size *</Text>
        <View style={styles.sizeOptions}>
          <Pressable
            style={[styles.sizeOption, selectedSize === 'regular' && styles.sizeOptionActive]}
            onPress={() => setSelectedSize('regular')}
          >
            <Text style={[styles.sizeOptionText, selectedSize === 'regular' && styles.sizeOptionTextActive]}>
              Regular
            </Text>
            <Text style={styles.sizeOptionPrice}>+₹0</Text>
          </Pressable>
          
          <Pressable
            style={[styles.sizeOption, selectedSize === 'large' && styles.sizeOptionActive]}
            onPress={() => setSelectedSize('large')}
          >
            <Text style={[styles.sizeOptionText, selectedSize === 'large' && styles.sizeOptionTextActive]}>
              Large
            </Text>
            <Text style={styles.sizeOptionPrice}>+₹50</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.customizationGroup}>
        <Text style={styles.groupTitle}>Spice Level</Text>
        <View style={styles.spiceOptions}>
          {['mild', 'medium', 'hot'].map((level) => (
            <Pressable
              key={level}
              style={[styles.spiceOption, spiceLevel === level && styles.spiceOptionActive]}
              onPress={() => setSpiceLevel(level)}
            >
              <Text style={[styles.spiceOptionText, spiceLevel === level && styles.spiceOptionTextActive]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      {customizations.map((group) => (
        <View key={group.id} style={styles.customizationGroup}>
          <Text style={styles.groupTitle}>
            {group.name}
            {group.maxSelections && (
              <Text style={styles.maxSelections}> (Max {group.maxSelections})</Text>
            )}
          </Text>
          
          <View style={styles.addonOptions}>
            {group.options.map((option) => (
              <Pressable
                key={option.id}
                style={[styles.addonOption, option.selected && styles.addonOptionActive]}
                onPress={() => handleCustomizationToggle(group.id, option.id)}
              >
                <View style={styles.addonInfo}>
                  <Text style={[styles.addonName, option.selected && styles.addonNameActive]}>
                    {option.name}
                  </Text>
                  <Text style={styles.addonPrice}>+₹{option.price}</Text>
                </View>
                
                <View style={[styles.selectionIndicator, option.selected && styles.selectionIndicatorActive]}>
                  {option.selected && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Surface>
  );

  const renderQuantitySection = () => (
    <Surface style={styles.quantityCard}>
      <View style={styles.quantityHeader}>
        <Text style={styles.quantityTitle}>Quantity</Text>
        <Text style={styles.totalPrice}>₹{calculateTotalPrice()}</Text>
      </View>
      
      <View style={styles.quantitySelector}>
        <Pressable
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <MaterialIcons name="remove" size={24} color="#FF6B35" />
        </Pressable>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <Pressable
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <MaterialIcons name="add" size={24} color="#FF6B35" />
        </Pressable>
      </View>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Food Item</Text>
          <View style={styles.headerActions}>
            <IconButton
              icon="shopping-cart"
              size={24}
              iconColor="#333"
              onPress={() => router.push('/(modals)/cart')}
            />
            <Badge style={styles.cartBadge} size={16}>3</Badge>
          </View>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderImageCarousel()}
          {renderBasicInfo()}
          {renderCustomizationSection()}
          {renderQuantitySection()}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
      
      <Surface style={styles.addToCartBar}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartTotalLabel}>Total</Text>
          <Text style={styles.cartTotalPrice}>₹{calculateTotalPrice()}</Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          contentStyle={styles.addToCartButtonContent}
        >
          Add to Cart
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
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#FF6B35' },
  scrollView: { flex: 1 },
  imageSection: { marginBottom: 20 },
  imageContainer: { position: 'relative', height: 300 },
  mainImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  imageBadges: { flexDirection: 'row', gap: 8 },
  vegBadge: { backgroundColor: '#4CAF50' },
  vegBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  popularBadge: { backgroundColor: '#FF6B35' },
  popularBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  imageCounter: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: { color: 'white', fontSize: 12, fontWeight: '600' },
  zoomIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 20,
  },
  thumbnailContainer: { paddingHorizontal: 20, marginTop: 16 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: { borderColor: '#FF6B35' },
  thumbnailImage: { width: '100%', height: '100%', borderRadius: 6 },
  basicInfoCard: { margin: 20, marginTop: 0, padding: 20, borderRadius: 16, elevation: 2 },
  basicInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titleSection: { flex: 1, marginRight: 16 },
  itemName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  itemDescription: { fontSize: 16, color: '#666', lineHeight: 24 },
  actionButtons: { flexDirection: 'row' },
  ratingSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 4, marginRight: 8 },
  ratingCount: { fontSize: 14, color: '#666' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35' },
  originalPrice: { fontSize: 18, color: '#999', textDecorationLine: 'line-through' },
  metaInfo: { flexDirection: 'row', justifyContent: 'space-around' },
  metaItem: { alignItems: 'center' },
  metaText: { fontSize: 12, color: '#666', marginTop: 4 },
  customizationCard: { margin: 20, marginTop: 0, padding: 20, borderRadius: 16, elevation: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  customizationGroup: { marginBottom: 24 },
  groupTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  maxSelections: { fontSize: 14, color: '#666', fontWeight: 'normal' },
  sizeOptions: { flexDirection: 'row', gap: 12 },
  sizeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
  },
  sizeOptionActive: { borderColor: '#FF6B35', backgroundColor: '#FFF3E0' },
  sizeOptionText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  sizeOptionTextActive: { color: '#FF6B35' },
  sizeOptionPrice: { fontSize: 14, color: '#666' },
  spiceOptions: { flexDirection: 'row', gap: 12 },
  spiceOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  spiceOptionActive: { borderColor: '#FF6B35', backgroundColor: '#FFF3E0' },
  spiceOptionText: { fontSize: 14, fontWeight: '500', color: '#333' },
  spiceOptionTextActive: { color: '#FF6B35', fontWeight: '600' },
  addonOptions: { gap: 12 },
  addonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addonOptionActive: { borderColor: '#FF6B35', backgroundColor: '#FFF3E0' },
  addonInfo: { flex: 1 },
  addonName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  addonNameActive: { color: '#FF6B35', fontWeight: '600' },
  addonPrice: { fontSize: 14, color: '#666' },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorActive: { borderColor: '#FF6B35', backgroundColor: '#FF6B35' },
  quantityCard: { margin: 20, marginTop: 0, padding: 20, borderRadius: 16, elevation: 2 },
  quantityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  quantityTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#FF6B35' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityText: { fontSize: 24, fontWeight: 'bold', color: '#333', minWidth: 40, textAlign: 'center' },
  addToCartBar: {
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
  cartInfo: { flex: 1 },
  cartTotalLabel: { fontSize: 14, color: '#666', marginBottom: 2 },
  cartTotalPrice: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35' },
  addToCartButton: { backgroundColor: '#FF6B35' },
  addToCartButtonContent: { paddingHorizontal: 32, paddingVertical: 8 },
}); 