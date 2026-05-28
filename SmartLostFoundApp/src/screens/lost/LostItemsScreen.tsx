import React, { useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Platform,StatusBar,TextInput,Image,FlatList,} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import TabNavigator, { TabName } from '../../navigation/TabNavigator';

// Types
export interface LostItem {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  description: string;
  image: string;
  category: string;
  isFavorite: boolean;
}

interface Props {
  onItemPress: (item: LostItem) => void;
}

// Mock data
const MOCK_ITEMS: LostItem[] = [
  {
    id: '1',
    title: 'Silver Keychain',
    location: 'Central Park Mall, Food Court',
    timeAgo: '2h ago',
    description: 'Found near the seating area near the main entrance. Set of 3 keys with a small blue...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Personal Effects',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Black Umbrella',
    location: 'City Library, 2nd Floor',
    timeAgo: '5h ago',
    description: 'Found beside a reading table on the second floor. Standard black foldable umbrella...',
    image: 'https://images.unsplash.com/photo-1587740896339-96a76170508d?w=400',
    category: 'Personal Effects',
    isFavorite: false,
  },
  {
    id: '3',
    title: 'iPhone 13 Case',
    location: 'Metro Station, Platform 3',
    timeAgo: '1d ago',
    description: 'Clear silicone case with a small sticker on the back. Found on the bench near exit...',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
    category: 'Electronics',
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Blue Water Bottle',
    location: 'Riverside Park, Near Fountain',
    timeAgo: '2d ago',
    description: 'Blue stainless steel water bottle with a dent on the side. Has a small logo sticker...',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    category: 'Pets',
    isFavorite: true,
  },
  {
    id: '5',
    title: 'Leather Gloves',
    location: 'Shopping Mall, Parking Level B',
    timeAgo: '3d ago',
    description: 'Pair of brown leather gloves found near the elevator on parking level B...',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400',
    category: 'Personal Effects',
    isFavorite: false,
  },
];

const CATEGORIES = ['All Items', 'Electronics', 'Pets', 'Personal Effects', 'Keys', 'Other'];

// Component
const LostItemsScreen: React.FC<Props> = ({ onItemPress }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Lost');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<LostItem[]>(MOCK_ITEMS);

  const toggleFavorite = (id: string) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)
    );
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All Items' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Findora</Text>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Lost Items</Text>
        <Text style={styles.pageSubtitle}>
          Report your lost treasure and see if it gets spotted today.
        </Text>

        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lost items..."
            placeholderTextColor="#bbb"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color="#0d7377" />
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items list */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          filteredItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => onItemPress(item)}
              activeOpacity={0.92}
            >
              {/* Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                {/* Favorite button */}
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons
                    name={item.isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={item.isFavorite ? '#e74c3c' : '#fff'}
                  />
                </TouchableOpacity>
              </View>

              {/* Card content */}
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                </View>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color="#aaa" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
                <Text style={styles.descText} numberOfLines={2}>
                  {item.description}
                </Text>
                <TouchableOpacity onPress={() => onItemPress(item)}>
                  <Text style={styles.detailsLink}>Details →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Bottom padding for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Tab bar */}
      <TabNavigator activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 44 : 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d7377',
  },
  notifButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    lineHeight: 19,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#efefef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  filterButton: {
    padding: 4,
  },
  chipsRow: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#0d7377',
    borderColor: '#0d7377',
  },
  chipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#bbb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 160,
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  timeAgo: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#aaa',
    flex: 1,
  },
  descText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  detailsLink: {
    fontSize: 13,
    color: '#0d7377',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 78,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e6a817',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e6a817',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default LostItemsScreen;