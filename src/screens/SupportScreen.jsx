import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
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

const SupportScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const issueCategories = [
    { id: 'order', name: 'Order Issues', icon: 'cube-outline' },
    { id: 'payment', name: 'Payment Problems', icon: 'card-outline' },
    { id: 'delivery', name: 'Delivery Issues', icon: 'bicycle-outline' },
    { id: 'account', name: 'Account Help', icon: 'person-outline' },
    { id: 'app', name: 'App Feedback', icon: 'phone-portrait-outline' },
    { id: 'other', name: 'Other', icon: 'help-circle-outline' },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time from the Orders section. Click on any active order to see its current status and estimated delivery time.'
    },
    {
      question: 'What are your delivery hours?',
      answer: 'We deliver from 8:00 AM to 10:00 PM daily. Peak hours are between 12:00 PM - 2:00 PM and 7:00 PM - 9:00 PM.'
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel your order within 2 minutes of placing it. Go to Orders > Active Orders > Cancel Order.'
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer full refunds for cancelled orders and partial refunds for unsatisfactory deliveries. Refunds are processed within 3-5 business days.'
    },
  ];

  const handleSubmitTicket = async () => {
    if (!selectedCategory || !subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.submitSupportTicket({
        category: selectedCategory,
        subject: subject.trim(),
        message: message.trim(),
      });

      if (response.success) {
        Alert.alert(
          'Ticket Submitted',
          `Your support ticket has been submitted successfully. Ticket ID: ${response.ticketId}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedCategory('');
                setSubject('');
                setMessage('');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit support ticket. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support ticket. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={28}
        color={selectedCategory === category.id ? '#22c55e' : '#64748b'}
      />
      <Text style={[
        styles.categoryName,
        selectedCategory === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFAQ = (faq, index) => (
    <Card key={index} style={styles.faqCard}>
      <CardContent>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      </CardContent>
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
        <Text style={styles.headerTitle}>Support Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Contact */}
        <View style={styles.quickContact}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call-outline" size={24} color="#22c55e" />
              </View>
              <Text style={styles.contactText}>Call: 1800-XXX-XXXX</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="chatbubble-outline" size={24} color="#22c55e" />
              </View>
              <Text style={styles.contactText}>Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="mail-outline" size={24} color="#22c55e" />
              </View>
              <Text style={styles.contactText}>Email Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Submit a Ticket</Text>

          <View style={styles.categoriesGrid}>
            {supportCategories.map(renderCategory)}
          </View>

          <TextInput
            style={styles.subjectInput}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#64748b"
          />

          <TextInput
            style={[styles.messageInput, { height: 120 }]}
            placeholder="Describe your issue in detail..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#64748b"
          />

          <Button
            title="Submit Ticket"
            onPress={handleSubmitTicket}
            loading={loading}
            style={styles.submitButton}
          />
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map(renderFAQ)}
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
  quickContact: {
    marginTop: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactOption: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: 80,
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  formSection: {
    marginTop: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
    minWidth: '45%',
  },
  selectedCategory: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#16a34a',
  },
  subjectInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#22c55e',
  },
  faqSection: {
    marginTop: 24,
  },
  faqCard: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});

export default SupportScreen;