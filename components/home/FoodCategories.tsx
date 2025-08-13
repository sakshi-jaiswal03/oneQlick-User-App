import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
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
      <Surface style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <MaterialIcons name={category.icon as any} size={28} color="white" />
      </Surface>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryCount}>{category.itemCount} items</Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Food Categories</Text>
        <Pressable onPress={() => router.push('/search')}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategory)}
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
}); 