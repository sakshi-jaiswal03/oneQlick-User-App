import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Chip,
  Divider,
  Button,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import {
  Address,
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
  formatFullAddress,
} from '../addressData';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  animationValue: Animated.Value;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  animationValue,
}: AddressCardProps) {
  return (
    <Animated.View
      style={[
        styles.addressCard,
        {
          opacity: animationValue,
          transform: [{
            translateY: animationValue.interpolate({
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
            <MaterialIcons
              name={getAddressTypeIcon(address.type)}
              size={20}
              color={getAddressTypeColor(address.type)}
            />
            <Chip
              mode="flat"
              textStyle={{ color: 'white' }}
              style={[styles.typeChip, { backgroundColor: getAddressTypeColor(address.type) }]}
              icon={() => (
                <MaterialIcons
                  name={getAddressTypeIcon(address.type)}
                  size={16}
                  color="white"
                />
              )}
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
              icon={() => <MaterialIcons name="edit" size={20} color="#666" />}
              onPress={() => onEdit(address)}
            />
            <IconButton
              icon={() => <MaterialIcons name="delete" size={20} color="#F44336" />}
              onPress={() => onDelete(address)}
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
              onPress={() => onSetDefault(address)}
              icon={() => <MaterialIcons name="star" size={16} color="#FF6B35" />}
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
              console.log('Map view requested for address:', address.id);
            }}
            icon={() => <MaterialIcons name="map-outline" size={16} color="#FF6B35" />}
            style={styles.actionButton}
            compact
          >
            View on Map
          </Button>
        </View>
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});
