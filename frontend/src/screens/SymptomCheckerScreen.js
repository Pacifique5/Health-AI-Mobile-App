import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeSymptoms, createConversation, addMessage } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';

const SymptomCheckerScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter your symptoms');
      return;
    }

    // Validate minimum 3 symptoms (unless it's a greeting)
    const isGreeting = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'].some(
      greeting => symptoms.toLowerCase().trim().includes(greeting)
    );
    
    if (!isGreeting) {
      const symptomList = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (symptomList.length < 3) {
        Alert.alert(
          'Minimum Symptoms Required', 
          'Please enter at least 3 symptoms separated by commas for accurate analysis.\n\nExample: fever, cough, headache'
        );
        return;
      }
    }

    setLoading(true);
    try {
      // Create a new conversation for this symptom check
      const title = symptoms.length > 30 ? symptoms.substring(0, 30) + '...' : symptoms;
      const conversation = await createConversation(title);
      
      // Add user message
      await addMessage(conversation.id, symptoms, 'user');
      
      // Get AI analysis
      const response = await analyzeSymptoms(symptoms);
      
      // Add AI response
      await addMessage(conversation.id, response.message, 'ai');
      
      // Navigate to results screen with the analysis
      navigation.navigate('Results', { 
        result: response,
        conversationId: conversation.id,
        symptoms: symptoms
      });
    } catch (error) {
      Alert.alert('Analysis Failed', error.error || 'Unable to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Symptom Checker</Text>
          <Text style={styles.subtitle}>
            Enter at least 3 symptoms separated by commas for accurate analysis
          </Text>

          <View style={styles.form}>
            <Input
              label="Symptoms (minimum 3 required)"
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="e.g., fever, cough, headache, body aches"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>Examples (minimum 3 symptoms):</Text>
              <Text style={styles.exampleText}>• fever, cough, headache, body aches</Text>
              <Text style={styles.exampleText}>• stomach pain, nausea, vomiting, diarrhea</Text>
              <Text style={styles.exampleText}>• chest pain, shortness of breath, dizziness</Text>
            </View>

            <GradientButton 
              title="Analyze Symptoms" 
              onPress={handleAnalyze} 
              loading={loading} 
            />
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️ This is for informational purposes only and not medical advice. 
              Please consult a healthcare professional for proper diagnosis.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  exampleContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  exampleTitle: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 4,
  },
  disclaimer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerText: {
    color: '#FCD34D',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default SymptomCheckerScreen;