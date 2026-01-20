import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const EmergencyContactsScreen = ({ navigation }) => {
  const emergencyContacts = [
    { 
      name: 'Emergency Services', 
      phone: '911', 
      description: 'Life-threatening emergencies', 
      urgent: true,
      icon: '🚨'
    },
    { 
      name: 'Rwanda Emergency', 
      phone: '912', 
      description: 'National emergency line', 
      urgent: true,
      icon: '🇷🇼'
    },
    { 
      name: 'Poison Control', 
      phone: '1-800-222-1222', 
      description: 'Poisoning emergencies', 
      urgent: false,
      icon: '☠️'
    },
    { 
      name: 'Mental Health Crisis', 
      phone: '988', 
      description: '24/7 crisis support', 
      urgent: false,
      icon: '🧠'
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.background}>
          {/* Header */}
          <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
            <Text style={styles.headerIcon}>🚨</Text>
            <Text style={styles.headerTitle}>Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyInfoTitle}>⚠️ When to Call Emergency Services</Text>
              <Text style={styles.emergencyInfoText}>
                Call immediately if you experience: chest pain, difficulty breathing, severe bleeding, 
                loss of consciousness, severe allergic reactions, or any life-threatening emergency.
              </Text>
            </View>
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity key={index} style={styles.emergencyContact}>
                <View style={styles.emergencyContactInfo}>
                  <Text style={styles.emergencyContactName}>{contact.name}</Text>
                  {contact.urgent && (
                    <Text style={styles.urgentBadge}>URGENT</Text>
                  )}
                  <Text style={styles.emergencyContactDesc}>{contact.description}</Text>
                </View>
                <View style={styles.emergencyContactPhoneBadge}>
                  <Text style={styles.emergencyContactPhoneText}>{contact.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.additionalResources}>
              <Text style={styles.resourcesTitle}>Additional Resources</Text>
              <TouchableOpacity style={styles.resourceButton}>
                <Text style={styles.resourceButtonText}>🏥 Find Nearest Hospital</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resourceButton}>
                <Text style={styles.resourceButtonText}>🚑 Urgent Care Locator</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.rwandaNote}>
              <Text style={styles.rwandaNoteText}>
                🏥 For immediate life-threatening emergencies, call 116 immediately.
                Emergency services in Rwanda: Police (112), Fire (113), Medical (114)
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 12,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emergencyInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 6,
    borderLeftColor: '#F59E0B',
  },
  emergencyInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  emergencyInfoText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  emergencyContact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 100,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  emergencyContactDesc: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  emergencyContactPhoneBadge: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyContactPhoneText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  additionalResources: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  resourcesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  resourceButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 28,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minHeight: 64,
    justifyContent: 'center',
  },
  resourceButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  rwandaNote: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 60,
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
  },
  rwandaNoteText: {
    fontSize: 16,
    color: '#1E40AF',
    lineHeight: 24,
  },
});

export default EmergencyContactsScreen;