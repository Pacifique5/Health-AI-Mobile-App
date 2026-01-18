import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EmergencyScreen = ({ visible, onClose }) => {
  const emergencyContacts = [
    { name: 'Isange One Stop Center', number: '3029', desc: 'GBV Support', color: '#EF4444' },
    { name: 'Emergency Call', number: '116', desc: 'Life-threatening', color: '#DC2626' },
    { name: 'Medical Emergency', number: '114', desc: 'Health advice', color: '#F59E0B' },
    { name: 'Gender Based Violence', number: '3029', desc: 'Violence support', color: '#EF4444' },
    { name: 'Child/Drug Abuse', number: '116', desc: 'Mental health', color: '#8B5CF6' },
    { name: 'Human Trafficking', number: '166', desc: 'Trafficking support', color: '#6B7280' },
  ];

  const emergencySymptoms = [
    'Difficulty breathing',
    'Chest pain',
    'Severe bleeding',
    'Loss of consciousness',
    'Stroke signs',
    'Severe allergic reactions',
  ];

  const handleCall = (number) => {
    Alert.alert(
      'Emergency Call',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
        <Text style={styles.headerTitle}>🚨 Emergency Contacts</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ When to Call Emergency Services</Text>
          {emergencySymptoms.map((symptom, index) => (
            <Text key={index} style={styles.symptomText}>• {symptom}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.contactCard, { borderLeftColor: contact.color }]}
            onPress={() => handleCall(contact.number)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDesc}>{contact.desc}</Text>
            </View>
            <View style={[styles.numberBadge, { backgroundColor: contact.color }]}>
              <Text style={styles.numberText}>{contact.number}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            🏥 For immediate life-threatening emergencies, call 116 immediately.
            These contacts are provided for your safety and well-being.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  numberBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default EmergencyScreen;