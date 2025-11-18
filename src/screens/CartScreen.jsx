import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [selectedRestaurants, setSelectedRestaurants] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.getCart();
      if (response.success) {
        setCart(response.cart);
        // Initialize selected restaurants
        const allRestaurants = new Set(response.cart.items.map(group => group.restaurantId));
        setSelectedRestaurants(allRestaurants);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart items');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCart();
  };

  const updateQuantity = async (restaurantId, itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(restaurantId, itemId);
      return;
    }

    try {
      const response = await api.updateCartItem(restaurantId, itemId, newQuantity);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const removeItem = async (restaurantId, itemId) => {
    try {
      const response = await api.removeFromCart(restaurantId, itemId);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const clearRestaurantCart = async (restaurantId) => {
    try {
      const response = await api.clearRestaurantCart(restaurantId);
      if (response.success) {
        setCart(response.cart);
        const newSelected = new Set(selectedRestaurants);
        newSelected.delete(restaurantId);
        setSelectedRestaurants(newSelected);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear restaurant cart');
    }
  };

  const applyCoupon = async (restaurantId, code) => {
    try {
      const response = await api.applyCoupon(restaurantId, code);
      if (response.success) {
        setCart(response.cart);
        Alert.alert('Success', 'Coupon applied successfully!');
        setCouponCode('');
        setShowCouponInput(false);
      } else {
        Alert.alert('Invalid Coupon', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply coupon');
    }
  };

  const toggleRestaurantSelection = (restaurantId) => {
    const newSelected = new Set(selectedRestaurants);
    if (newSelected.has(restaurantId)) {
      newSelected.delete(restaurantId);
    } else {
      newSelected.add(restaurantId);
    }
    setSelectedRestaurants(newSelected);
  };

  const getSelectedRestaurantsTotal = () => {
    const selectedItems = cart.items.filter(group => selectedRestaurants.has(group.restaurantId));
    return selectedItems.reduce((total, group) => {
      const subtotal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return total + subtotal + (group.deliveryFee || 0) + (subtotal * 0.05); // Including tax
    }, 0);
  };

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.clearCart();
              if (response.success) {
                setCart({ items: [] });
                setSelectedRestaurants(new Set());
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
            }
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }

    if (selectedRestaurants.size === 0) {
      Alert.alert('No Restaurants Selected', 'Please select at least one restaurant to checkout');
      return;
    }

    const selectedItems = cart.items.filter(group => selectedRestaurants.has(group.restaurantId));
    navigation.navigate('Payment', {
      cart: selectedItems,
      deliveryAddress: cart.deliveryAddress,
      globalCoupon: cart.globalCoupon
    });
  };

  const getTotalPrice = (restaurantGroup = null) => {
    if (restaurantGroup) {
      return restaurantGroup.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    return cart.items.reduce((total, group) =>
      total + group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, group) => total + group.items.length, 0);
  };

  const calculateRestaurantTotal = (restaurantGroup) => {
    const subtotal = getTotalPrice(restaurantGroup);
    const deliveryFee = restaurantGroup.deliveryFee || 0;
    const tax = subtotal * 0.05; // 5% GST
    let discount = 0;

    // Apply restaurant-specific coupons
    if (restaurantGroup.coupons) {
      restaurantGroup.coupons.forEach(coupon => {
        if (coupon.type === 'restaurant' && subtotal >= coupon.minOrder) {
          discount += subtotal * (coupon.discount / 100);
        }
      });
    }

    // Apply global coupon
    if (cart.globalCoupon && subtotal >= cart.globalCoupon.minOrder) {
      discount += subtotal * (cart.globalCoupon.discount / 100);
    }

    return {
      subtotal: subtotal || 0,
      deliveryFee,
      tax: tax || 0,
      discount,
      total: (subtotal + deliveryFee + tax - discount) || 0
    };
  };

  const renderCartItem = ({ item, restaurantId }) => (
    <Card style={styles.cartItem}>
      <View style={styles.itemContent}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }}
          style={styles.itemImage}
        />
        <CardContent style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          {item.specialInstructions && (
            <Text style={styles.specialInstructionsText}>Note: {item.specialInstructions}</Text>
          )}
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(restaurantId, item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(restaurantId, item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(restaurantId, item.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderRestaurantSection = (restaurantGroup) => {
    const totals = calculateRestaurantTotal(restaurantGroup);
    const isSelected = selectedRestaurants.has(restaurantGroup.restaurantId);

    return (
      <View key={restaurantGroup.restaurantId} style={styles.restaurantSection}>
        {/* Restaurant Header */}
        <View style={styles.restaurantHeader}>
          <TouchableOpacity
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            onPress={() => toggleRestaurantSelection(restaurantGroup.restaurantId)}
          >
            {isSelected && <Text style={styles.checkboxText}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.restaurantInfo}>
            <Text style={[styles.restaurantName, styles.boldText]}>{restaurantGroup.restaurantName}</Text>
            <Text style={styles.deliveryInfo}>
              {restaurantGroup.deliveryTime} min • ₹{restaurantGroup.deliveryFee} delivery
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => clearRestaurantCart(restaurantGroup.restaurantId)}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          {restaurantGroup.items.map((item, index) => (
            <View key={item.id || index}>
              {renderCartItem({ item, restaurantId: restaurantGroup.restaurantId })}
            </View>
          ))}
        </View>

        {/* Special Instructions */}
        <View style={styles.specialInstructionsContainer}>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Restaurant instructions (e.g., no cutlery)"
            value={restaurantGroup.specialInstructions}
            onChangeText={(text) => {
              // Update special instructions
              const updatedCart = { ...cart };
              const group = updatedCart.items.find(g => g.restaurantId === restaurantGroup.restaurantId);
              group.specialInstructions = text;
              setCart(updatedCart);
            }}
            multiline
          />
        </View>

        {/* Restaurant Summary */}
        <View style={styles.restaurantSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>₹{totals.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>₹{totals.deliveryFee}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST:</Text>
            <Text style={styles.summaryValue}>₹{totals.tax.toFixed(2)}</Text>
          </View>
          {totals.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>-₹{totals.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{totals.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        {cart.items.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious items to get started</Text>
          <Button
            title="Browse Restaurants"
            onPress={() => navigation.navigate('Home')}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <>
          {/* Global Coupon Section */}
          <View style={styles.globalCouponSection}>
            <TouchableOpacity
              style={styles.couponButton}
              onPress={() => setShowCouponInput(!showCouponInput)}
            >
              <Text style={styles.couponButtonText}>
                {cart.globalCoupon ? `Global Coupon: ${cart.globalCoupon.code}` : 'Apply Global Coupon'}
              </Text>
            </TouchableOpacity>
            {showCouponInput && (
              <View style={styles.couponInputContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity
                  style={styles.applyCouponButton}
                  onPress={() => applyCoupon(null, couponCode)}
                >
                  <Text style={styles.applyCouponText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {cart.items && cart.items.map((restaurantGroup, index) => (
              <View key={restaurantGroup.restaurantId || index}>
                {renderRestaurantSection(restaurantGroup)}
              </View>
            ))}
          </ScrollView>

          {/* Global Coupon Section at Bottom */}
          <View style={styles.bottomCouponSection}>
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity
                style={styles.applyCouponButton}
                onPress={() => applyCoupon(null, couponCode)}
              >
                <Text style={styles.applyCouponText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {cart.globalCoupon && (
              <Text style={styles.appliedGlobalCoupon}>Applied: {cart.globalCoupon.code} (-{cart.globalCoupon.discount}%)</Text>
            )}
          </View>

          {/* Global Cart Summary */}
          {selectedRestaurants.size > 0 && (
            <View style={styles.globalSummary}>
              <Text style={styles.summaryTitle}>
                {selectedRestaurants.size} restaurant{selectedRestaurants.size > 1 ? 's' : ''} selected
              </Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryValue}>₹{getSelectedRestaurantsTotal().toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <Button
              title={`Checkout Selected (${selectedRestaurants.size}) • ₹${getSelectedRestaurantsTotal().toFixed(2)}`}
              onPress={handleCheckout}
              loading={loading}
              style={styles.checkoutButton}
              disabled={selectedRestaurants.size === 0}
            />
          </View>
        </>
      )}
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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartItem: {
    marginBottom: 12,
    padding: 16,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    padding: 0,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#ef4444',
  },
  cartSummary: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  checkoutContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 40, // Add extra padding to prevent cutoff
  },
  checkoutButton: {
    backgroundColor: '#22c55e',
  },
  specialInstructionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 40,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
  },
  frequentlyBought: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  recommendationItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  recommendationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 2,
  },
  recommendationPrice: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 4,
  },
  addRecommendationBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRecommendationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;