// Mock API service for Nashtto customer app
// All API calls are simulated with setTimeout for realistic behavior

class ApiService {
  constructor() {
    this.baseDelay = 1000; // Base delay for API calls
    this.mockData = {
      // User data
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        addresses: [
          { id: 1, name: 'Home', address: '123 Main Street, Mumbai', isDefault: true },
          { id: 2, name: 'Work', address: '456 Business Plaza, BKC, Mumbai', isDefault: false },
          { id: 3, name: "Friend's Place", address: '789 Park Avenue, Andheri, Mumbai', isDefault: false },
        ],
        preferences: {
          notifications: true,
          language: 'en',
          currency: 'INR'
        }
      },

      // Categories
      categories: [
        { id: 1, name: 'Tea', image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', items: 45 },
        { id: 2, name: 'Coffee', image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', items: 32 },
        { id: 3, name: 'Snacks', image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', items: 67 },
        { id: 4, name: 'Combos', image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20', items: 15 },
        { id: 5, name: 'Desserts', image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', items: 28 },
      ],

      // Vendors
      vendors: [
        {
          id: 1,
          name: 'Green Tea House',
          rating: 4.5,
          time: '15-20 min',
          image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47',
          offers: 'Free delivery',
          price: '₹100 for two',
          distance: '0.8 km',
          promoted: true,
          description: 'Pure vegetarian tea house with authentic flavors',
          menu: [
            { id: 1, name: 'Masala Chai', price: 25, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 2, name: 'Filter Coffee', price: 30, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 3, name: 'Samosa', price: 20, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 10, name: 'Black Tea', price: 20, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 11, name: 'Cold Coffee', price: 45, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 12, name: 'Pakora', price: 30, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
          ]
        },
        {
          id: 2,
          name: 'Herbal Garden Cafe',
          rating: 4.8,
          time: '20-25 min',
          image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc',
          offers: '20% off',
          price: '₹150 for two',
          distance: '1.2 km',
          promoted: false,
          description: 'Organic and healthy vegetarian options',
          menu: [
            { id: 4, name: 'Green Tea', price: 35, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 5, name: 'Cold Coffee', price: 45, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 6, name: 'Dhokla', price: 40, image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a', category: 'Snacks' },
            { id: 13, name: 'Herbal Tea', price: 40, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 14, name: 'Cappuccino', price: 55, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 15, name: 'Vada', price: 25, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
          ]
        },
        {
          id: 3,
          name: 'Pure Veg Corner',
          rating: 4.3,
          time: '10-15 min',
          image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a',
          offers: 'Buy 1 Get 1',
          price: '₹80 for two',
          distance: '0.5 km',
          promoted: false,
          description: 'Traditional Gujarati vegetarian cuisine',
          menu: [
            { id: 7, name: 'Dhokla', price: 40, image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a', category: 'Snacks' },
            { id: 8, name: 'Khakra', price: 25, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 9, name: 'Gulab Jamun', price: 50, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
            { id: 16, name: 'Khakra', price: 30, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 17, name: 'Ras Malai', price: 60, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
            { id: 18, name: 'Pani Puri', price: 35, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
          ]
        },
        {
          id: 5,
          name: 'Sweet Dreams Bakery',
          rating: 4.7,
          time: '15-20 min',
          image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e',
          offers: '15% off',
          price: '₹120 for two',
          distance: '1.8 km',
          promoted: false,
          description: 'Freshly baked desserts and pastries',
          menu: [
            { id: 19, name: 'Chocolate Cake', price: 80, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
            { id: 20, name: 'Croissant', price: 45, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
            { id: 21, name: 'Muffin', price: 35, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
          ]
        },
        {
          id: 6,
          name: 'Spicy Bites',
          rating: 4.4,
          time: '12-18 min',
          image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe',
          offers: 'Free delivery',
          price: '₹90 for two',
          distance: '1.1 km',
          promoted: false,
          description: 'Spicy street food favorites',
          menu: [
            { id: 22, name: 'Pani Puri', price: 35, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 23, name: 'Bhelpuri', price: 40, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 24, name: 'Sev Puri', price: 45, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
          ]
        },
      ],

      // Cart (Multi-restaurant structure)
      cart: {
        items: [], // [{ restaurantId: 1, restaurantName: 'Restaurant A', items: [...], specialInstructions: '' }]
        globalCoupon: null,
        deliveryAddress: null
      },

      // Orders
      orders: [
        {
          id: 1,
          vendorName: 'Green Tea House',
          status: 'Delivered',
          total: 70,
          date: '2024-11-07',
          items: [
            { name: 'Masala Chai', quantity: 2, price: 25 },
            { name: 'Samosa', quantity: 1, price: 20 },
          ]
        }
      ]
    };
  }

  // Utility method to simulate API delay
  delay(delay = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Authentication
  async login(phoneNumber) {
    await this.delay();
    const otp = Math.floor(100000 + Math.random() * 900000);
    return { success: true, otp, message: 'OTP sent successfully' };
  }

  async verifyOtp(phoneNumber, otp) {
    await this.delay();
    if (otp === '123456') { // Mock OTP
      return { success: true, user: this.mockData.user, token: 'mock-jwt-token' };
    }
    return { success: false, error: 'Invalid OTP' };
  }

  async register(userData) {
    await this.delay();
    const newUser = {
      ...this.mockData.user,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    };
    return { success: true, user: newUser, token: 'mock-jwt-token' };
  }

  async socialLogin(provider) {
    await this.delay();
    return { success: true, user: this.mockData.user, token: 'mock-jwt-token' };
  }

  // User Profile
  async getUserProfile() {
    await this.delay();
    return { success: true, user: this.mockData.user };
  }

  async updateUserProfile(userData) {
    await this.delay();
    this.mockData.user = { ...this.mockData.user, ...userData };
    return { success: true, user: this.mockData.user };
  }

  // Categories
  async getCategories() {
    await this.delay(500);
    return { success: true, categories: this.mockData.categories };
  }

  // Vendors
  async getVendors(params = {}) {
    await this.delay(800);
    let vendors = [...this.mockData.vendors];

    if (params.category) {
      vendors = vendors.filter(vendor =>
        vendor.menu.some(item => item.category.toLowerCase() === params.category.toLowerCase())
      );
    }

    if (params.searchQuery) {
      vendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
        vendor.menu.some(item => item.name.toLowerCase().includes(params.searchQuery.toLowerCase()))
      );
    }

    return { success: true, vendors };
  }

  async getVendorDetails(vendorId) {
    await this.delay(600);
    const vendor = this.mockData.vendors.find(v => v.id === vendorId);
    if (vendor) {
      return { success: true, vendor };
    }
    return { success: false, error: 'Vendor not found' };
  }

  // Menu
  async getVendorMenu(vendorId) {
    await this.delay(500);
    const vendor = this.mockData.vendors.find(v => v.id === vendorId);
    if (vendor) {
      return { success: true, menu: vendor.menu };
    }
    return { success: false, error: 'Vendor not found' };
  }

  // Cart (Multi-restaurant)
  async getCart() {
    await this.delay(400);
    return { success: true, cart: this.mockData.cart };
  }

  async addToCart(item, restaurantId, restaurantName) {
    await this.delay(300);

    // Find existing restaurant group or create new one
    let restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);

    if (!restaurantGroup) {
      restaurantGroup = {
        restaurantId,
        restaurantName,
        items: [],
        specialInstructions: '',
        coupons: []
      };
      this.mockData.cart.items.push(restaurantGroup);
    }

    // Check if item already exists in this restaurant's group
    const existingItem = restaurantGroup.items.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      restaurantGroup.items.push({ ...item, quantity: item.quantity || 1 });
    }

    return { success: true, cart: this.mockData.cart };
  }

  async updateCartItem(restaurantId, itemId, quantity) {
    await this.delay(300);

    const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
    if (!restaurantGroup) {
      return { success: false, error: 'Restaurant group not found' };
    }

    const item = restaurantGroup.items.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        restaurantGroup.items = restaurantGroup.items.filter(cartItem => cartItem.id !== itemId);
        // Remove restaurant group if no items left
        if (restaurantGroup.items.length === 0) {
          this.mockData.cart.items = this.mockData.cart.items.filter(group => group.restaurantId !== restaurantId);
        }
      }
      return { success: true, cart: this.mockData.cart };
    }
    return { success: false, error: 'Item not found in cart' };
  }

  async removeFromCart(restaurantId, itemId) {
    await this.delay(300);

    const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
    if (!restaurantGroup) {
      return { success: false, error: 'Restaurant group not found' };
    }

    restaurantGroup.items = restaurantGroup.items.filter(item => item.id !== itemId);

    // Remove restaurant group if no items left
    if (restaurantGroup.items.length === 0) {
      this.mockData.cart.items = this.mockData.cart.items.filter(group => group.restaurantId !== restaurantId);
    }

    return { success: true, cart: this.mockData.cart };
  }

  async addSpecialInstructions(restaurantId, instructions) {
    await this.delay(200);

    const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
    if (!restaurantGroup) {
      return { success: false, error: 'Restaurant group not found' };
    }

    restaurantGroup.specialInstructions = instructions;
    return { success: true, cart: this.mockData.cart };
  }

  async addItemSpecialInstructions(restaurantId, itemId, instructions) {
    await this.delay(200);

    const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
    if (!restaurantGroup) {
      return { success: false, error: 'Restaurant group not found' };
    }

    const item = restaurantGroup.items.find(item => item.id === itemId);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    item.specialInstructions = instructions;
    return { success: true, cart: this.mockData.cart };
  }

  async clearRestaurantCart(restaurantId) {
    await this.delay(300);
    this.mockData.cart.items = this.mockData.cart.items.filter(group => group.restaurantId !== restaurantId);
    return { success: true, cart: this.mockData.cart };
  }

  async clearCart() {
    await this.delay(300);
    this.mockData.cart.items = [];
    this.mockData.cart.globalCoupon = null;
    this.mockData.cart.deliveryAddress = null;
    return { success: true };
  }

  async applyCoupon(restaurantId, couponCode) {
    await this.delay(400);

    // Mock coupon validation
    const coupons = {
      'GLOBAL10': { type: 'global', discount: 10, minOrder: 100 },
      'REST20': { type: 'restaurant', discount: 20, minOrder: 200 },
      'EXPIRED': { type: 'expired', discount: 0 }
    };

    const coupon = coupons[couponCode];
    if (!coupon) {
      return { success: false, error: 'Invalid coupon code' };
    }

    if (coupon.type === 'expired') {
      return { success: false, error: 'Coupon has expired' };
    }

    if (restaurantId) {
      // Restaurant-specific coupon
      const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
      if (!restaurantGroup) {
        return { success: false, error: 'Restaurant not found in cart' };
      }
      restaurantGroup.coupons.push({ ...coupon, code: couponCode });
    } else {
      // Global coupon
      this.mockData.cart.globalCoupon = { ...coupon, code: couponCode };
    }

    return { success: true, cart: this.mockData.cart };
  }

  async removeCoupon(restaurantId, couponCode) {
    await this.delay(300);

    if (restaurantId) {
      const restaurantGroup = this.mockData.cart.items.find(group => group.restaurantId === restaurantId);
      if (restaurantGroup) {
        restaurantGroup.coupons = restaurantGroup.coupons.filter(coupon => coupon.code !== couponCode);
      }
    } else {
      if (this.mockData.cart.globalCoupon?.code === couponCode) {
        this.mockData.cart.globalCoupon = null;
      }
    }

    return { success: true, cart: this.mockData.cart };
  }

  async setDeliveryAddress(addressId) {
    await this.delay(300);

    const address = this.mockData.user.addresses.find(addr => addr.id === addressId);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }

    this.mockData.cart.deliveryAddress = address;

    // Recalculate delivery fees for all restaurants (mock logic)
    this.mockData.cart.items.forEach(group => {
      group.deliveryFee = Math.floor(Math.random() * 40) + 20; // Random fee between 20-60
      group.deliveryTime = Math.floor(Math.random() * 20) + 15; // Random time between 15-35 min
    });

    return { success: true, cart: this.mockData.cart };
  }

  // Orders
  async getOrders() {
    await this.delay(600);
    return { success: true, orders: this.mockData.orders };
  }

  async placeOrder(orderData) {
    await this.delay(1500);
    const newOrder = {
      id: Date.now(),
      vendorName: orderData.vendorName,
      status: 'Confirmed',
      total: orderData.total,
      date: new Date().toISOString().split('T')[0],
      items: orderData.items,
      orderId: `ORDER${Date.now()}`,
    };
    this.mockData.orders.unshift(newOrder);
    // Clear cart after successful order
    this.mockData.cart = {
      items: [],
      globalCoupon: null,
      deliveryAddress: null
    };
    return { success: true, order: newOrder };
  }

  async getOrderDetails(orderId) {
    await this.delay(500);
    const order = this.mockData.orders.find(o => o.id === orderId);
    if (order) {
      return { success: true, order };
    }
    return { success: false, error: 'Order not found' };
  }

  // Payments
  async processPayment(paymentData) {
    await this.delay(2000);
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        message: 'Payment processed successfully'
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again.'
      };
    }
  }

  // Addresses
  async getAddresses() {
    await this.delay(400);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  async addAddress(address) {
    await this.delay(500);
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: this.mockData.user.addresses.length === 0,
    };
    this.mockData.user.addresses.push(newAddress);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  async updateAddress(addressId, addressData) {
    await this.delay(500);
    const index = this.mockData.user.addresses.findIndex(addr => addr.id === addressId);
    if (index !== -1) {
      this.mockData.user.addresses[index] = { ...this.mockData.user.addresses[index], ...addressData };
      return { success: true, addresses: this.mockData.user.addresses };
    }
    return { success: false, error: 'Address not found' };
  }

  async deleteAddress(addressId) {
    await this.delay(400);
    this.mockData.user.addresses = this.mockData.user.addresses.filter(addr => addr.id !== addressId);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  // Notifications
  async getNotifications() {
    await this.delay(400);
    return {
      success: true,
      notifications: [
        { id: 1, title: 'Order Delivered!', message: 'Your order from Green Tea House has been delivered.', time: '2 min ago', read: false },
        { id: 2, title: 'New Offer', message: 'Get 30% off on your next order.', time: '1 hour ago', read: false },
        { id: 3, title: 'Welcome to Nashtto', message: 'Thank you for joining us! Enjoy your first order.', time: '1 day ago', read: true },
      ]
    };
  }

  // Wallet
  async getWallet() {
    await this.delay(400);
    return {
      success: true,
      wallet: {
        balance: 250,
        transactions: [
          { id: 1, type: 'credit', amount: 100, description: 'Refund for order #12345', date: '2024-11-05' },
          { id: 2, type: 'debit', amount: 50, description: 'Used for order #12346', date: '2024-11-04' },
          { id: 3, type: 'credit', amount: 200, description: 'Welcome bonus', date: '2024-11-01' },
        ]
      }
    };
  }

  async markNotificationAsRead(notificationId) {
    await this.delay(300);
    return { success: true };
  }

  // Support
  async submitSupportTicket(ticketData) {
    await this.delay(800);
    return {
      success: true,
      ticketId: `TICKET${Date.now()}`,
      message: 'Your support ticket has been submitted. We will respond within 24 hours.'
    };
  }

  // Reviews
  async submitReview(reviewData) {
    await this.delay(600);
    return {
      success: true,
      review: {
        id: Date.now(),
        ...reviewData,
        date: new Date().toISOString().split('T')[0],
      }
    };
  }

  async getVendorReviews(vendorId) {
    await this.delay(500);
    return {
      success: true,
      reviews: [
        { id: 1, userName: 'Rahul S.', rating: 5, comment: 'Amazing food and service!', date: '2024-11-05' },
        { id: 2, userName: 'Priya M.', rating: 4, comment: 'Good quality vegetarian food.', date: '2024-11-03' },
        { id: 3, userName: 'Amit K.', rating: 5, comment: 'Best tea in town!', date: '2024-11-01' },
      ]
    };
  }

  // Search
  async search(params) {
    await this.delay(700);
    const { query, category, location } = params;
    let results = [];

    // Search in vendors
    let vendorResults = this.mockData.vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      vendor.menu.some(item => item.name.toLowerCase().includes(query?.toLowerCase() || ''))
    );

    // Search in menu items
    let menuResults = [];
    this.mockData.vendors.forEach(vendor => {
      vendor.menu.forEach(item => {
        if (item.name.toLowerCase().includes(query?.toLowerCase() || '')) {
          menuResults.push({ ...item, vendorName: vendor.name, vendorId: vendor.id });
        }
      });
    });

    // Apply category filter if present
    if (category && category !== 'all') {
      const categoryLower = category.toLowerCase();

      // Filter vendors: keep if they have items in this category
      vendorResults = vendorResults.filter(vendor =>
        vendor.menu.some(item => item.category.toLowerCase() === categoryLower)
      );

      // Filter menu items: keep if they match the category
      menuResults = menuResults.filter(item =>
        item.category.toLowerCase() === categoryLower
      );
    }

    return {
      success: true,
      results: {
        vendors: vendorResults,
        items: menuResults,
        total: vendorResults.length + menuResults.length
      }
    };
  }
}

// Export a singleton instance
export default new ApiService();