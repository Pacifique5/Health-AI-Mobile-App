import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';

const QuickActionModal = ({ visible, onClose, actionType, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const getModalConfig = () => {
    switch (actionType?.type) {
      case 'symptoms':
        return {
          title: 'Check Symptoms',
          icon: '🔍',
          color: ['#3B82F6', '#06B6D4'],
          buttonText: 'Analyze Symptoms',
          fields: [
            { key: 'symptoms', label: 'Describe your symptoms', type: 'textarea', required: true },
            { key: 'duration', label: 'How long have you had these symptoms?', type: 'picker', options: ['Less than 1 day', '1-3 days', '4-7 days', 'More than 1 week'] },
            { key: 'severity', label: 'Severity level', type: 'buttons', options: ['Mild', 'Moderate', 'Severe'] },
          ],
          infoBox: {
            type: 'info',
            text: 'Please provide as much detail as possible about your symptoms for accurate analysis.'
          }
        };
      case 'heart':
        return {
          title: 'Heart Health Check',
          icon: '❤️',
          color: ['#EF4444', '#EC4899'],
          buttonText: 'Get Heart Health',
          fields: [
            { key: 'concerns', label: 'Heart health concerns', type: 'textarea', required: true },
            { key: 'age', label: 'Age', type: 'input' },
            { key: 'bloodPressure', label: 'Blood pressure (if known)', type: 'input' },
            { key: 'riskFactors', label: 'Risk factors', type: 'checkboxes', options: ['Family history', 'Smoking', 'High cholesterol', 'Diabetes', 'Obesity'] },
          ],
          infoBox: {
            type: 'warning',
            text: 'If experiencing chest pain, shortness of breath, or other serious symptoms, seek immediate medical attention.'
          }
        };
      case 'preventive':
        return {
          title: 'Preventive Care',
          icon: '🛡️',
          color: ['#10B981', '#059669'],
          buttonText: 'Recommendation',
          fields: [
            { key: 'careType', label: 'Type of preventive care', type: 'picker', required: true, options: ['General wellness', 'Vaccination', 'Screening', 'Lifestyle advice'] },
            { key: 'ageGroup', label: 'Age group', type: 'picker', options: ['18-30', '31-50', '51-65', '65+'] },
            { key: 'healthGoals', label: 'Health goals', type: 'textarea' },
          ],
          infoBox: {
            type: 'success',
            text: 'Preventive care is key to maintaining good health and catching issues early.'
          }
        };
      case 'medication':
        return {
          title: 'Medication Reminder',
          icon: '⏰',
          color: ['#8B5CF6', '#7C3AED'],
          buttonText: 'Set Reminder',
          fields: [
            { key: 'medicationName', label: 'Medication name', type: 'input', required: true },
            { key: 'dosage', label: 'Dosage', type: 'input', required: true },
            { key: 'frequency', label: 'How often?', type: 'picker', required: true, options: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed'] },
            { key: 'reminderTimes', label: 'Reminder times', type: 'checkboxes', options: ['Morning', 'Afternoon', 'Evening', 'Before bed'] },
            { key: 'instructions', label: 'Special instructions', type: 'textarea' },
          ],
          infoBox: {
            type: 'info',
            text: 'Set up reminders to help you take your medications on time and as prescribed.'
          }
        };
      default:
        return null;
    }
  };

  const config = getModalConfig();
  if (!config) return null;

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = config.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Reset form and close
    setFormData({});
    onClose();
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'input':
        return (
          <TextInput
            key={field.key}
            style={styles.input}
            placeholder={field.label}
            value={formData[field.key] || ''}
            onChangeText={(text) => setFormData(prev => ({ ...prev, [field.key]: text }))}
          />
        );
      
      case 'textarea':
        return (
          <TextInput
            key={field.key}
            style={[styles.input, styles.textarea]}
            placeholder={field.label}
            value={formData[field.key] || ''}
            onChangeText={(text) => setFormData(prev => ({ ...prev, [field.key]: text }))}
            multiline
            numberOfLines={4}
          />
        );
      
      case 'picker':
        return (
          <View key={field.key} style={styles.pickerContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Picker
              selectedValue={formData[field.key] || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${field.label.toLowerCase()}`} value="" />
              {field.options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );
      
      case 'buttons':
        return (
          <View key={field.key} style={styles.buttonGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.buttonRow}>
              {field.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    formData[field.key] === option && styles.selectedButton
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, [field.key]: option }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData[field.key] === option && styles.selectedButtonText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 'checkboxes':
        return (
          <View key={field.key} style={styles.checkboxGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            {field.options.map((option, index) => {
              const isSelected = (formData[field.key] || []).includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxItem}
                  onPress={() => {
                    const current = formData[field.key] || [];
                    const updated = isSelected
                      ? current.filter(item => item !== option)
                      : [...current, option];
                    setFormData(prev => ({ ...prev, [field.key]: updated }));
                  }}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      
      default:
        return null;
    }
  };

  const getInfoBoxStyle = () => {
    switch (config.infoBox.type) {
      case 'warning':
        return { backgroundColor: '#FEF2F2', borderColor: '#EF4444' };
      case 'success':
        return { backgroundColor: '#F0FDF4', borderColor: '#10B981' };
      case 'info':
      default:
        return { backgroundColor: '#EBF8FF', borderColor: '#3B82F6' };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient colors={config.color} style={styles.header}>
            <Text style={styles.headerIcon}>{config.icon}</Text>
            <Text style={styles.headerTitle}>{config.title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.content}>
            {config.fields.map(renderField)}
            
            <View style={[styles.infoBox, getInfoBoxStyle()]}>
              <Text style={styles.infoBoxText}>{config.infoBox.text}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <LinearGradient colors={config.color} style={styles.submitGradient}>
                <Text style={styles.submitButtonText}>{config.buttonText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 30,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
    minHeight: 56,
  },
  textarea: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  pickerContainer: {
    marginBottom: 24,
  },
  picker: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 56,
  },
  buttonGroup: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    minHeight: 56,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  checkboxGroup: {
    marginBottom: 24,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  infoBox: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  infoBoxText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 5,
    paddingBottom: 5,
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 200,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    minHeight: 5,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    borderRadius: 200,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 60,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  submitButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default QuickActionModal;