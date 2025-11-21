import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppTheme from '../theme';

// Mock MapView component for development - replace with actual react-native-maps when available
const MapView = ({ children, style, initialRegion }) => (
  <TouchableOpacity style={[style, { backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 16 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="map-outline" size={16} color="#64748b" style={{ marginRight: 8 }} />
        <Text style={{ color: '#666', fontSize: 14 }}>Map View</Text>
      </View>
    </View>
    <Text style={{ color: '#999', fontSize: 12, marginTop: 8 }}>Install react-native-maps for full functionality</Text>
    {children}
  </TouchableOpacity>
);

const Marker = ({ title, description }) => (
  <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
    <Ionicons name="location" size={12} color="#666" style={{ marginRight: 4 }} />
    <Text style={{ fontSize: 12, color: '#333' }}>{title}</Text>
  </View>
);

const TrackingScreen = ({ route, navigation }) => {
  const { order } = route.params || {};
  const [orderStatus, setOrderStatus] = useState(order?.status?.toLowerCase() || 'preparing');

  // Mock locations for demo
  const shopLocation = {
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const deliveryLocation = {
    latitude: 19.0820,
    longitude: 72.8820,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const customerLocation = {
    latitude: 19.0780,
    longitude: 72.8790,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#22c55e';
      case 'preparing':
        return '#f59e0b';
      case 'ready':
        return '#3b82f6';
      case 'picked_up':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 'confirmed':
        return <Ionicons name="checkmark-circle" size={20} color="#22c55e" />;
      case 'preparing':
        return <Ionicons name="restaurant-outline" size={20} color="#64748b" />;
      case 'ready':
        return <Ionicons name="fast-food-outline" size={20} color="#64748b" />;
      case 'picked_up':
        return <Ionicons name="bicycle-outline" size={20} color="#64748b" />;
      case 'delivered':
        return <Ionicons name="home-outline" size={20} color="#64748b" />;
      default:
        return <Ionicons name="radio-button-off" size={20} color="#cbd5e1" />;
    }
  };

  const trackingSteps = [
    { id: 'confirmed', label: 'Order Confirmed', time: '2:30 PM' },
    { id: 'preparing', label: 'Preparing Food', time: '2:45 PM' },
    { id: 'ready', label: 'Ready for Pickup', time: '3:15 PM' },
    { id: 'picked_up', label: 'Out for Delivery', time: '3:30 PM' },
    { id: 'delivered', label: 'Delivered', time: '4:00 PM' }
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.id === orderStatus);

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No order details available.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 65, zIndex: 1 }}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.headerSubtitle}>Order #{order.id}</Text>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <View style={styles.restaurantInfo}>
            <View>
              <Text style={styles.restaurantName}>{order.vendorName || 'Restaurant'}</Text>
              <Text style={styles.restaurantAddress}>123 Food Street, City Center</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Rajesh Kumar</Text>
              <Text style={styles.driverTitle}>Delivery Partner</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <View style={styles.etaBadge}>
              <Text style={styles.etaText}>25 min</Text>
            </View>
          </View>
          <Text style={styles.addressText}>Apartment 4B, Sunrise Apartments, MG Road</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Order Progress</Text>
          <View style={styles.progressContainer}>
            {trackingSteps.map((step, index) => (
              <View key={step.id} style={styles.progressStep}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: index <= currentStepIndex ? '#22c55e' : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
                  {getStatusIcon(step.id)}
                </View>
                {index < trackingSteps.length - 1 && (
                  <View style={[styles.progressLine, { backgroundColor: index < currentStepIndex ? getStatusColor(step.id) : '#e5e7eb' }]} />
                )}
              </View>
            ))}
          </View>
          <View style={styles.progressLabels}>
            {trackingSteps.map((step, index) => (
              <Text key={step.id} style={[styles.progressLabel, index <= currentStepIndex && styles.activeLabel]}>
                {step.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Live Tracking</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={shopLocation}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={shopLocation}
                title={order.vendorName || "Restaurant"}
                description="Your order is being prepared here"
                pinColor="green"
              />
              <Marker
                coordinate={deliveryLocation}
                title="Rajesh Kumar"
                description="Delivery Partner"
                pinColor="blue"
              />
              <Marker
                coordinate={customerLocation}
                title="Delivery Address"
                description="Your location"
                pinColor="red"
              />
            </MapView>
          </View>
        </View>

        {/* Current Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Current Status</Text>
            <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
              {trackingSteps[currentStepIndex]?.label || order.status}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            Your order is being prepared by the restaurant chef. Estimated delivery time is 25 minutes.
          </Text>
        </View>

        {/* Call Driver Button */}
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Call Driver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: AppTheme.Colors.background,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: AppTheme.Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppTheme.Colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AppTheme.Colors.white + '80',
  },
  restaurantCard: {
    margin: 16,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppTheme.Colors.text,
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
  },
  driverInfo: {
    alignItems: 'flex-end',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
    marginBottom: 2,
  },
  driverTitle: {
    fontSize: 12,
    color: AppTheme.Colors.textLight,
  },
  addressCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
  },
  etaBadge: {
    backgroundColor: AppTheme.Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppTheme.Colors.white,
  },
  addressText: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
  },
  mapCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIconText: {
    fontSize: 16,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: AppTheme.Colors.textLight,
    textAlign: 'center',
    flex: 1,
  },
  activeLabel: {
    color: AppTheme.Colors.text,
    fontWeight: '600',
  },
  statusCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
    lineHeight: 20,
  },
  callButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: AppTheme.Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.white,
  },
});

export default TrackingScreen;