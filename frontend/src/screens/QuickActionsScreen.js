import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const QuickActionsScreen = ({ navigation, route }) => {
  const { actionType } = route.params;
  const [formData, setFormData] = useState({});

  const actionConfigs = {
    symptoms: {
      title: 'Check Symptoms',
      color: ['#3B82F6', '#06B6D4'],
      emoji: '🔍',
      fields: [
        { key: 'symptoms', label: 'Symptoms', type: 'textarea', required: true, placeholder: 'e.g., headache, fever, cough, fatigue...' },
        { key: 'duration', label: 'Duration', type: 'picker', required: true, options: ['Less than a day', '1-3 days', '4-7 days', '1-2 weeks', 'More than 2 weeks'] },
        { key: 'severity', label: 'Severity', type: 'buttons', required: true, options: ['Mild', 'Moderate', 'Severe'] },
      ]
    },
    heart: {
      title: 'Heart Health',
      color: ['#EF4444', '#EC4899'],
      emoji: '❤️',
      fields: [
        { key: 'concerns', label: 'Heart Concerns', type: 'textarea', required: true, placeholder: 'Describe any heart-related symptoms...' },
        { key: 'age', label: 'Age', type: 'number', required: true },
        { key: 'bloodPressure', label: 'Blood Pressure', type: 'text', placeholder: 'e.g., 120/80' },
        { key: 'riskFactors', label: 'Risk Factors', type: 'checkboxes', options: ['Smoking', 'High cholesterol', 'Diabetes', 'Family history', 'Sedentary lifestyle'] },
      ]
    },
    preventive: {
      title: 'Preventive Care',
      color: ['#10B981', '#059669'],
      emoji: '🛡️',
      fields: [
        { key: 'careType', label: 'Care Type', type: 'picker', required: true, options: ['Vaccinations & Immunizations', 'Health Screenings', 'Nutrition & Diet', 'Exercise & Fitness', 'Mental Health', 'Sleep Hygiene', 'Stress Management'] },
        { key: 'ageGroup', label: 'Age Group', type: 'picker', required: true, options: ['Child', 'Teen', 'Adult', 'Senior'] },
        { key: 'healthGoals', label: 'Health Goals', type: 'textarea', placeholder: 'Describe your specific health goals...' },
      ]
    },
    medication: {
      title: 'Medication Reminder',
      color: ['#8B5CF6', '#7C3AED'],
      emoji: '💊',
      fields: [
        { key: 'medicationName', label: 'Medication Name', type: 'text', required: true },
        { key: 'dosage', label: 'Dosage', type: 'text', required: true, placeholder: 'e.g., 500mg' },
        { key: 'frequency', label: 'Frequency', type: 'picker', required: true, options: ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Weekly'] },
        { key: 'reminderTimes', label: 'Reminder Times', type: 'checkboxes', options: ['Morning', 'Afternoon', 'Evening', 'Night'] },
        { key: 'instructions', label: 'Special Instructions', type: 'textarea', placeholder: 'Any special instructions...' },
      ]
    }
  };

  const config = actionConfigs[actionType];

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = config.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', `Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Format message for AI
    let message = `${config.title} Request:\n\n`;
    config.fields.forEach(field => {
      if (formData[field.key]) {
        message += `${field.label}: ${Array.isArray(formData[field.key]) ? formData[field.key].join(', ') : formData[field.key]}\n`;
      }
    });

    // Navigate to results or chat
    navigation.navigate('Results', { result: { message: `Processing your ${config.title.toLowerCase()} request...\n\n${message}` } });
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextInput
            style={styles.textInput}
            placeholder={field.placeholder}
            placeholderTextColor="#9CA3AF"
            value={formData[field.key] || ''}
            onChangeText={(text) => setFormData({...formData, [field.key]: text})}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          />
        );
      
      case 'textarea':
        return (
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={field.placeholder}
            placeholderTextColor="#9CA3AF"
            value={formData[field.key] || ''}
            onChangeText={(text) => setFormData({...formData, [field.key]: text})}
            multiline
            numberOfLines={4}
          />
        );
      
      case 'picker':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData[field.key]}
              onValueChange={(value) => setFormData({...formData, [field.key]: value})}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${field.label}`} value="" />
              {field.options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );
      
      case 'buttons':
        return (
          <View style={styles.buttonGroup}>
            {field.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  formData[field.key] === option && styles.selectedButton
                ]}
                onPress={() => setFormData({...formData, [field.key]: option})}
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
        );
      
      case 'checkboxes':
        return (
          <View style={styles.checkboxGroup}>
            {field.options.map((option, index) => {
              const isSelected = formData[field.key]?.includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxItem}
                  onPress={() => {
                    const current = formData[field.key] || [];
                    const updated = isSelected 
                      ? current.filter(item => item !== option)
                      : [...current, option];
                    setFormData({...formData, [field.key]: updated});
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={config.color} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.emoji} {config.title}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {actionType === 'symptoms' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>⚠️ Emergency Warning</Text>
            <Text style={styles.infoText}>
              If you're experiencing severe symptoms like chest pain, difficulty breathing, 
              or loss of consciousness, call emergency services immediately (116).
            </Text>
          </View>
        )}

        {actionType === 'heart' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🚨 Chest Pain Warning</Text>
            <Text style={styles.infoText}>
              If you're experiencing chest pain, call 114 for medical emergency immediately.
            </Text>
          </View>
        )}

        {config.fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            {renderField(field)}
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient colors={config.color} style={styles.submitGradient}>
            <Text style={styles.submitText}>Submit {config.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 40,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuickActionsScreen;