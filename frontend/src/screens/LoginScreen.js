import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // For demo - accept any email/password
    Alert.alert('Success', 'Login successful!', [
      { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
    ]);
  };

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SymptomAI</Text>
        <Text style={styles.subtitle}>Your AI Health Assistant</Text>
        <Text style={styles.version}>SDK 54 Compatible ✅</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.testInfo}>
          Test: Use any email/password to login
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testInfo: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LoginScreen;