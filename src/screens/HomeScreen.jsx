import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import AddressSelectionModal from './AddressSelectionModal';
import api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadHomeData();
    loadCart();
    loadWallet();
  }, []);

  // Add focus listener to refresh cart when returning to home
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCart(); // Refresh cart when screen comes into focus
    });

    return unsubscribe;
  }, [navigation]);

  const loadHomeData = async () => {
    try {
      const [categoriesResponse, vendorsResponse, addressesResponse, notificationsResponse] = await Promise.all([
        api.getCategories(),
        api.getVendors(),
        api.getAddresses(),
        api.getNotifications(),
      ]);

      if (categoriesResponse.success) setCategories(categoriesResponse.categories);
      if (vendorsResponse.success) setVendors(vendorsResponse.vendors);
      if (addressesResponse.success) setAddresses(addressesResponse.addresses);
      if (notificationsResponse.success) setNotifications(notificationsResponse.notifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigation.navigate('Search', { searchQuery: searchText });
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('Vendor', { vendor });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Search', { category: category.name });
  };

  const handleSortPress = (sortKey) => {
    setSortBy(sortKey);
    // Sort vendors based on the selected criteria
    const sortedVendors = [...vendors].sort((a, b) => {
      switch (sortKey) {
        case 'price_low':
          return parseFloat(a.price.replace('₹', '').replace(' for two', '')) -
                 parseFloat(b.price.replace('₹', '').replace(' for two', ''));
        case 'price_high':
          return parseFloat(b.price.replace('₹', '').replace(' for two', '')) -
                 parseFloat(a.price.replace('₹', '').replace(' for two', ''));
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0;
      }
    });
    setVendors(sortedVendors);
  };

  const handleSeeAllOrderAgain = () => {
    navigation.navigate('Search', { section: 'orderAgain' });
  };

  const handleSeeAllVendors = () => {
    navigation.navigate('Search', { section: 'allVendors' });
  };


  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleClaimOffer = () => {
    Alert.alert('Offer Claimed!', 'Code NASHTO40 applied to your account.');
  };

  const [cart, setCart] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const loadCart = async () => {
    try {
      const response = await api.getCart();
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadWallet = async () => {
    try {
      const response = await api.getWallet();
      if (response.success) {
        setWallet(response.wallet);
      }
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const handleAddToCart = async (item, restaurantId, restaurantName) => {
    try {
      const response = await api.addToCart(item, restaurantId, restaurantName);
      if (response.success) {
        setCart(response.cart);
        Alert.alert('Added to Cart', `${item.name} added to your cart.`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleUpdateCartItem = async (restaurantId, itemId, quantity) => {
    try {
      const response = await api.updateCartItem(restaurantId, itemId, quantity);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const getItemQuantity = (itemId) => {
    // Search through all restaurant groups
    for (const restaurantGroup of cart.items || []) {
      const cartItem = restaurantGroup.items.find(item => item.id === itemId);
      if (cartItem) return cartItem.quantity;
    }
    return 0;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleAddressPress = () => {
    setAddressModalVisible(true);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(addresses.findIndex(addr => addr.id === address.id));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryItems}>{item.items} items</Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <Card 
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item)}
    >
      <View style={styles.vendorContent}>
        <Image source={{ uri: item.image }} style={styles.vendorImage} />
        {item.promoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        <CardContent style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <View style={styles.vendorMeta}>
            <Text style={styles.vendorRating}>⭐ {item.rating}</Text>
            <Text style={styles.vendorTime}>⏰ {item.time}</Text>
            <Text style={styles.vendorDistance}>• {item.distance}</Text>
          </View>
          <View style={styles.vendorOffer}>
            <Text style={styles.offerText}>{item.offers}</Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </CardContent>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>📍</Text>
          </View>
          <View>
            <Text style={styles.deliverToText}>Deliver to</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressName}>{addresses[selectedAddress]?.name || 'Home'}</Text>
              <Text style={styles.addressText}>• {addresses[selectedAddress]?.address || 'Loading address...'}</Text>
            </View>
          </View>
          <View style={styles.dropdownIcon}>
            <Text style={styles.dropdownIconText}>▼</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNotificationPress}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.walletBalance}>₹{wallet.balance}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer} onPress={handleSearch}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food, drinks, vendors..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </TouchableOpacity>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { label: 'Price: Low to High', key: 'price_low' },
            { label: 'Price: High to Low', key: 'price_high' },
            { label: 'Rating', key: 'rating' },
            { label: 'Distance', key: 'distance' }
          ].map((filter) => (
            <TouchableOpacity key={filter.key} style={styles.filterButton} onPress={() => handleSortPress(filter.key)}>
              <Text style={styles.filterText}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Offer */}
        <View style={[styles.offerCard, { backgroundColor: '#22c55e' }]}>
          <View style={styles.offerContent}>
            <View style={styles.offerTextContainer}>
              <Text style={styles.offerTitle}>Welcome Offer!</Text>
              <Text style={styles.offerSubtitle}>
                Get 40% off on your first 3 orders with code NASHTO40
              </Text>
            </View>
            <Button title="Claim" size="small" style={styles.claimButton} onPress={handleClaimOffer} />
          </View>
        </View>

        {/* Add Offer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Placeholder for offers */}
            <View style={styles.offerItem}>
              <Text style={styles.offerItemTitle}>Free Delivery</Text>
              <Text style={styles.offerItemSubtitle}>On orders above ₹500</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerItemTitle}>₹100 Off</Text>
              <Text style={styles.offerItemSubtitle}>Use code WELCOME</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerItemTitle}>Buy 1 Get 1</Text>
              <Text style={styles.offerItemSubtitle}>On selected items</Text>
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Order Again */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Order again</Text>
             <TouchableOpacity onPress={handleSeeAllOrderAgain}>
               <Text style={styles.seeAllText}>See all</Text>
             </TouchableOpacity>
           </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 1, name: 'Masala Chai', price: 25, vendorId: 1, restaurantName: 'Green Tea House' },
              { id: 2, name: 'Samosa', price: 20, vendorId: 1, restaurantName: 'Green Tea House' },
              { id: 3, name: 'Filter Coffee', price: 30, vendorId: 1, restaurantName: 'Green Tea House' },
              { id: 4, name: 'Dhokla', price: 40, vendorId: 2, restaurantName: 'Herbal Garden Cafe' },
              { id: 7, name: 'Dhokla', price: 40, vendorId: 3, restaurantName: 'Pure Veg Corner' },
              { id: 19, name: 'Chocolate Cake', price: 80, vendorId: 5, restaurantName: 'Sweet Dreams Bakery' }
            ].map((item) => (
              <View key={item.id} style={styles.orderAgainItem}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }} style={styles.orderAgainImage} />
                <Text style={styles.orderAgainName}>{item.name}</Text>
                <Text style={styles.orderAgainVendor}>{item.restaurantName}</Text>
                <Text style={styles.orderAgainPrice}>₹{item.price}</Text>
                {getItemQuantity(item.id) > 0 ? (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateCartItem(item.vendorId, item.id, getItemQuantity(item.id) - 1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{getItemQuantity(item.id)}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateCartItem(item.vendorId, item.id, getItemQuantity(item.id) + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button title="Add" size="small" style={styles.addButton} onPress={() => handleAddToCart(item, item.vendorId, item.restaurantName)} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popular Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Popular stores near you</Text>
             <TouchableOpacity onPress={handleSeeAllVendors}>
               <Text style={styles.seeAllText}>See all ›</Text>
             </TouchableOpacity>
           </View>
          <FlatList
            data={vendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.navIcon, { color: '#22c55e' }]}>🏠</Text>
          <Text style={[styles.navText, { color: '#22c55e' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.navIconContainer}>
            <Text style={[styles.navIcon, { color: '#64748b' }]}>🛒</Text>
            {(cart.items || []).reduce((total, group) => total + group.items.length, 0) > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{(cart.items || []).reduce((total, group) => total + group.items.length, 0)}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, { color: '#64748b' }]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <Text style={[styles.navIcon, { color: '#64748b' }]}>📋</Text>
          <Text style={[styles.navText, { color: '#64748b' }]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={[styles.navIcon, { color: '#64748b' }]}>👤</Text>
          <Text style={[styles.navText, { color: '#64748b' }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={handleAddressSelect}
        selectedAddress={addresses[selectedAddress]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownIconText: {
    fontSize: 12,
    color: '#64748b',
  },
  locationIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 16,
  },
  deliverToText: {
    fontSize: 12,
    color: '#64748b',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  walletBalance: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 12,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  offerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#f0fdf4',
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  categoryItems: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  orderAgainItem: {
    width: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  orderAgainImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  orderAgainName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  orderAgainVendor: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  orderAgainPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  vendorCard: {
    marginBottom: 12,
    padding: 0,
  },
  vendorContent: {
    flexDirection: 'row',
  },
  vendorImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  promotedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  promotedText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  vendorInfo: {
    flex: 1,
    padding: 12,
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
    marginBottom: 8,
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
  vendorOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerText: {
    fontSize: 10,
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 10,
    color: '#64748b',
  },
  bottomPadding: {
    height: 20,
  },
  offerItem: {
    width: 150,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  offerItemSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  navIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Add missing styles for quantity controls
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    minWidth: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;