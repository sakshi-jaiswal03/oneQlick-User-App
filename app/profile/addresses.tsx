import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, List, FAB, Dialog, TextInput, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      address: '456 Business Park, Floor 3',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false,
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home' as Address['type'],
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const getAddressTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'work';
      case 'other':
        return 'location-on';
      default:
        return 'location-on';
    }
  };

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return '#4CAF50';
      case 'work':
        return '#2196F3';
      case 'other':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getAddressTypeLabel = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      case 'other':
        return 'Other';
      default:
        return 'Other';
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0, // First address is default
    };

    setAddresses([...addresses, address]);
    setNewAddress({
      type: 'home',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setShowAddDialog(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleDeleteAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (address?.isDefault) {
      Alert.alert('Error', 'Cannot delete default address. Set another address as default first.');
      return;
    }

    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== id));
          },
        },
      ]
    );
  };

  const renderAddress = (address: Address) => (
    <Card key={address.id} style={styles.addressCard} mode="outlined">
      <Card.Content>
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <MaterialIcons
              name={getAddressTypeIcon(address.type)}
              size={20}
              color={getAddressTypeColor(address.type)}
            />
            <Chip
              mode="outlined"
              textStyle={{ color: getAddressTypeColor(address.type) }}
              style={[styles.typeChip, { borderColor: getAddressTypeColor(address.type) }]}
            >
              {getAddressTypeLabel(address.type)}
            </Chip>
            {address.isDefault && (
              <Chip mode="flat" style={styles.defaultChip}>
                Default
              </Chip>
            )}
          </View>
          <View style={styles.addressActions}>
            {!address.isDefault && (
              <Button
                mode="text"
                onPress={() => handleSetDefault(address.id)}
                icon="star"
                textColor="#FFD700"
              >
                Set Default
              </Button>
            )}
            <Button
              mode="text"
              onPress={() => {/* TODO: Implement edit */}}
              icon="pencil"
            >
              Edit
            </Button>
            <Button
              mode="text"
              onPress={() => handleDeleteAddress(address.id)}
              icon="delete"
              textColor="#d32f2f"
            >
              Delete
            </Button>
          </View>
        </View>

        <Text style={styles.addressText}>{address.address}</Text>
        <Text style={styles.addressDetails}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="location-off" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No addresses found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first delivery address to get started
            </Text>
          </View>
        ) : (
          <View style={styles.addressesContainer}>
            {addresses.map(renderAddress)}
          </View>
        )}
      </ScrollView>

      {/* Add Address FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddDialog(true)}
        label="Add Address"
      />

      {/* Add Address Dialog */}
      <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
        <Dialog.Title>Add New Address</Dialog.Title>
        <Dialog.Content>
          <View style={styles.dialogContent}>
            <View style={styles.typeSelector}>
              <Text style={styles.typeLabel}>Address Type:</Text>
              <View style={styles.typeButtons}>
                {(['home', 'work', 'other'] as Address['type'][]).map((type) => (
                  <Button
                    key={type}
                    mode={newAddress.type === type ? 'contained' : 'outlined'}
                    onPress={() => setNewAddress({ ...newAddress, type })}
                    style={styles.typeButton}
                    contentStyle={styles.typeButtonContent}
                  >
                    {getAddressTypeLabel(type)}
                  </Button>
                ))}
              </View>
            </View>

            <TextInput
              label="Address"
              value={newAddress.address}
              onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.dialogInput}
            />

            <TextInput
              label="City"
              value={newAddress.city}
              onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
              mode="outlined"
              style={styles.dialogInput}
            />

            <TextInput
              label="State"
              value={newAddress.state}
              onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
              mode="outlined"
              style={styles.dialogInput}
            />

            <TextInput
              label="Pincode"
              value={newAddress.pincode}
              onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
              mode="outlined"
              keyboardType="numeric"
              style={styles.dialogInput}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onPress={handleAddAddress} mode="contained">Add Address</Button>
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
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addressesContainer: {
    padding: 20,
  },
  addressCard: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  },
  dialogContent: {
    gap: 16,
  },
  typeSelector: {
    gap: 8,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
  },
  typeButtonContent: {
    paddingVertical: 4,
  },
  dialogInput: {
    backgroundColor: 'transparent',
  },
}); 