import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Avatar, Divider, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      id: '1',
      title: 'Personal Information',
      subtitle: 'Edit your profile details',
      icon: 'person',
      onPress: () => router.push('/profile/edit'),
    },
    {
      id: '2',
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      icon: 'location-on',
      onPress: () => router.push('/profile/addresses'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      icon: 'credit-card',
      onPress: () => router.push('/(tabs)/home'),
    },
    {
      id: '4',
      title: 'Order History',
      subtitle: 'View all your orders',
      icon: 'receipt',
      onPress: () => router.push('/(tabs)/orders'),
    },
  ];

  const supportOptions = [
    {
      id: '1',
      title: 'Help & Support',
      subtitle: 'Get help with your orders',
      icon: 'help',
      onPress: () => {/* TODO: Implement help */},
    },
    {
      id: '2',
      title: 'Contact Us',
      subtitle: 'Reach out to our team',
      icon: 'contact-support',
      onPress: () => {/* TODO: Implement contact */},
    },
    {
      id: '3',
      title: 'About oneQlick',
      subtitle: 'Learn more about us',
      icon: 'info',
      onPress: () => {/* TODO: Implement about */},
    },
  ];

  const renderProfileOption = (option: any) => (
    <List.Item
      key={option.id}
      title={option.title}
      description={option.subtitle}
      left={(props) => <List.Icon {...props} icon={option.icon} />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={option.onPress}
      style={styles.listItem}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={user?.name?.charAt(0) || 'U'}
            style={styles.avatar}
            color="white"
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+91 9876543210'}</Text>
          </View>
          <Button
            mode="outlined"
            onPress={() => router.push('/profile/edit')}
            style={styles.editButton}
            icon="edit"
          >
            Edit
          </Button>
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2,450</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="notifications" size={24} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Get updates about your orders</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color="#FF6B35"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="location-on" size={24} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Location Services</Text>
                  <Text style={styles.settingSubtitle}>Allow location access for delivery</Text>
                </View>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                color="#FF6B35"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Profile Options */}
        <Card style={styles.optionsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account</Text>
            {profileOptions.map(renderProfileOption)}
          </Card.Content>
        </Card>

        {/* Support Options */}
        <Card style={styles.optionsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Support</Text>
            {supportOptions.map(renderProfileOption)}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#d32f2f"
            icon="logout"
          >
            Logout
          </Button>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>oneQlick v1.0.0</Text>
        </View>
      </ScrollView>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#FF6B35',
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    borderColor: '#FF6B35',
  },
  statsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  settingsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  optionsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    borderColor: '#d32f2f',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
}); 