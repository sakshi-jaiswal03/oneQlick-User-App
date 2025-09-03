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
          <View style={styles.topRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.icon as any} size={28} color="white" />
            </View>
            <Pressable 
              style={styles.actionButton}
              onPress={() => onItemPress?.(item)}
            >
              <Text style={styles.actionButtonText}>{item.actionText}</Text>
              <MaterialIcons name="arrow-forward" size={14} color="white" />
            </Pressable>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
          </View>
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
          <Pressable
            key={index}
            style={[
              styles.carouselIndicator,
              index === currentIndex && styles.carouselIndicatorActive
            ]}
            onPress={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollTo({
                  x: index * width,
                  animated: true,
                });
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  carouselScrollView: {
    height: 140,
  },
  carouselItem: {
    paddingHorizontal: 16,
  },
  carouselCard: {
    height: 140,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  carouselSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  carouselIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 4,
  },
  carouselIndicatorActive: {
    backgroundColor: '#FF6B35',
    width: 16,
    height: 6,
    borderRadius: 3,
  },
}); 