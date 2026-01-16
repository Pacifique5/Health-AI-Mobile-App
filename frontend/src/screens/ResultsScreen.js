import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResultsScreen = ({ navigation, route }) => {
  const { result } = route.params;
  const message = result?.message || '';

  const parseResult = (text) => {
    const sections = {
      disease: '',
      description: '',
      medications: '',
      procedures: '',
      precautions: '',
      specialist: '',
    };

    const lines = text.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.includes('Possible Disease:')) {
        sections.disease = line.replace('✅ Possible Disease:', '').trim();
        currentSection = 'disease';
      } else if (line.includes('Description:')) {
        currentSection = 'description';
        sections.description = line.replace('📄 Description:', '').trim();
      } else if (line.includes('Medications:')) {
        currentSection = 'medications';
        sections.medications = line.replace('💊 Medications:', '').trim();
      } else if (line.includes('Procedures:')) {
        currentSection = 'procedures';
        sections.procedures = line.replace('🛠️ Procedures:', '').trim();
      } else if (line.includes('Precautions:')) {
        currentSection = 'precautions';
        sections.precautions = line.replace('🧼 Precautions:', '').trim();
      } else if (line.includes('Specialist to Consult:')) {
        currentSection = 'specialist';
        sections.specialist = line.replace('👨‍⚕️ Specialist to Consult:', '').trim();
      } else if (line.trim() && currentSection) {
        sections[currentSection] += ' ' + line.trim();
      }
    });

    return sections;
  };

  const sections = parseResult(message);

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Analysis Results</Text>

        {sections.disease ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ Possible Disease</Text>
              <Text style={styles.cardContent}>{sections.disease}</Text>
            </View>

            {sections.description && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📄 Description</Text>
                <Text style={styles.cardContent}>{sections.description}</Text>
              </View>
            )}

            {sections.medications && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>💊 Medications</Text>
                <Text style={styles.cardContent}>{sections.medications}</Text>
              </View>
            )}

            {sections.procedures && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🛠️ Procedures</Text>
                <Text style={styles.cardContent}>{sections.procedures}</Text>
              </View>
            )}

            {sections.precautions && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🧼 Precautions</Text>
                <Text style={styles.cardContent}>{sections.precautions}</Text>
              </View>
            )}

            {sections.specialist && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>👨‍⚕️ Specialist to Consult</Text>
                <Text style={styles.cardContent}>{sections.specialist}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardContent}>{message}</Text>
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This analysis is for informational purposes only. Always consult 
            with a qualified healthcare professional for proper medical advice.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerText: {
    color: '#FCD34D',
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsScreen;
