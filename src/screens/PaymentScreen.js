import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const PaymentScreen = ({ navigation, route }) => {
  const { cart } = route.params || {};
  const [cartItems, setCartItems] = useState(cart || []);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState('Home - 123 Main Street, Mumbai');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  ];

  useEffect(() => {
    if (!cart) {
      // Load cart if not passed as params
      loadCart();
    }
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.getCart();
      if (response.success) {
        setCartItems(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => 40;
  const getGST = () => getTotalPrice() * 0.05;
  const getGrandTotal = () => getTotalPrice() + getDeliveryFee() + getGST();

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'upi' && !cardDetails.number) {
      Alert.alert('Missing Information', 'Please enter UPI ID');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        amount: getGrandTotal(),
        method: selectedPaymentMethod,
        items: cartItems,
        address: deliveryAddress,
      };

      const response = await api.processPayment(paymentData);

      if (response.success) {
        // Place the order
        const orderData = {
          vendorName: 'Green Tea House', // This should be dynamic based on cart
          total: getGrandTotal(),
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        const orderResponse = await api.placeOrder(orderData);

        if (orderResponse.success) {
          Alert.alert(
            'Payment Successful!',
            `Your order has been placed successfully.\nOrder ID: ${orderResponse.order.orderId}`,
            [
              {
                text: 'View Order',
                onPress: () => navigation.navigate('Tracking', { order: orderResponse.order }),
              },
              {
                text: 'Back to Home',
                onPress: () => navigation.navigate('Home'),
                style: 'cancel',
              },
            ]
          );
        } else {
          Alert.alert('Error', 'Order placement failed. Please contact support.');
        }
      } else {
        Alert.alert('Payment Failed', response.error || 'Please try again or choose a different payment method.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.methodContent}>
        <Text style={styles.methodIcon}>{method.icon}</Text>
        <Text style={[
          styles.methodName,
          selectedPaymentMethod === method.id && styles.selectedMethodText,
        ]}>
          {method.name}
        </Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.selectedRadioButton,
      ]}>
        {selectedPaymentMethod === method.id && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  const renderCardForm = () => (
    <View style={styles.cardForm}>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardDetails.number}
        onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
        keyboardType="numeric"
        placeholderTextColor="#64748b"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="MM/YY"
          value={cardDetails.expiry}
          onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
          placeholderTextColor="#64748b"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          value={cardDetails.cvv}
          onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
          keyboardType="numeric"
          secureTextEntry
          placeholderTextColor="#64748b"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Cardholder Name"
        value={cardDetails.name}
        onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
        placeholderTextColor="#64748b"
      />
    </View>
  );

  const renderUPIForm = () => (
    <View style={styles.upiForm}>
      <TextInput
        style={styles.input}
        placeholder="Enter UPI ID (e.g., user@paytm)"
        value={cardDetails.number}
        onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
        placeholderTextColor="#64748b"
      />
    </View>
  );

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>₹{getTotalPrice()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>₹{getDeliveryFee()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%):</Text>
            <Text style={styles.summaryValue}>₹{getGST().toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{getGrandTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Card style={styles.addressCard}>
            <CardContent>
              <View style={styles.addressContent}>
                <Text style={styles.addressIcon}>📍</Text>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{deliveryAddress.split(' - ')[0]}</Text>
                  <Text style={styles.addressDetail}>{deliveryAddress.split(' - ')[1]}</Text>
                </View>
                <TouchableOpacity style={styles.changeButton}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}

          {/* Payment Forms */}
          {selectedPaymentMethod === 'upi' && renderUPIForm()}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={`Pay ₹${getGrandTotal().toFixed(2)}`}
          onPress={handlePayment}
          loading={loading}
          style={styles.checkoutButton}
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
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
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
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
  addressSection: {
    marginTop: 24,
  },
  addressCard: {
    marginBottom: 8,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  addressDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentSection: {
    marginTop: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedPaymentMethod: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedMethodText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#22c55e',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  cardForm: {
    marginTop: 16,
  },
  upiForm: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  checkoutContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  checkoutButton: {
    backgroundColor: '#22c55e',
  },
  bottomPadding: {
    height: 20,
  },
});

export default PaymentScreen;