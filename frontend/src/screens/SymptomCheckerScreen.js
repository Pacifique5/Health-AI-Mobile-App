import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeSymptoms } from '../config/api';
import Input from '../components/Input';
import GradientButton from '../components/GradientButton';

const SymptomCheckerScreen = ({ navigation }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter your symptoms');
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeSymptoms(symptoms);
      navigation.navigate('Results', { result: response });
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
            Enter your symptoms separated by commas
          </Text>

          <View style={styles.form}>
            <Input
              label="Symptoms"
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="e.g., fever, cough, headache"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>Examples:</Text>
              <Text style={styles.exampleText}>• fever, cough, headache</Text>
              <Text style={styles.exampleText}>• stomach pain, nausea</Text>
              <Text style={styles.exampleText}>• chest pain, shortness of breath</Text>
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
