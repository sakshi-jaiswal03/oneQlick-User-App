import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Divider,
  Portal,
  Dialog,
  List,
  Chip,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sampleAddresses, getAddressTypeIcon, getAddressTypeColor, getAddressTypeName, formatFullAddress } from '../../profile/addressData';

interface AddressSelectorProps {
  selectedAddress: string;
  onAddressChange: (address: string) => void;
}

export default function AddressSelector({ selectedAddress, onAddressChange }: AddressSelectorProps) {
  const router = useRouter();
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const handleAddressSelect = (address: string) => {
    onAddressChange(address);
    setShowAddressDialog(false);
  };

  const handleAddNewAddress = () => {
    setShowAddressDialog(false);
    router.push('/profile/addEditAddress');
  };

  const renderAddressOption = (address: any) => (
    <Pressable
      key={address.id}
      style={styles.addressOption}
      onPress={() => handleAddressSelect(formatFullAddress(address))}
    >
      <View style={styles.addressOptionContent}>
        <View style={styles.addressTypeContainer}>
          <MaterialIcons
            name={getAddressTypeIcon(address.type)}
            size={20}
            color={getAddressTypeColor(address.type)}
          />
          <Chip
            mode="flat"
            textStyle={{ color: 'white', fontSize: 12 }}
            style={[styles.typeChip, { backgroundColor: getAddressTypeColor(address.type) }]}
            compact
          >
            {getAddressTypeName(address.type)}
          </Chip>
        </View>
        
        <Text style={styles.addressText} numberOfLines={2}>
          {formatFullAddress(address)}
        </Text>
        
        {address.isDefault && (
          <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={styles.defaultChip} compact>
            Default
          </Chip>
        )}
      </View>
      
      <MaterialIcons
        name="chevron-right"
        size={20}
        color="#666"
      />
    </Pressable>
  );

  return (
    <>
      <Surface style={styles.deliveryCard}>
        <View style={styles.deliveryHeader}>
          <MaterialIcons name="location-on" size={20} color="#FF6B35" />
          <Text style={styles.deliveryTitle}>Delivery Address</Text>
          <IconButton
            icon={() => <MaterialIcons name="edit" size={16} color="#666" />}
            onPress={() => setShowAddressDialog(true)}
          />
        </View>
        
        <Text style={styles.deliveryAddress}>{selectedAddress}</Text>
        
        <View style={styles.deliveryMeta}>
          <View style={styles.deliveryMetaItem}>
            <MaterialIcons name="access-time" size={16} color="#666" />
            <Text style={styles.deliveryMetaText}>
              Estimated delivery: 35-40 minutes
            </Text>
          </View>
          
          <View style={styles.deliveryMetaItem}>
            <MaterialIcons name="local-shipping" size={16} color="#666" />
            <Text style={styles.deliveryMetaText}>
              Delivery fee: ₹30
            </Text>
          </View>
        </View>
      </Surface>

      <Portal>
        <Dialog
          visible={showAddressDialog}
          onDismiss={() => setShowAddressDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Select Delivery Address</Dialog.Title>
          
          <Dialog.Content>
            <View style={styles.addressList}>
              {sampleAddresses.map(renderAddressOption)}
              
              <Divider style={styles.divider} />
              
              <Pressable
                style={styles.addAddressOption}
                onPress={handleAddNewAddress}
              >
                <MaterialIcons name="add-location" size={24} color="#FF6B35" />
                <Text style={styles.addAddressText}>Add New Address</Text>
              </Pressable>
            </View>
          </Dialog.Content>
          
          <Dialog.Actions>
            <Text onPress={() => setShowAddressDialog(false)}>Cancel</Text>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  deliveryCard: { 
    margin: 20, 
    padding: 24, 
    borderRadius: 16, 
    elevation: 4, 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  deliveryHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  deliveryTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#2c3e50', 
    marginLeft: 12, 
    flex: 1 
  },
  deliveryAddress: { 
    fontSize: 15, 
    color: '#495057', 
    lineHeight: 22, 
    marginBottom: 16,
    fontWeight: '500',
  },
  deliveryMeta: { 
    gap: 12 
  },
  deliveryMetaItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  deliveryMetaText: { 
    fontSize: 14, 
    color: '#6c757d', 
    marginLeft: 12,
    fontWeight: '500',
  },
  dialog: {
    borderRadius: 10,
    maxHeight: '80%',
  },
  addressList: {
    gap: 8,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addressOptionContent: {
    flex: 1,
    gap: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    height: 20,
  },
  defaultChip: {
    backgroundColor: '#4CAF50',
    height: 20,
  },
  addressText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  addAddressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 12,
  },
});
