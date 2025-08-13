import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  titleHindi: string;
  subtitle: string;
  subtitleHindi: string;
  description: string;
  descriptionHindi: string;
  icon: string;
  gradient: string[];
  image: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Order Food',
    titleHindi: 'खाना ऑर्डर करें',
    subtitle: 'from local restaurants',
    subtitleHindi: 'स्थानीय रेस्तरां से',
    description: 'Choose from hundreds of local restaurants and order your favorite dishes with just a few taps.',
    descriptionHindi: 'सैकड़ों स्थानीय रेस्तरां से चुनें और कुछ ही टैप में अपने पसंदीदा व्यंजन ऑर्डर करें।',
    icon: 'restaurant',
    gradient: ['#FF6B35', '#FF8A65'],
    image: '🍕',
  },
  {
    id: 2,
    title: 'Fast Delivery',
    titleHindi: 'तेज़ डिलीवरी',
    subtitle: 'to your doorstep',
    subtitleHindi: 'आपके दरवाजे तक',
    description: 'Get fresh, hot food delivered to your home in 30 minutes or less. Track your order in real-time.',
    descriptionHindi: '30 मिनट या उससे कम समय में अपने घर तक ताजा, गर्म खाना पहुंचाएं। अपने ऑर्डर को रीयल-टाइम में ट्रैक करें।',
    icon: 'delivery-dining',
    gradient: ['#4CAF50', '#66BB6A'],
    image: '🚚',
  },
  {
    id: 3,
    title: 'Fresh & Delicious',
    titleHindi: 'ताजा और स्वादिष्ट',
    subtitle: 'meals every time',
    subtitleHindi: 'हर बार भोजन',
    description: 'Enjoy fresh ingredients, authentic flavors, and hygienic food prepared by trusted local chefs.',
    descriptionHindi: 'ताजे सामग्री, प्रामाणिक स्वाद, और विश्वसनीय स्थानीय शेफ द्वारा तैयार स्वच्छ भोजन का आनंद लें।',
    icon: 'local-dining',
    gradient: ['#FF9800', '#FFB74D'],
    image: '🍽️',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHindi, setShowHindi] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Animation values
  const fadeAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide < onboardingSlides.length - 1) {
        handleNext();
      }
    }, 5000); // Increased to 5 seconds for better readability

    return () => clearInterval(timer);
  }, [currentSlide]);

  // Enhanced animations on slide change
  useEffect(() => {
    // Fade in animation
    fadeAnim.value = withTiming(0, { duration: 200 }, () => {
      fadeAnim.value = withTiming(1, { duration: 500 });
    });

    // Scale animation for food emoji
    scaleAnim.value = withTiming(1.1, { duration: 300 }, () => {
      scaleAnim.value = withTiming(1, { duration: 300 });
    });
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(auth)/login');
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(auth)/login');
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const handleLanguageToggle = () => {
    setShowHindi(!showHindi);
  };

  // Animated styles
  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            slideAnim.value,
            [0, 1],
            [0, -width],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const fadeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const scaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      {/* Background Gradient */}
      <View style={[styles.gradientBackground, { backgroundColor: slide.gradient[0] }]}>
        <View style={[styles.gradientOverlay, { backgroundColor: slide.gradient[1] }]} />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Food Image/Emoji */}
        <Animated.View style={[styles.imageContainer, scaleAnimatedStyle]}>
          <Text style={styles.foodEmoji}>{slide.image}</Text>
          <View style={styles.iconContainer}>
            <MaterialIcons name={slide.icon as any} size={40} color="white" />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View style={[styles.textContainer, fadeAnimatedStyle]}>
          <Text style={styles.title}>
            {showHindi ? slide.titleHindi : slide.title}
          </Text>
          <Text style={styles.subtitle}>
            {showHindi ? slide.subtitleHindi : slide.subtitle}
          </Text>
          <Text style={styles.description}>
            {showHindi ? slide.descriptionHindi : slide.description}
          </Text>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>oneQlick</Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            mode="text"
            onPress={handleLanguageToggle}
            style={styles.languageButton}
            textColor="white"
            labelStyle={styles.languageButtonText}
          >
            {showHindi ? 'EN' : 'हिं'}
          </Button>
          <Button
            mode="text"
            onPress={handleSkip}
            style={styles.skipButton}
            textColor="white"
            labelStyle={styles.skipButtonText}
          >
            {showHindi ? 'छोड़ें' : 'Skip'}
          </Button>
        </View>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Slide Indicators */}
        <View style={styles.indicators}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentSlide && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentSlide < onboardingSlides.length - 1 ? (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {showHindi ? 'अगला' : 'Next'}
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {showHindi ? 'शुरू करें' : 'Get Started'}
            </Button>
          )}
        </View>

        {/* Auth Buttons */}
        <View style={styles.authContainer}>
          <Button
            mode="outlined"
            onPress={async () => {
              try {
                await AsyncStorage.setItem('onboardingComplete', 'true');
                router.push('/(auth)/login');
              } catch (error) {
                console.error('Error saving onboarding status:', error);
                router.push('/(auth)/login');
              }
            }}
            style={styles.authButton}
            textColor="#FF6B35"
            labelStyle={styles.authButtonLabel}
          >
            {showHindi ? 'लॉगिन' : 'Login'}
          </Button>
          <Button
            mode="contained"
            onPress={async () => {
              try {
                await AsyncStorage.setItem('onboardingComplete', 'true');
                router.push('/(auth)/signup');
              } catch (error) {
                console.error('Error saving onboarding status:', error);
                router.push('/(auth)/login');
              }
            }}
            style={[styles.authButton, styles.signupButton]}
            labelStyle={styles.authButtonLabel}
          >
            {showHindi ? 'साइन अप' : 'Sign Up'}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    marginRight: 16,
    minHeight: 44,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    minHeight: 44,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    margin: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    opacity: 0.3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  foodEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  activeIndicator: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  navigationContainer: {
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    minHeight: 50,
  },
  getStartedButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    minHeight: 50,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  authButton: {
    flex: 1,
    borderRadius: 25,
    minHeight: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  signupButton: {
    backgroundColor: 'white',
  },
  authButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 