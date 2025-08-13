import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Linking,
  Share,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Switch,
  Divider,
  Menu,
  List,
  Avatar,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  userProfile,
  profileSections,
  getProfileCompletionColor,
  getProfileCompletionText,
  formatMemberSince,
} from './profileData';

export default function ProfileScreen() {
  const router = useRouter();
  
  // State management
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersPromotions, setOffersPromotions] = useState(true);
  const [appNotifications, setAppNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const profilePhotoAnim = useRef(new Animated.Value(0)).current;

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
    
    // Profile photo scale animation
    Animated.sequence([
      Animated.delay(400),
      Animated.spring(profilePhotoAnim, { 
        toValue: 1, 
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const handleSectionPress = (section: any) => {
    switch (section.type) {
      case 'navigation':
        if (section.route) {
          // Handle different routes
          if (section.route === '/order-history') {
            router.push('/order-history');
          } else if (section.route === '/order-tracking') {
            router.push('/order-tracking');
          } else if (section.route === '/profile/addresses') {
            router.push('/profile/addresses');
          } else if (section.route === '/profile/payment-methods') {
            router.push('/(tabs)/home');
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

  const handleShareApp = () => {
    Share.share({
      message: 'Check out oneQlick - the best food delivery app! Download now.',
      title: 'oneQlick Food Delivery',
    });
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Support', 
          onPress: () => {
            Linking.openURL('tel:+91-1800-123-4567');
          }
        },
        { 
          text: 'Email Support', 
          onPress: () => {
            Linking.openURL('mailto:support@oneqlick.com');
          }
        },
        { 
          text: 'Live Chat', 
          onPress: () => {
            Alert.alert('Live Chat', 'Live chat feature coming soon!');
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
      {/* Profile photo */}
      <Animated.View 
        style={[
          styles.profilePhotoContainer,
          {
            transform: [{
              scale: profilePhotoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            }],
          },
        ]}
      >
        <Avatar.Image
          size={80}
          source={userProfile.profilePhoto ? { uri: userProfile.profilePhoto } : require('../../assets/icon.png')}
          style={styles.profilePhoto}
        />
        <IconButton
          icon="camera-alt"
          size={20}
          iconColor="white"
          style={styles.editPhotoButton}
          onPress={() => Alert.alert('Profile Photo', 'Photo upload feature coming soon!')}
        />
      </Animated.View>
      
      {/* User info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.userPhone}>{userProfile.phone}</Text>
        
        {/* Verification badges */}
        <View style={styles.verificationBadges}>
          {userProfile.isEmailVerified && (
            <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.verifiedChip} compact>
              <MaterialIcons name="verified" size={16} color="white" />
              Email Verified
            </Chip>
          )}
          {userProfile.isPhoneVerified && (
            <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.verifiedChip} compact>
              <MaterialIcons name="verified" size={16} color="white" />
              Phone Verified
            </Chip>
          )}
        </View>
      </View>
      
      {/* Profile completion */}
      <View style={styles.profileCompletion}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionTitle}>Profile Completion</Text>
          <Text style={styles.completionPercentage}>{userProfile.profileCompletion}%</Text>
        </View>
        <ProgressBar
          progress={userProfile.profileCompletion / 100}
          color={getProfileCompletionColor(userProfile.profileCompletion)}
          style={styles.completionBar}
        />
        <Text style={styles.completionText}>
          {getProfileCompletionText(userProfile.profileCompletion)}
        </Text>
      </View>
      
      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>₹{userProfile.totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.loyaltyPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
      
      {/* Member since */}
      <View style={styles.memberSince}>
        <MaterialIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.memberSinceText}>
          Member since {userProfile.memberSince} ({formatMemberSince(userProfile.memberSince)})
        </Text>
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
            <MaterialIcons name={section.icon as any} size={24} color="#666" />
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
                    case 'marketing-emails':
                      setMarketingEmails(value);
                      break;
                    case 'dark-mode':
                      setDarkMode(value);
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

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handleShareApp}
          icon="share"
          style={styles.actionButton}
          compact
        >
          Share App
        </Button>
        <Button
          mode="outlined"
          onPress={handleContactSupport}
          icon="support-agent"
          style={styles.actionButton}
          compact
        >
          Support
        </Button>
        <Button
          mode="outlined"
          onPress={() => Alert.alert('Help', 'Help center coming soon!')}
          icon="help"
          style={styles.actionButton}
          compact
        >
          Help
        </Button>
      </View>
    </View>
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
              .filter(section => ['order-updates', 'offers-promotions', 'app-notifications', 'marketing-emails'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Support Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Support</Text>
            {profileSections
              .filter(section => ['help-center', 'contact-us', 'rate-app'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Settings Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Settings</Text>
            {profileSections
              .filter(section => ['language', 'dark-mode', 'location-services', 'data-usage'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Quick Actions */}
          {renderQuickActions()}
          
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
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    borderWidth: 3,
    borderColor: '#FF6B35',
    elevation: 4,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
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
  verificationBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  verifiedChip: {
    backgroundColor: '#4CAF50',
  },
  profileCompletion: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completionPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  completionBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#dee2e6',
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  memberSinceText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
  },
  content: {
    padding: 20,
    paddingTop: 0, // No need for extra padding since header is not absolute
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
  quickActions: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
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