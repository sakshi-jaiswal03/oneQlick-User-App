import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  actionText: string;
}

interface CarouselProps {
  items: CarouselItem[];
  currentIndex: number;
  onItemChange: (index: number) => void;
  onItemPress?: (item: CarouselItem) => void;
}

export default function Carousel({ 
  items, 
  currentIndex, 
  onItemChange,
  onItemPress 
}: CarouselProps) {
  const carouselRef = useRef<ScrollView>(null);

  // Auto-scroll carousel when index changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        x: currentIndex * width,
        animated: true,
      });
    }
  }, [currentIndex]);

  const renderCarouselItem = (item: CarouselItem, index: number) => (
    <View key={item.id} style={[styles.carouselItem, { width }]}>
      <Surface style={[styles.carouselCard, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.carouselContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon as any} size={32} color="white" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
          </View>
          <Pressable 
            style={styles.actionButton}
            onPress={() => onItemPress?.(item)}
          >
            <Text style={styles.actionButtonText}>{item.actionText}</Text>
            <MaterialIcons name="arrow-forward" size={16} color="white" />
          </Pressable>
        </View>
      </Surface>
    </View>
  );

  return (
    <View style={styles.carouselSection}>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carouselScrollView}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          onItemChange(newIndex);
        }}
      >
        {items.map(renderCarouselItem)}
      </ScrollView>
      
      {/* Carousel Indicators */}
      <View style={styles.carouselIndicators}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.carouselIndicator,
              index === currentIndex && styles.carouselIndicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselSection: {
    marginBottom: 24,
  },
  carouselScrollView: {
    height: 160,
  },
  carouselItem: {
    paddingHorizontal: 20,
  },
  carouselCard: {
    height: 160,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  carouselIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 6,
  },
  carouselIndicatorActive: {
    backgroundColor: '#FF6B35',
    width: 20,
    height: 6,
    borderRadius: 3,
  },
}); 