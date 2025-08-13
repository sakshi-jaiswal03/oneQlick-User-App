import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface QuickReorder {
  id: string;
  restaurantName: string;
  lastOrderDate: string;
  items: string[];
  totalAmount: number;
}

interface QuickReorderProps {
  reorders: QuickReorder[];
}

export default function QuickReorder({ reorders }: QuickReorderProps) {
  const router = useRouter();

  if (reorders.length === 0) return null;

  const renderReorder = (reorder: QuickReorder) => (
    <Surface key={reorder.id} style={styles.reorderCard}>
      <View style={styles.reorderHeader}>
        <Text style={styles.reorderRestaurant}>{reorder.restaurantName}</Text>
        <Text style={styles.reorderDate}>{reorder.lastOrderDate}</Text>
      </View>
      
      <View style={styles.reorderItems}>
        {reorder.items.map((item, index) => (
          <Text key={index} style={styles.reorderItem} numberOfLines={1}>
            • {item}
          </Text>
        ))}
      </View>
      
      <View style={styles.reorderFooter}>
        <Text style={styles.reorderTotal}>₹{reorder.totalAmount}</Text>
        <Button
          mode="contained"
          onPress={() => {/* TODO: Implement quick reorder */}}
          style={styles.reorderButton}
          contentStyle={styles.reorderButtonContent}
        >
          Reorder
        </Button>
      </View>
    </Surface>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Reorder</Text>
        <Pressable onPress={() => router.push('/(tabs)/orders')}>
          <Text style={styles.viewAllText}>View Orders</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.reorderContainer}>
          {reorders.map(renderReorder)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  reorderContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  reorderCard: {
    width: 280,
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
  },
  reorderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reorderRestaurant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reorderDate: {
    fontSize: 12,
    color: '#666',
  },
  reorderItems: {
    marginBottom: 16,
  },
  reorderItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reorderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reorderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  reorderButton: {
    backgroundColor: '#FF6B35',
  },
  reorderButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
}); 