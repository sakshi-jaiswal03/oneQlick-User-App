import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Chip } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  offerText: string;
  backgroundColor: string;
}

interface PromotionalBannersProps {
  banners: PromotionalBanner[];
  currentIndex: number;
  onBannerChange: (index: number) => void;
}

export default function PromotionalBanners({ 
  banners, 
  currentIndex, 
  onBannerChange 
}: PromotionalBannersProps) {
  const bannerScrollRef = useRef<ScrollView>(null);

  // Auto-scroll banner when index changes
  useEffect(() => {
    if (bannerScrollRef.current) {
      bannerScrollRef.current.scrollTo({
        x: currentIndex * width,
        animated: true,
      });
    }
  }, [currentIndex]);

  const renderBanner = (banner: PromotionalBanner, index: number) => (
    <View key={banner.id} style={[styles.bannerContainer, { width }]}>
      <Image source={{ uri: banner.image }} style={styles.bannerImage} />
      <View style={[styles.bannerOverlay, { backgroundColor: banner.backgroundColor }]}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
          <Chip style={styles.offerChip} textStyle={styles.offerChipText}>
            {banner.offerText}
          </Chip>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.bannerSection}>
      <ScrollView
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerScrollView}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          onBannerChange(newIndex);
        }}
      >
        {banners.map(renderBanner)}
      </ScrollView>
      
      {/* Banner Indicators */}
      <View style={styles.bannerIndicators}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.bannerIndicator,
              index === currentIndex && styles.bannerIndicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerSection: {
    marginBottom: 20,
  },
  bannerScrollView: {
    height: 200,
  },
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerContent: {
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
    opacity: 0.9,
  },
  offerChip: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  offerChipText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  bannerIndicatorActive: {
    backgroundColor: '#FF6B35',
    width: 24,
  },
}); 