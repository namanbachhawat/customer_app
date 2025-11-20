import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const VendorScreen = ({ navigation, route }) => {
  const { vendor } = route.params || {};
  const [vendorData, setVendorData] = useState(vendor || null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (vendor) {
      loadVendorMenu(vendor.id);
    }
  }, [vendor]);

  const loadVendorMenu = async (vendorId) => {
    try {
      const response = await api.getVendorMenu(vendorId);
      if (response.success) {
        setMenu(response.menu);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu');
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await api.addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
        },
        vendorData.id,
        vendorData.name
      );
      if (response.success) {
        Alert.alert('Success', `${item.name} added to cart!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderMenuItem = (item) => (
    <Card key={item.id} style={styles.menuItem}>
      <View style={styles.itemContent}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }}
          style={styles.itemImage}
        />
        <CardContent style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </CardContent>
        <Button
          title="Add"
          onPress={() => addToCart(item)}
          size="small"
          style={styles.addButton}
        />
      </View>
    </Card>
  );

  if (!vendorData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Vendor not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{vendorData.name}</Text>
          <Text style={styles.headerSubtitle}>⭐ {vendorData.rating} • {vendorData.time}</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vendor Info */}
        <View style={styles.vendorInfo}>
          <Image source={{ uri: vendorData.image }} style={styles.vendorImage} />
          <View style={styles.vendorDetails}>
            <Text style={styles.vendorName}>{vendorData.name}</Text>
            <Text style={styles.vendorMeta}>
              ⭐ {vendorData.rating} • {vendorData.time} • {vendorData.distance}
            </Text>
            <Text style={styles.vendorOffers}>{vendorData.offers}</Text>
            <Text style={styles.vendorPrice}>{vendorData.price}</Text>
            <Text style={styles.vendorDescription}>{vendorData.description}</Text>
          </View>
        </View>

        {/* Menu Categories */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>

          {menu.length === 0 ? (
            <View style={styles.emptyMenu}>
              <Text style={styles.emptyText}>No menu items available</Text>
            </View>
          ) : (
            menu.map(renderMenuItem)
          )}
        </View>

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
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  vendorInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
  },
  vendorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  vendorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  vendorMeta: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  vendorOffers: {
    fontSize: 12,
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontWeight: '600',
  },
  vendorPrice: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  vendorDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  menuItem: {
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
  itemCategory: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
  },
  emptyMenu: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  bottomPadding: {
    height: 20,
  },
});

export default VendorScreen;