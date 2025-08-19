import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
  Divider,
  FAB,
  Dialog,
  Portal,
  TextInput,
  List,
  Switch,
  Menu,
  Badge,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  sampleAddresses,
  addressTypes,
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
  formatFullAddress,
  formatShortAddress,
  validatePincode,
  validateDeliveryArea,
  getCurrentLocation,
  getDistanceFromCurrentLocation,
  Address,
  AddressType,
} from './addressData';

const { width, height } = Dimensions.get('window');

export default function AddressesScreen() {
  const router = useRouter();
  
  // State management
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<{
    type: 'home' | 'office' | 'other';
    name: string;
    houseNumber: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>({
    type: 'home',
    name: '',
    houseNumber: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  
  // Animation values
  const listAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Get current location and update distances
    const initializeLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        
        // Update distances for all addresses
        const updatedAddresses = await Promise.all(
          addresses.map(async (address) => {
            if (address.coordinates) {
              const distance = await getDistanceFromCurrentLocation(
                address.coordinates.latitude,
                address.coordinates.longitude
              );
              return { ...address, distance };
            }
            return address;
          })
        );
        
        setAddresses(updatedAddresses);
      } catch (error) {
        console.log('Location not available on app start:', error);
        // Don't show error on app start, user can manually request location
      }
    };
    
    initializeLocation();
  }, []);

  const startAnimations = () => {
    // Header slide down animation
    Animated.timing(headerAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
    
    // Search bar fade in
    Animated.timing(searchAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    // List fade in animation
    Animated.timing(listAnim, { 
      toValue: 1, 
      duration: 1000, 
      useNativeDriver: true 
    }).start();
    
    // FAB bounce animation
    Animated.sequence([
      Animated.delay(800),
      Animated.spring(fabAnim, { 
        toValue: 1, 
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      houseNumber: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleAddAddress = () => {
    resetForm();
    router.push('/profile/addEditAddress');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      houseNumber: address.houseNumber,
      street: address.street,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setShowEditDialog(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setDeletingAddress(address);
    setShowDeleteDialog(true);
  };

  const handleSetDefault = (address: Address) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id,
      }))
    );
  };

  const handleSaveAddress = () => {
    // Validate required fields
    if (!formData.houseNumber || !formData.street || !formData.city || !formData.pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate pincode
    if (!validatePincode(formData.pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    // Validate delivery area
    if (!validateDeliveryArea(formData.pincode)) {
      Alert.alert('Warning', 'This address is outside our delivery area. Orders may not be available.');
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddress.id 
            ? {
                ...addr,
                ...formData,
                coordinates: currentLocation || addr.coordinates,
                deliveryArea: validateDeliveryArea(formData.pincode),
                lastUsed: new Date().toISOString(),
              }
            : addr
        )
      );
      setShowEditDialog(false);
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        type: formData.type as 'home' | 'office' | 'other',
        name: formData.name || getAddressTypeName(formData.type),
        houseNumber: formData.houseNumber,
        street: formData.street,
        landmark: formData.landmark || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: formData.isDefault,
        isSelected: false,
        coordinates: currentLocation || undefined,
        deliveryArea: validateDeliveryArea(formData.pincode),
        lastUsed: new Date().toISOString(),
      };

      setAddresses(prev => {
        if (formData.isDefault) {
          // Remove default from other addresses
          return prev.map(addr => ({ ...addr, isDefault: false })).concat(newAddress);
        }
        return prev.concat(newAddress);
      });
      setShowAddDialog(false);
    }
    
    resetForm();
  };

  const confirmDeleteAddress = () => {
    if (deletingAddress) {
      setAddresses(prev => prev.filter(addr => addr.id !== deletingAddress.id));
      setShowDeleteDialog(false);
      setDeletingAddress(null);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      // Show loading state
      setIsLocationLoading(true);
      
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      // Update distances for all addresses
      const updatedAddresses = await Promise.all(
        addresses.map(async (address) => {
          if (address.coordinates) {
            const distance = await getDistanceFromCurrentLocation(
              address.coordinates.latitude,
              address.coordinates.longitude
            );
            return { ...address, distance };
          }
          return address;
        })
      );
      
      setAddresses(updatedAddresses);
      Alert.alert('Success', `Location detected! Your coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
    } catch (error) {
      console.error('Location error:', error);
      if (error instanceof Error && error.message.includes('permission')) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // This would typically open device settings
              Alert.alert('Settings', 'Please go to your device settings and enable location permissions for this app.');
            }}
          ]
        );
      } else {
        Alert.alert('Location Error', 'Could not detect your current location. Please check your GPS settings and try again.');
      }
    } finally {
      setIsLocationLoading(false);
    }
  };

  const filteredAddresses = (addresses || []).filter(address => {
    const matchesSearch = searchQuery === '' || 
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.street.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || address.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const renderSearchAndFilters = () => (
    <Animated.View style={[styles.searchContainer, { opacity: searchAnim }]}>
      {/* Search Bar */}
      <Surface style={styles.searchBar}>
        <IconButton
          icon="magnify"
          size={20}
          iconColor="#666"
          style={styles.searchIconButton}
        />
        <TextInput
          placeholder="Search addresses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          mode="flat"
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => setSearchQuery('')}
            iconColor="#666"
          />
        )}
      </Surface>

      {/* Quick Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <Chip
          mode={filterType === 'all' ? 'flat' : 'outlined'}
          selected={filterType === 'all'}
          onPress={() => setFilterType('all')}
          style={[styles.filterChip, filterType === 'all' && styles.activeFilterChip]}
          textStyle={filterType === 'all' ? { color: 'white' } : {}}
        >
          {`All (${addresses?.length || 0})`}
        </Chip>
        {addressTypes.map((type) => (
          <Chip
            key={type.id}
            mode={filterType === type.id ? 'flat' : 'outlined'}
            selected={filterType === type.id}
            onPress={() => setFilterType(type.id)}
            style={[styles.filterChip, filterType === type.id && styles.activeFilterChip]}
            textStyle={filterType === type.id ? { color: 'white' } : {}}
            icon={getAddressTypeIcon(type.id)}
          >
            {`${type.name} (${(addresses || []).filter(addr => addr.type === type.id).length})`}
          </Chip>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderAddressCard = (address: Address, index: number) => (
    <Animated.View
      key={address.id}
      style={[
        styles.addressCard,
        {
          opacity: listAnim,
          transform: [{
            translateY: listAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 + (index * 20), 0],
            }),
          }],
        },
      ]}
    >
      <Surface style={styles.addressSurface}>
        {/* Address Header with Type Badge */}
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeSection}>
            <View style={[styles.typeIconContainer, { backgroundColor: getAddressTypeColor(address.type) }]}>
              <IconButton
                icon={getAddressTypeIcon(address.type)}
                size={20}
                iconColor="white"
                style={styles.typeIconButton}
              />
            </View>
            <View style={styles.addressTypeInfo}>
              <Text style={styles.addressTypeName}>{getAddressTypeName(address.type)}</Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <IconButton
                    icon="star"
                    size={12}
                    iconColor="#FFD700"
                    style={styles.defaultIconButton}
                  />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.addressActions}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor="#666"
              onPress={() => handleEditAddress(address)}
              style={styles.actionIcon}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#F44336"
              onPress={() => handleDeleteAddress(address)}
              style={styles.actionIcon}
            />
          </View>
        </View>
        
        {/* Address Content */}
        <View style={styles.addressContent}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressText}>{formatFullAddress(address)}</Text>
          
          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            {address.deliveryArea ? (
              <View style={styles.statusItem}>
                <IconButton
                  icon="check-circle"
                  size={16}
                  iconColor="#4CAF50"
                  style={styles.statusIconButton}
                />
                <Text style={styles.statusText}>In delivery area</Text>
              </View>
            ) : (
              <View style={styles.statusItem}>
                <IconButton
                  icon="alert"
                  size={16}
                  iconColor="#FF9800"
                  style={styles.statusIconButton}
                />
                <Text style={styles.statusText}>Outside delivery area</Text>
              </View>
            )}
            
            {address.distance && (
              <View style={styles.statusItem}>
                <IconButton
                  icon="map-marker"
                  size={16}
                  iconColor="#2196F3"
                  style={styles.statusIconButton}
                />
                <Text style={styles.statusText}>{address.distance} km away</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.cardActions}>
          {!address.isDefault && (
            <Button
              mode="outlined"
              onPress={() => handleSetDefault(address)}
              icon="star"
              style={styles.actionButton}
              compact
              textColor="#FF6B35"
            >
              Set as Default
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={() => {
              Alert.alert('Map View', 'Map integration coming soon!');
            }}
            icon="map"
            style={styles.actionButton}
            compact
            textColor="#2196F3"
          >
            View on Map
          </Button>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderAddEditDialog = () => (
    <Portal>
      <Dialog
        visible={showAddDialog || showEditDialog}
        onDismiss={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setEditingAddress(null);
          resetForm();
        }}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.dialogTitle}>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </Dialog.Title>
        
        <Dialog.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Address Type Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address Type</Text>
              <Menu
                visible={showTypeMenu}
                onDismiss={() => setShowTypeMenu(false)}
                anchor={
                  <Pressable
                    style={styles.typeSelector}
                    onPress={() => setShowTypeMenu(true)}
                  >
                    <View style={[styles.typeIcon, { backgroundColor: getAddressTypeColor(formData.type) }]}>
                      <IconButton
                        icon={getAddressTypeIcon(formData.type)}
                        size={20}
                        iconColor="white"
                        style={styles.formTypeIconButton}
                      />
                    </View>
                    <Text style={styles.typeSelectorText}>
                      {getAddressTypeName(formData.type)}
                    </Text>
                    <IconButton
                      icon="chevron-down"
                      size={24}
                      iconColor="#666"
                      style={styles.dropdownIcon}
                    />
                  </Pressable>
                }
              >
                {addressTypes.map((type) => (
                  <Menu.Item
                    key={type.id}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, type: type.id as 'home' | 'office' | 'other' }));
                      setShowTypeMenu(false);
                    }}
                    title={type.name}
                    leadingIcon="location-on"
                  />
                ))}
              </Menu>
            </View>
            
            {/* Address Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address Name (Optional)</Text>
              <TextInput
                mode="outlined"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Home, Office, Friend's House"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* House Number */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>House Number/Building *</Text>
              <TextInput
                mode="outlined"
                value={formData.houseNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, houseNumber: text }))}
                placeholder="e.g., House No. 45, Flat 2A"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* Street */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Street/Area *</Text>
              <TextInput
                mode="outlined"
                value={formData.street}
                onChangeText={(text) => setFormData(prev => ({ ...prev, street: text }))}
                placeholder="e.g., Rajpur Village, Near Temple"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* Landmark */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Landmark (Optional)</Text>
              <TextInput
                mode="outlined"
                value={formData.landmark}
                onChangeText={(text) => setFormData(prev => ({ ...prev, landmark: text }))}
                placeholder="e.g., Near Temple, Opposite Bank"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* City */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>City *</Text>
              <TextInput
                mode="outlined"
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                placeholder="e.g., Haridwar"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* State */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>State *</Text>
              <TextInput
                mode="outlined"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                placeholder="e.g., Uttarakhand"
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* Pincode */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Pincode *</Text>
              <TextInput
                mode="outlined"
                value={formData.pincode}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
                placeholder="e.g., 249201"
                keyboardType="numeric"
                maxLength={6}
                style={styles.textInput}
                outlineColor="#E0E0E0"
                activeOutlineColor="#FF6B35"
              />
            </View>
            
            {/* Current Location Button */}
            <View style={styles.formSection}>
              <Button
                mode="outlined"
                onPress={handleUseCurrentLocation}
                icon="crosshairs-gps"
                style={styles.locationButton}
                textColor="#2196F3"
                buttonColor="#E3F2FD"
              >
                Use Current Location
              </Button>
            </View>
            
            {/* Set as Default */}
            <View style={styles.formSection}>
              <View style={styles.switchContainer}>
                <Text style={styles.formLabel}>Set as Default Address</Text>
                <Switch
                  value={formData.isDefault}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, isDefault: value }))}
                  color="#FF6B35"
                />
              </View>
            </View>
          </ScrollView>
        </Dialog.Content>
        
        <Dialog.Actions style={styles.dialogActions}>
          <Button 
            onPress={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
              setEditingAddress(null);
              resetForm();
            }}
            textColor="#666"
          >
            Cancel
          </Button>
          <Button 
            onPress={handleSaveAddress} 
            mode="contained"
            buttonColor="#FF6B35"
            style={styles.saveButton}
          >
            {editingAddress ? 'Update' : 'Save'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderDeleteDialog = () => (
    <Portal>
      <Dialog
        visible={showDeleteDialog}
        onDismiss={() => {
          setShowDeleteDialog(false);
          setDeletingAddress(null);
        }}
        style={styles.deleteDialog}
      >
        <Dialog.Title style={styles.deleteDialogTitle}>Delete Address</Dialog.Title>
        <Dialog.Content>
          <View style={styles.deleteContent}>
            <IconButton
              icon="delete"
              size={48}
              iconColor="#F44336"
              style={styles.deleteDialogIcon}
            />
            <Text style={styles.deleteText}>
              Are you sure you want to delete "{deletingAddress?.name}"? This action cannot be undone.
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button 
            onPress={() => {
              setShowDeleteDialog(false);
              setDeletingAddress(null);
            }}
            textColor="#666"
          >
            Cancel
          </Button>
          <Button 
            onPress={confirmDeleteAddress} 
            textColor="#F44336"
            mode="outlined"
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconButton
        icon="map-marker-off"
        size={80}
        iconColor="#E0E0E0"
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || filterType !== 'all' 
          ? 'No addresses match your search criteria'
          : 'Add your first delivery address to get started'
        }
      </Text>
      <Button
        mode="contained"
        onPress={handleAddAddress}
        icon="plus"
        style={styles.addFirstButton}
        buttonColor="#FF6B35"
      >
        Add Your First Address
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
          }],
        }]}
      >
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Saved Addresses</Text>
            <Text style={styles.headerSubtitle}>
              {filteredAddresses.length} of {addresses?.length || 0} addresses
            </Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon={isLocationLoading ? "loading" : "crosshairs-gps"}
              size={20}
              iconColor="#FF6B35"
              onPress={handleUseCurrentLocation}
              style={styles.locationButton}
              disabled={isLocationLoading}
            />
            <IconButton
              icon="help-circle-outline"
              size={24}
              iconColor="#666"
              onPress={() => Alert.alert('Help', 'Address management help coming soon!')}
              style={styles.helpButton}
            />
          </View>
        </View>
      </Animated.View>
      
      {/* Search and Filters */}
      {renderSearchAndFilters()}
      
      {/* Content */}
      <View style={styles.content}>
        {!filteredAddresses || filteredAddresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredAddresses.map((address, index) => renderAddressCard(address, index))}
            <View style={{ height: 120 }} /> {/* Bottom spacing for FAB */}
          </ScrollView>
        )}
      </View>
      
      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [{
              scale: fabAnim,
            }],
          },
        ]}
      >
        <FAB
          icon="plus"
          label="Add Address"
          onPress={handleAddAddress}
          style={styles.fab}
          color="white"
          customSize={56}
        />
      </Animated.View>
      
      {/* Dialogs */}
      {renderAddEditDialog()}
      {renderDeleteDialog()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  helpButton: {
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    marginRight: 4,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: 'transparent',
  },
  filtersScroll: {
    marginHorizontal: -16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginTop: 24,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  addFirstButton: {
    marginTop: 32,
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
  },
  fab: {
    backgroundColor: '#FF6B35',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addressCard: {
    marginBottom: 20,
  },
  addressSurface: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  addressTypeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIconButton: {
    margin: 0,
    padding: 0,
  },
  defaultIconButton: {
    margin: 0,
    padding: 0,
  },
  statusIconButton: {
    margin: 0,
    padding: 0,
  },
  emptyStateIcon: {
    margin: 0,
    padding: 0,
  },
  searchIconButton: {
    margin: 0,
    padding: 0,
  },
  formTypeIconButton: {
    margin: 0,
    padding: 0,
  },
  deleteDialogIcon: {
    margin: 0,
    padding: 0,
  },
  dropdownIcon: {
    margin: 0,
    padding: 0,
  },
  addressTypeInfo: {
    flex: 1,
  },
  addressTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#856404',
    marginLeft: 4,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 4,
  },
  addressContent: {
    padding: 16,
  },
  addressName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 16,
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 6,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  dialog: {
    borderRadius: 16,
    maxHeight: height * 0.8,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  deleteDialog: {
    borderRadius: 16,
  },
  deleteDialogTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F44336',
    textAlign: 'center',
  },
  deleteContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  saveButton: {
    borderRadius: 8,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
}); 