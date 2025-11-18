import React from 'react';
import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './src/screens/AuthScreen.jsx';
import HomeScreen from './src/screens/HomeScreen.jsx';
import CartScreen from './src/screens/CartScreen.jsx';
import SearchScreen from './src/screens/SearchScreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';
import PaymentScreen from './src/screens/PaymentScreen.js';
import TrackingScreen from './src/screens/TrackingScreen.js';
import VendorScreen from './src/screens/VendorScreen.jsx';
import ReviewsScreen from './src/screens/ReviewsScreen.jsx';
import SupportScreen from './src/screens/SupportScreen.jsx';
import NotificationsScreen from './src/screens/NotificationsScreen.jsx';
import OrdersScreen from './src/screens/OrdersScreen.jsx';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen.jsx';
import WalletScreen from './src/screens/WalletScreen.jsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Vendor" component={VendorScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Register the app component for React Native
AppRegistry.registerComponent('main', () => App);