import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

interface FoodCategoriesProps {
  categories: FoodCategory[];
}

export default function FoodCategories({ categories }: FoodCategoriesProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    router.push(`/search?category=${categoryName}`);
  };

  const renderCategory = (category: FoodCategory) => (
    <Pressable
      key={category.id}
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(category.name)}
    >
      <View style={styles.categoryCard}>
        <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
          <MaterialIcons name={category.icon as any} size={24} color="white" />
        </View>
        <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
        <Text style={styles.categoryCount}>{category.itemCount} items</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>🍽️ Food Categories</Text>
          <Text style={styles.sectionSubtitle}>Explore by cuisine type</Text>
        </View>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FF6B35" />
        </Pressable>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(renderCategory)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  viewAllText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  scrollContent: {
    paddingRight: 20,
    paddingLeft: 0,
  },
  categoryItem: {
    marginRight: 20,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 120,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 18,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
}); 