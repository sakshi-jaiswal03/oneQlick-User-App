import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  TextInput,
  Switch,
  Chip,
  Divider,
  Menu,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapPicker from './MapPicker';
import {
  AddressFormData,
  MapLocation,
  FormValidation,
  defaultFormData,
  defaultValidation,
  addressTypes,
  validateForm,
  isFormValid,
  getCities,
  getStateForCity,
  getAreasForCity,
  getAddressTypeInfo,
  getCurrentLocation,
} from './addressFormData';
import { PhoneNumberInput } from '../../components/common';
import { CountryCode } from '../../utils/countryCodes';
import { isValidPhoneWithCountry } from '../../utils/helpers';

export default function AddEditAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = params.addressId !== undefined;
  
  // State management
  const [formData, setFormData] = useState<AddressFormData>(defaultFormData);
  const [validation, setValidation] = useState<FormValidation>(defaultValidation);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showAreaMenu, setShowAreaMenu] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  
  // Animation values
  const formAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Load address data if editing
    if (isEditMode && params.addressId) {
      loadAddressData(params.addressId as string);
    }
  }, [isEditMode, params.addressId]);

  const startAnimations = () => {
    // Header slide down animation
    Animated.timing(headerAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
    
    // Form fade in animation
    Animated.timing(formAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
  };

  const loadAddressData = (addressId: string) => {
    // TODO: Load address data from storage/API
    // For now, using sample data
    const sampleData: AddressFormData = {
      fullName: 'Priya Sharma',
      phoneNumber: '+91 98765-43210',
      addressType: 'home',
      houseNumber: 'House No. 45',
      area: 'Rajpur',
      landmark: 'Near Temple',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      isDefault: true,
      coordinates: {
        latitude: 29.9457,
        longitude: 78.1642,
      },
    };
    
    setFormData(sampleData);
    validateFormData(sampleData);
  };

  const validateFormData = (data: AddressFormData) => {
    const newValidation = {
      ...validateForm(data),
      phoneNumber: selectedCountry 
        ? isValidPhoneWithCountry(data.phoneNumber, selectedCountry.dialCode, selectedCountry.maxLength)
        : data.phoneNumber.trim().length > 0,
    };
    setValidation(newValidation);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-fill state when city changes
    if (field === 'city' && typeof value === 'string') {
      const state = getStateForCity(value);
      if (state) {
        newFormData.state = state;
        setFormData(newFormData);
      }
    }
    
    validateFormData(newFormData);
  };

  const handleAddressTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, addressType: typeId as 'home' | 'office' | 'other' }));
    setShowTypeMenu(false);
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ 
      ...prev, 
      city,
      state: getStateForCity(city),
      area: '', // Reset area when city changes
    }));
    setShowCityMenu(false);
    validateFormData({ ...formData, city, state: getStateForCity(city), area: '' });
  };

  const handleAreaSelect = (area: string) => {
    setFormData(prev => ({ ...prev, area }));
    setShowAreaMenu(false);
    validateFormData({ ...formData, area });
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      
      setFormData(prev => ({
        ...prev,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        area: location.area,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));
      
      validateFormData({
        ...formData,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        area: location.area,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      
      Alert.alert('Success', 'Current location detected and address auto-filled!');
    } catch (error) {
      Alert.alert('Error', 'Could not detect current location. Please check your GPS settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapLocationSelect = (location: MapLocation) => {
    setFormData(prev => ({
      ...prev,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      area: location.area,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
    
    validateFormData({
      ...formData,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      area: location.area,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  };

  const handleSaveAddress = () => {
    if (!isFormValid(validation)) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }
    
    setShowSaveDialog(true);
  };

  const confirmSaveAddress = () => {
    // TODO: Save address to storage/API
    Alert.alert(
      'Success', 
      `Address ${isEditMode ? 'updated' : 'saved'} successfully!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        },
      ]}
    >
      <IconButton
        icon="arrow-back"
        size={24}
        iconColor="#333"
        onPress={() => router.back()}
      />
      <Text style={styles.headerTitle}>
        {isEditMode ? 'Edit Address' : 'Add New Address'}
      </Text>
      <View style={{ width: 48 }} />
    </Animated.View>
  );

  const renderAddressTypeSelector = () => (
    <View style={styles.formSection}>
      <Text style={styles.formLabel}>Address Type *</Text>
      <Menu
        visible={showTypeMenu}
        onDismiss={() => setShowTypeMenu(false)}
        anchor={
          <Pressable
            style={styles.selector}
            onPress={() => setShowTypeMenu(true)}
          >
            <MaterialIcons 
              name={getAddressTypeInfo(formData.addressType).icon as any} 
              size={24} 
              color={getAddressTypeInfo(formData.addressType).color} 
            />
            <Text style={styles.selectorText}>
              {getAddressTypeInfo(formData.addressType).name}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </Pressable>
        }
      >
        {addressTypes.map((type) => (
          <Menu.Item
            key={type.id}
            onPress={() => handleAddressTypeSelect(type.id)}
            title={type.name}
            leadingIcon="location-on"
          />
        ))}
      </Menu>
    </View>
  );

  const renderFormFields = () => (
    <Animated.View 
      style={[
        styles.formFields,
        {
          opacity: formAnim,
        },
      ]}
    >
      {/* Full Name */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Full Name (for delivery) *</Text>
        <TextInput
          mode="outlined"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
          placeholder="Enter your full name"
          style={[styles.textInput, !validation.fullName && formData.fullName && styles.errorInput]}
          error={!validation.fullName && formData.fullName !== ''}
        />
        {!validation.fullName && formData.fullName && (
          <Text style={styles.errorText}>Name must be at least 2 characters</Text>
        )}
      </View>

      {/* Phone Number */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Phone Number *</Text>
        <PhoneNumberInput
          value={formData.phoneNumber}
          onChangeText={(phone, country) => {
            handleInputChange('phoneNumber', phone);
            setSelectedCountry(country);
          }}
          placeholder="Enter phone number"
          error={!validation.phoneNumber && formData.phoneNumber ? 'Please enter a valid phone number' : undefined}
        />
      </View>

      {/* House Number */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>House/Flat/Building Number *</Text>
        <TextInput
          mode="outlined"
          value={formData.houseNumber}
          onChangeText={(text) => handleInputChange('houseNumber', text)}
          placeholder="e.g., House No. 45, Flat 2A"
          style={[styles.textInput, !validation.houseNumber && formData.houseNumber && styles.errorInput]}
          error={!validation.houseNumber && formData.houseNumber !== ''}
        />
        {!validation.houseNumber && formData.houseNumber && (
          <Text style={styles.errorText}>House number is required</Text>
        )}
      </View>

      {/* Area/Locality */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Area/Locality *</Text>
        <Menu
          visible={showAreaMenu}
          onDismiss={() => setShowAreaMenu(false)}
          anchor={
            <TextInput
              mode="outlined"
              value={formData.area}
              onChangeText={(text) => handleInputChange('area', text)}
              placeholder="e.g., Rajpur, Civil Lines"
              style={[styles.textInput, !validation.area && formData.area && styles.errorInput]}
              error={!validation.area && formData.area !== ''}
              right={
                <TextInput.Icon 
                  icon="menu-down" 
                  onPress={() => setShowAreaMenu(true)}
                />
              }
            />
          }
        >
          {getAreasForCity(formData.city).map((area) => (
            <Menu.Item
              key={area}
              onPress={() => handleAreaSelect(area)}
              title={area}
            />
          ))}
        </Menu>
        {!validation.area && formData.area && (
          <Text style={styles.errorText}>Area is required</Text>
        )}
      </View>

      {/* Landmark */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Landmark (Optional)</Text>
        <TextInput
          mode="outlined"
          value={formData.landmark}
          onChangeText={(text) => handleInputChange('landmark', text)}
          placeholder="e.g., Near Temple, Opposite Bank"
          style={styles.textInput}
        />
      </View>

      {/* City */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>City *</Text>
        <Menu
          visible={showCityMenu}
          onDismiss={() => setShowCityMenu(false)}
          anchor={
            <TextInput
              mode="outlined"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
              placeholder="Select city"
              style={[styles.textInput, !validation.city && formData.city && styles.errorInput]}
              error={!validation.city && formData.city !== ''}
              right={
                <TextInput.Icon 
                  icon="menu-down" 
                  onPress={() => setShowCityMenu(true)}
                />
              }
            />
          }
        >
          {getCities().map((city) => (
            <Menu.Item
              key={city}
              onPress={() => handleCitySelect(city)}
              title={city}
            />
          ))}
        </Menu>
        {!validation.city && formData.city && (
          <Text style={styles.errorText}>City is required</Text>
        )}
      </View>

      {/* State */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>State *</Text>
        <TextInput
          mode="outlined"
          value={formData.state}
          onChangeText={(text) => handleInputChange('state', text)}
          placeholder="State will be auto-filled"
          style={[styles.textInput, !validation.state && formData.state && styles.errorInput]}
          error={!validation.state && formData.state !== ''}
          editable={false}
        />
        {!validation.state && formData.state && (
          <Text style={styles.errorText}>State is required</Text>
        )}
      </View>

      {/* PIN Code */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>PIN Code *</Text>
        <TextInput
          mode="outlined"
          value={formData.pincode}
          onChangeText={(text) => handleInputChange('pincode', text)}
          placeholder="e.g., 249201"
          keyboardType="numeric"
          maxLength={6}
          style={[styles.textInput, !validation.pincode && formData.pincode && styles.errorInput]}
          error={!validation.pincode && formData.pincode !== ''}
        />
        {!validation.pincode && formData.pincode && (
          <Text style={styles.errorText}>Please enter a valid 6-digit PIN code</Text>
        )}
      </View>

      {/* Set as Default */}
      <View style={styles.formSection}>
        <View style={styles.switchContainer}>
          <Text style={styles.formLabel}>Set as default address</Text>
          <Switch
            value={formData.isDefault}
            onValueChange={(value) => handleInputChange('isDefault', value)}
            color="#FF6B35"
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderLocationSection = () => (
    <Surface style={styles.locationSection}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationTitle}>Location Selection</Text>
        <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.locationChip}>
          {formData.coordinates ? 'Location Set' : 'No Location'}
        </Chip>
      </View>
      
      <Text style={styles.locationSubtitle}>
        Use map or GPS to set your exact delivery location
      </Text>
      
      <View style={styles.locationButtons}>
        <Button
          mode="outlined"
          onPress={handleUseCurrentLocation}
          icon="my-location"
          style={styles.locationButton}
          loading={isLoading}
          disabled={isLoading}
        >
          Use GPS Location
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => setShowMapPicker(true)}
          icon="map"
          style={styles.locationButton}
        >
          Pick on Map
        </Button>
      </View>
      
      {formData.coordinates && (
        <View style={styles.coordinatesInfo}>
          <Text style={styles.coordinatesText}>
            Lat: {formData.coordinates.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinatesText}>
            Lng: {formData.coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </Surface>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={() => router.back()}
        icon="close"
        style={styles.actionButton}
      >
        Cancel
      </Button>
      
      <Button
        mode="contained"
        onPress={handleSaveAddress}
        icon="check"
        style={styles.actionButton}
        disabled={!isFormValid(validation)}
      >
        {isEditMode ? 'Update Address' : 'Save Address'}
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        {renderHeader()}
        
        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Address Type Selector */}
          {renderAddressTypeSelector()}
          
          {/* Form Fields */}
          {renderFormFields()}
          
          {/* Location Section */}
          {renderLocationSection()}
          
          {/* Action Buttons */}
          {renderActionButtons()}
          
          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Map Picker Modal */}
      <Portal>
        {showMapPicker && (
          <MapPicker
            onLocationSelect={handleMapLocationSelect}
            initialLocation={formData.coordinates ? {
              latitude: formData.coordinates.latitude,
              longitude: formData.coordinates.longitude,
              address: formData.landmark || formData.area,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              area: formData.area,
            } : undefined}
            onClose={() => setShowMapPicker(false)}
          />
        )}
      </Portal>
      
      {/* Save Confirmation Dialog */}
      <Dialog
        visible={showSaveDialog}
        onDismiss={() => setShowSaveDialog(false)}
      >
        <Dialog.Title>Save Address</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to {isEditMode ? 'update' : 'save'} this address?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onPress={confirmSaveAddress} mode="contained">
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
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
  
  // Keyboard Avoidance
  keyboardView: {
    flex: 1,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    padding: 16,
  },
  
  // Form Fields
  formFields: {
    marginBottom: 24,
  },
  
  // Form Section
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  
  // Text Input
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  errorInput: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Selector
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  
  // Switch Container
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  
  // Location Section
  locationSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  locationChip: {
    backgroundColor: '#FF6B35',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationButton: {
    flex: 1,
  },
  coordinatesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
}); 