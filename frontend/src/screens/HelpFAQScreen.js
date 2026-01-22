import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../context/ThemeContext';

const HelpFAQScreen = ({ navigation }) => {
  const { theme, colors } = useContext(ThemeContext);
  const [expandedItems, setExpandedItems] = useState({});

  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, tap "Sign Up" on the login screen, enter your username, email, and password. Make sure your password is at least 8 characters long.'
        },
        {
          question: 'How do I analyze my symptoms?',
          answer: 'You can analyze symptoms in two ways:\n1. Use the main chat interface and describe at least 3 symptoms\n2. Use the "Check symptoms" quick action for a guided form\n\nFor best results, be specific about your symptoms and include duration and severity.'
        },
        {
          question: 'What information should I provide for symptom analysis?',
          answer: 'Provide at least 3 symptoms separated by commas. Include details like:\n• Duration (how long you\'ve had symptoms)\n• Severity (mild, moderate, severe)\n• Any triggers or patterns\n• Associated symptoms\n\nExample: "fever, cough, headache, body aches"'
        }
      ]
    },
    {
      id: 2,
      category: 'Using the App',
      items: [
        {
          question: 'How do I start a new conversation?',
          answer: 'Tap the menu button (☰) in the top left, then tap "+ New Conversation". This will clear your current chat and start fresh.'
        },
        {
          question: 'Can I view my previous conversations?',
          answer: 'Yes! Tap the menu button (☰) to open the sidebar. All your previous conversations are listed there. Tap any conversation to view its history.'
        },
        {
          question: 'How do I delete a conversation?',
          answer: 'In the sidebar, tap the trash icon (🗑️) next to any conversation you want to delete. Confirm the deletion when prompted.'
        },
        {
          question: 'How do I change my profile picture?',
          answer: 'Go to Settings → Profile section → Tap the camera icon on your profile picture → Select a new image from your gallery. The image will be uploaded and displayed immediately.'
        }
      ]
    },
    {
      id: 3,
      category: 'Account & Settings',
      items: [
        {
          question: 'How do I change my password?',
          answer: 'Go to Settings → Account Settings → Password → Enter your current password and new password → Tap "Update Password".'
        },
        {
          question: 'How do I update my email address?',
          answer: 'Go to Settings → Account Settings → Email → Enter your new email and current password for verification → Tap "Update Email".'
        },
        {
          question: 'How do I enable/disable dark mode?',
          answer: 'Go to Settings → App Settings → Dark Mode → Toggle the switch. The app will immediately switch between light and dark themes.'
        },
        {
          question: 'How do I manage notifications?',
          answer: 'Go to Settings → App Settings → Notifications → Toggle notification types on/off. You can control health reminders, conversation updates, and system notifications.'
        }
      ]
    },
    {
      id: 4,
      category: 'Health & Safety',
      items: [
        {
          question: 'Is this app a replacement for medical advice?',
          answer: 'No, SymptomAI is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.'
        },
        {
          question: 'When should I seek immediate medical attention?',
          answer: 'Seek immediate medical attention for:\n• Chest pain or difficulty breathing\n• Severe allergic reactions\n• Signs of stroke (sudden weakness, speech problems)\n• Severe injuries or bleeding\n• High fever with severe symptoms\n• Any life-threatening emergency'
        },
        {
          question: 'How accurate are the symptom analyses?',
          answer: 'Our AI provides educated suggestions based on symptom patterns, but accuracy varies. The analysis is meant to guide you toward appropriate care, not provide definitive diagnoses. Always verify with healthcare professionals.'
        },
        {
          question: 'Is my health information secure?',
          answer: 'Yes, we take privacy seriously. Your conversations and health data are encrypted and stored securely. We do not share personal health information with third parties without your consent.'
        }
      ]
    },
    {
      id: 5,
      category: 'Troubleshooting',
      items: [
        {
          question: 'The app is not responding or crashing',
          answer: 'Try these steps:\n1. Close and restart the app\n2. Restart your device\n3. Check for app updates\n4. Clear app cache (Android)\n5. Reinstall the app if issues persist'
        },
        {
          question: 'I\'m getting network errors',
          answer: 'Check your internet connection and try again. If the problem persists:\n1. Switch between WiFi and mobile data\n2. Restart your network connection\n3. Check if the service is temporarily down'
        },
        {
          question: 'I forgot my password',
          answer: 'Currently, password reset is not available in the app. Please contact support with your registered email address for assistance with password recovery.'
        },
        {
          question: 'My conversations are not saving',
          answer: 'Ensure you have a stable internet connection. Conversations are saved automatically when messages are sent. If issues persist, try logging out and back in.'
        }
      ]
    }
  ];

  const contactInfo = [
    {
      title: 'Email Support',
      value: 'support@symptomai.com',
      icon: '✉️',
      action: () => Linking.openURL('mailto:support@symptomai.com')
    },
    {
      title: 'Emergency Contacts',
      value: 'Access 24/7 emergency numbers',
      icon: '🚨',
      action: () => navigation.navigate('EmergencyContacts')
    },
    {
      title: 'App Version',
      value: 'SymptomAI v1.0.0',
      icon: 'ℹ️',
      action: null
    }
  ];

  const toggleExpanded = (categoryId, itemIndex) => {
    const key = `${categoryId}-${itemIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderFAQItem = (item, itemIndex, categoryId) => {
    const key = `${categoryId}-${itemIndex}`;
    const isExpanded = expandedItems[key];

    return (
      <View key={itemIndex} style={[styles.faqItem, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => toggleExpanded(categoryId, itemIndex)}
        >
          <Text style={[styles.questionText, { color: colors.text }]}>
            {item.question}
          </Text>
          <Text style={[styles.expandIcon, { color: colors.primary }]}>
            {isExpanded ? '−' : '+'}
          </Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={[styles.answerText, { color: colors.textSecondary }]}>
              {item.answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderCategory = (category) => (
    <View key={category.id} style={styles.categoryContainer}>
      <Text style={[styles.categoryTitle, { color: colors.text }]}>
        {category.category}
      </Text>
      {category.items.map((item, index) => renderFAQItem(item, index, category.id))}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    backText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    headerRight: {
      width: 40,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    categoryContainer: {
      marginBottom: 24,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    faqItem: {
      borderRadius: 12,
      marginBottom: 8,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    questionText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 20,
    },
    expandIcon: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 12,
    },
    faqAnswer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    answerText: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 8,
    },
    contactContainer: {
      marginBottom: 24,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    contactIcon: {
      fontSize: 20,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    contactContent: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 14,
    },
    contactArrow: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient 
          colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#F8FAFC', '#E0F2FE']} 
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & FAQ</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* FAQ Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {faqData.map(renderCategory)}
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Need More Help?</Text>
              <View style={styles.contactContainer}>
                {contactInfo.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.contactItem, { backgroundColor: colors.card }]}
                    onPress={contact.action}
                    disabled={!contact.action}
                  >
                    <Text style={styles.contactIcon}>{contact.icon}</Text>
                    <View style={styles.contactContent}>
                      <Text style={[styles.contactTitle, { color: colors.text }]}>
                        {contact.title}
                      </Text>
                      <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                        {contact.value}
                      </Text>
                    </View>
                    {contact.action && (
                      <Text style={[styles.contactArrow, { color: colors.textSecondary }]}>›</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HelpFAQScreen;