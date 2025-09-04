import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const renderCategory = (category: FoodCategory, index: number) => {
    return (
    <Pressable
      key={category.id}
        style={[
          styles.categoryItem,
          { marginLeft: index === 0 ? 16 : 0 }
        ]}
      onPress={() => handleCategoryPress(category.name)}
    >
        <View style={styles.categoryCard}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
            <MaterialCommunityIcons 
              name={category.icon as any} 
              size={24} 
              color="white" 
            />
          </View>
          
          {/* Name */}
          <Text style={styles.categoryName} numberOfLines={1}>
            {category.name}
          </Text>
        </View>
    </Pressable>
  );
  };

  return (
    <View style={styles.section}>
      {/* Simple Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Food Categories</Text>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#FF6B35" />
        </Pressable>
      </View>
      
      {/* Categories Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => renderCategory(category, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryItem: {
    marginRight: 12,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a1a1a',
    lineHeight: 16,
  },
}); 