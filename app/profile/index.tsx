import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Share,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Switch,
  Menu,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  userProfile,
  profileSections,
} from './profileData';

export default function ProfileScreen() {
  const router = useRouter();
  
  // State management
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [locationServices, setLocationServices] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersPromotions, setOffersPromotions] = useState(true);
  const [appNotifications, setAppNotifications] = useState(false);
  
  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Header slide down animation
    Animated.timing(headerAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    // Content fade in animation
    Animated.timing(contentAnim, { 
      toValue: 1, 
      duration: 1000, 
      useNativeDriver: true 
    }).start();
  };

  const handleSectionPress = (section: any) => {
    switch (section.type) {
      case 'navigation':
        if (section.route) {
          // Handle different routes
          if (section.route === '/profile/addresses') {
            router.push('/profile/addresses');
          } else if (section.route === '/profile/favorites') {
            router.push('/(tabs)/home');
          } else {
            // Default navigation
            router.push(section.route);
          }
        }
        break;
      
      case 'action':
        if (section.id === 'rate-app') {
          handleRateApp();
        } else if (section.id === 'share-app') {
          handleShareApp();
        }
        break;
      
      case 'select':
        if (section.id === 'language') {
          setShowLanguageMenu(true);
        }
        break;
    }
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Would you like to rate oneQlick on the app store?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => {
            // TODO: Implement app store rating
            Alert.alert('Thank You!', 'Rating feature coming soon!');
          }
        },
      ]
    );
  };

  const handleShareApp = () => {
    Share.share({
      message: 'Check out oneQlick - the best food delivery app! Download now.',
      title: 'oneQlick Food Delivery',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout functionality
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <Animated.View 
      style={[
        styles.profileHeader,
        {
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            }),
          }],
        },
      ]}
    >
      {/* User info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.userPhone}>{userProfile.phone}</Text>
      </View>
    </Animated.View>
  );

  const renderProfileSection = (section: any) => (
    <Pressable
      key={section.id}
      style={styles.sectionItem}
      onPress={() => handleSectionPress(section)}
    >
      <Surface style={styles.sectionSurface}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <MaterialIcons name={section.icon} size={24} color="#666" />
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.subtitle && (
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            )}
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}
          </View>
          
          <View style={styles.sectionActions}>
            {section.badge && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.badgeChip} compact>
                {section.badge}
              </Chip>
            )}
            
            {section.type === 'toggle' && (
              <Switch
                value={section.value as boolean}
                onValueChange={(value) => {
                  // Handle toggle changes
                  switch (section.id) {
                    case 'order-updates':
                      setOrderUpdates(value);
                      break;
                    case 'offers-promotions':
                      setOffersPromotions(value);
                      break;
                    case 'app-notifications':
                      setAppNotifications(value);
                      break;
                    case 'location-services':
                      setLocationServices(value);
                      break;
                  }
                }}
                color="#FF6B35"
              />
            )}
            
            {section.type === 'select' && (
              <Text style={styles.selectValue}>{section.value}</Text>
            )}
            
            {(section.type === 'navigation' || section.type === 'action') && (
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );

  const renderAppInfo = () => (
    <View style={styles.appInfo}>
      <Text style={styles.appInfoText}>App Version 1.0.0</Text>
      <Text style={styles.appInfoText}>© 2024 oneQlick. All rights reserved.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {renderProfileHeader()}
        
        {/* Profile Sections */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: contentAnim,
            },
          ]}
        >
          {/* Personal Info Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Personal Information</Text>
            {profileSections
              .filter(section => ['personal-info', 'change-password'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Account Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>My Account</Text>
            {profileSections
              .filter(section => ['saved-addresses', 'payment-methods', 'favorite-restaurants'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Orders Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Orders & History</Text>
            {profileSections
              .filter(section => ['order-history', 'track-orders'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Notifications Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Notifications</Text>
            {profileSections
              .filter(section => ['order-updates', 'offers-promotions', 'app-notifications'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Support Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Support</Text>
            {profileSections
              .filter(section => ['contact-us', 'rate-app'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Settings Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Settings</Text>
            {profileSections
              .filter(section => ['language', 'location-services', 'data-usage'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Share App Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>App</Text>
            <Pressable
              style={styles.sectionItem}
              onPress={handleShareApp}
            >
              <Surface style={styles.sectionSurface}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="share" size={24} color="#666" />
                  </View>
                  
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>Share App</Text>
                    <Text style={styles.sectionSubtitle}>Share oneQlick with friends & family</Text>
                  </View>
                  
                  <View style={styles.sectionActions}>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </View>
                </View>
              </Surface>
            </Pressable>
          </View>
          
          {/* App Info */}
          {renderAppInfo()}
          
          {/* Logout Button */}
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor="#F44336"
            buttonColor="transparent"
          >
            Logout
          </Button>
          
          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
      
      {/* Language Selection Menu */}
      <Menu
        visible={showLanguageMenu}
        onDismiss={() => setShowLanguageMenu(false)}
        anchor={<View />}
      >
        <Menu.Item
          onPress={() => {
            setSelectedLanguage('English');
            setShowLanguageMenu(false);
          }}
          title="English"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => {
            setSelectedLanguage('Hindi');
            setShowLanguageMenu(false);
          }}
          title="Hindi"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => {
            setSelectedLanguage('Gujarati');
            setShowLanguageMenu(false);
          }}
          title="Gujarati"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => {
            setSelectedLanguage('Marathi');
            setShowLanguageMenu(false);
          }}
          title="Marathi"
          leadingIcon="language"
        />
      </Menu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  
  // Profile Header Styles
  profileHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 20,
    elevation: 1,
    borderRadius: 0,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  content: {
    padding: 20,
    paddingTop: 0,
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionItem: {
    marginBottom: 10,
  },
  sectionSurface: {
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
  },
  sectionIcon: {
    width: 40,
    alignItems: 'center',
  },
  sectionContent: {
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  badgeChip: {
    backgroundColor: '#FF6B35',
  },
  selectValue: {
    fontSize: 14,
    color: '#666',
  },
  
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    borderColor: '#F44336',
  },
}); 