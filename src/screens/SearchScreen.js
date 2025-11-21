import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const SearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ vendors: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { searchQuery: initialQuery, category } = route.params || {};

  // Categories list for UI
  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline', iconType: 'ionicons' },
    { id: 'tea', name: 'Tea', icon: 'tea', iconType: 'material' },
    { id: 'coffee', name: 'Coffee', icon: 'coffee', iconType: 'material' },
    { id: 'snacks', name: 'Snacks', icon: 'cookie', iconType: 'material' },
    { id: 'combos', name: 'Combos', icon: 'silverware-fork-knife', iconType: 'material' },
    { id: 'desserts', name: 'Desserts', icon: 'cupcake', iconType: 'material' },
  ];

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    } else if (category) {
      // Find the category ID from the category name
      const matchingCategory = categories.find(
        cat => cat.name.toLowerCase() === category.toLowerCase()
      );
      const categoryId = matchingCategory ? matchingCategory.id : category.toLowerCase();
      setSelectedCategory(categoryId);
      performSearch('', categoryId);
    }
  }, [initialQuery, category]);


  const performSearch = async (query = searchQuery, categoryFilter = selectedCategory) => {
    if (!query.trim() && !categoryFilter) return;

    setLoading(true);
    try {
      const params = {};
      if (query.trim()) params.query = query;
      if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;

      const response = await api.search(params);
      if (response.success) {
        setResults(response.results);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      performSearch(searchQuery);
    } else {
      performSearch(searchQuery, categoryId);
    }
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('Vendor', { vendor });
  };

  const handleAddToCart = async (item) => {
    try {
      const response = await api.addToCart(item);
      if (response.success) {
        Alert.alert('Success', `${item.name} added to cart!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      {item.iconType === 'material' ? (
        <MaterialCommunityIcons
          name={item.icon}
          size={18}
          color={selectedCategory === item.id ? '#ffffff' : '#64748b'}
          style={{ marginBottom: 4 }}
        />
      ) : (
        <Ionicons
          name={item.icon}
          size={18}
          color={selectedCategory === item.id ? '#ffffff' : '#64748b'}
          style={{ marginBottom: 4 }}
        />
      )}
      <Text style={[
        styles.categoryName,
        selectedCategory === item.id && styles.selectedCategoryText,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <Card style={styles.resultCard} onPress={() => handleVendorPress(item)}>
      <View style={styles.vendorContent}>
        <Image source={{ uri: item.image }} style={styles.vendorImage} />
        <CardContent style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <View style={styles.vendorMeta}>
            <Text style={styles.vendorRating}>⭐ {item.rating}</Text>
            <Text style={styles.vendorTime}>⏰ {item.time}</Text>
            <Text style={styles.vendorDistance}>• {item.distance}</Text>
          </View>
          <Text style={styles.vendorOffers}>{item.offers}</Text>
          <Text style={styles.vendorPrice}>{item.price}</Text>
        </CardContent>
      </View>
    </Card>
  );

  const renderMenuItem = ({ item }) => (
    <Card style={styles.resultCard}>
      <View style={styles.itemContent}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }} style={styles.itemImage} />
        <CardContent style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemVendor}>{item.vendorName}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </CardContent>
        <Button
          title="Add"
          onPress={() => handleAddToCart(item)}
          size="small"
          style={styles.addButton}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food, drinks, vendors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#64748b"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Results */}
        {(results.vendors.length > 0 || results.items.length > 0) && (
          <>
            {/* Vendors */}
            {results.vendors.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Restaurants ({results.vendors.length})</Text>
                <FlatList
                  data={results.vendors}
                  renderItem={renderVendor}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Menu Items */}
            {results.items.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Menu Items ({results.items.length})</Text>
                <FlatList
                  data={results.items}
                  renderItem={renderMenuItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && searchQuery && results.vendors.length === 0 && results.items.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsText}>
              Try searching for different keywords or check your spelling
            </Text>
          </View>
        )}

        {/* Search Suggestions */}
        {!searchQuery && (
          <View style={styles.suggestions}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            {['Pizza', 'Burger', 'Coffee', 'Ice Cream', 'Sandwich', 'Pasta'].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchQuery(suggestion);
                  performSearch(suggestion);
                }}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 8,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategory: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  categoryIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 12,
    padding: 16,
  },
  vendorContent: {
    flexDirection: 'row',
  },
  vendorImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
    padding: 0,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorRating: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  vendorTime: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  vendorDistance: {
    fontSize: 12,
    color: '#64748b',
  },
  vendorOffers: {
    fontSize: 10,
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginBottom: 4,
  },
  vendorPrice: {
    fontSize: 12,
    color: '#64748b',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    padding: 0,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  itemVendor: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  suggestions: {
    marginTop: 16,
  },
  suggestionItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  bottomPadding: {
    height: 20,
  },
});

export default SearchScreen;