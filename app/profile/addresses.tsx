import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Dimensions,
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
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
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

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Get current location
    getCurrentLocation().then(setCurrentLocation);
  }, []);

  const startAnimations = () => {
    // List fade in animation
    Animated.timing(listAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    // FAB bounce animation
    Animated.sequence([
      Animated.delay(500),
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
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      Alert.alert('Success', 'Current location detected!');
    } catch (error) {
      Alert.alert('Error', 'Could not detect current location. Please check your GPS settings.');
    }
  };

  const renderAddressCard = (address: Address) => (
    <Animated.View
      key={address.id}
      style={[
        styles.addressCard,
        {
          opacity: listAnim,
          transform: [{
            translateY: listAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <Surface style={styles.addressSurface}>
        {/* Address Header */}
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Chip
              mode="flat"
              textStyle={{ color: 'white' }}
              style={[styles.typeChip, { backgroundColor: getAddressTypeColor(address.type) }]}
              icon={getAddressTypeIcon(address.type)}
            >
              {getAddressTypeName(address.type)}
            </Chip>
            
            {address.isDefault && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.defaultChip} compact>
                Default
              </Chip>
            )}
          </View>
          
          <View style={styles.addressActions}>
            <IconButton
              icon="edit"
              size={20}
              iconColor="#666"
              onPress={() => handleEditAddress(address)}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#F44336"
              onPress={() => handleDeleteAddress(address)}
            />
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Address Content */}
        <View style={styles.addressContent}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressText}>{formatFullAddress(address)}</Text>
          
          {/* Additional Info */}
          <View style={styles.addressInfo}>
            {address.distance && (
              <View style={styles.infoItem}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.infoText}>{address.distance} km away</Text>
              </View>
            )}
            
            {address.deliveryArea ? (
              <View style={styles.infoItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>In delivery area</Text>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <MaterialIcons name="warning" size={16} color="#FF9800" />
                <Text style={styles.infoText}>Outside delivery area</Text>
              </View>
            )}
            
            {address.lastUsed && (
              <View style={styles.infoItem}>
                <MaterialIcons name="schedule" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Last used {new Date(address.lastUsed).toLocaleDateString()}
                </Text>
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
            >
              Set as Default
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={() => {
              // TODO: Navigate to map view
              Alert.alert('Map View', 'Map integration coming soon!');
            }}
            icon="map-outline"
            style={styles.actionButton}
            compact
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
        <Dialog.Title>
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
                    <MaterialIcons 
                      name={getAddressTypeIcon(formData.type) as any} 
                      size={24} 
                      color={getAddressTypeColor(formData.type)} 
                    />
                    <Text style={styles.typeSelectorText}>
                      {getAddressTypeName(formData.type)}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
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
              />
            </View>
            
            {/* Current Location Button */}
            <View style={styles.formSection}>
              <Button
                mode="outlined"
                onPress={handleUseCurrentLocation}
                icon="my-location"
                style={styles.locationButton}
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
        
        <Dialog.Actions>
          <Button onPress={() => {
            setShowAddDialog(false);
            setShowEditDialog(false);
            setEditingAddress(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onPress={handleSaveAddress} mode="contained">
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
      >
        <Dialog.Title>Delete Address</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to delete "{deletingAddress?.name}"? This action cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setShowDeleteDialog(false);
            setDeletingAddress(null);
          }}>
            Cancel
          </Button>
          <Button onPress={confirmDeleteAddress} textColor="#F44336">
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="location-off" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        Add your first delivery address to get started
      </Text>
      <Button
        mode="contained"
        onPress={handleAddAddress}
        icon="add"
        style={styles.addFirstButton}
      >
        Add Your First Address
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          iconColor="#333"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <IconButton
          icon="help-outline"
          size={24}
          iconColor="#666"
          onPress={() => Alert.alert('Help', 'Address management help coming soon!')}
        />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {addresses.map(renderAddressCard)}
            <View style={{ height: 100 }} /> {/* Bottom spacing for FAB */}
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
          icon="add"
          label="Add Address"
          onPress={handleAddAddress}
          style={styles.fab}
          color="white"
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addFirstButton: {
    marginTop: 20,
    backgroundColor: '#FF6B35',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
  fab: {
    backgroundColor: '#FF6B35',
  },
  addressCard: {
    marginBottom: 16,
  },
  addressSurface: {
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    height: 24,
  },
  defaultChip: {
    backgroundColor: '#4CAF50',
    height: 24,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  addressContent: {
    padding: 12,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  addressInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dialog: {
    borderRadius: 10,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  locationButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
}); 