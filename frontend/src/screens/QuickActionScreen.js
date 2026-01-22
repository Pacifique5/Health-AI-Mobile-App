import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { analyzeSymptoms, createConversation, addMessage } from '../config/api';

const QuickActionScreen = ({ route, navigation }) => {
  const { actionType } = route.params;
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const getScreenConfig = () => {
    switch (actionType?.type) {
      case 'symptoms':
        return {
          title: 'Check Symptoms',
          icon: '🔍',
          color: ['#3B82F6', '#06B6D4'],
          buttonText: 'Symptoms',
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
          buttonText: 'Heart Health',
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

  const config = getScreenConfig();
  if (!config) {
    navigation.goBack();
    return null;
  }

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = config.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      if (actionType?.type === 'symptoms') {
        // Handle symptom analysis
        const symptoms = formData.symptoms;
        const additionalInfo = [];
        
        if (formData.duration) additionalInfo.push(`Duration: ${formData.duration}`);
        if (formData.severity) additionalInfo.push(`Severity: ${formData.severity}`);
        
        const fullSymptomDescription = additionalInfo.length > 0 
          ? `${symptoms}. ${additionalInfo.join(', ')}`
          : symptoms;

        // Create conversation
        const title = symptoms.length > 30 ? symptoms.substring(0, 30) + '...' : symptoms;
        const conversation = await createConversation(title);
        
        // Add user message
        await addMessage(conversation.id, fullSymptomDescription, 'user');
        
        // Get AI analysis
        const response = await analyzeSymptoms(fullSymptomDescription);
        
        // Add AI response
        await addMessage(conversation.id, response.message, 'ai');
        
        // Navigate to results
        navigation.navigate('Results', { 
          result: response,
          conversationId: conversation.id,
          symptoms: fullSymptomDescription
        });
      } else {
        // Handle other action types (for now, just show success)
        Alert.alert('Success', `${config.title} completed successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'input':
        return (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.label}
              value={formData[field.key] || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.key]: text }))}
            />
          </View>
        );
      
      case 'textarea':
        return (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder={field.label}
              value={formData[field.key] || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.key]: text }))}
              multiline
              numberOfLines={4}
            />
          </View>
        );
      
      case 'picker':
        return (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.pickerContainer}>
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.background}>
          {/* Header */}
          <LinearGradient colors={config.color} style={styles.header}>
            <Text style={styles.headerIcon}>{config.icon}</Text>
            <Text style={styles.headerTitle}>{config.title}</Text>
          </LinearGradient>
          
          {/* Content */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {config.fields.map(renderField)}
              
              <View style={[styles.infoBox, getInfoBoxStyle()]}>
                <Text style={styles.infoBoxText}>{config.infoBox.text}</Text>
              </View>
            </ScrollView>
            
            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient colors={config.color} style={styles.submitGradient}>
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Processing...' : config.buttonText}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
    paddingHorizontal: 50,
    paddingVertical: 10,
    paddingTop: 20,
    paddingBottom:20,
    borderRadius: 10,
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
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    fontSize: 14,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  infoBoxText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 2,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default QuickActionScreen;