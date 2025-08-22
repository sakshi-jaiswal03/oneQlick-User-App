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
        <Text style={styles.sectionTitle}>🔄 Quick Reorder</Text>
        <Pressable onPress={() => router.push('/(tabs)/orders')}>
          <Text style={styles.viewAllText}>View Orders</Text>
        </Pressable>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {reorders.map(renderReorder)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 20,
  },
  reorderCard: {
    width: 280,
    padding: 20,
    marginRight: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  reorderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reorderRestaurant: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  reorderDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  reorderItems: {
    marginBottom: 20,
  },
  reorderItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  reorderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reorderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  reorderButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    elevation: 2,
  },
  reorderButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
}); 