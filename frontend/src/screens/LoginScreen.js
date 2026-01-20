import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return '';
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(validatePassword(text));
    }
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (emailErr || passwordErr) {
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.replace('Dashboard') }
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.gradient}>
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>🤖</Text>
              </View>
              <Text style={styles.appName}>SymptomAI</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                
                {/* Password Requirements */}
                {password && !passwordError && (
                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <Text style={[styles.requirement, password.length >= 8 && styles.requirementMet]}>
                      ✓ At least 8 characters
                    </Text>
                    <Text style={[styles.requirement, /(?=.*[a-z])/.test(password) && styles.requirementMet]}>
                      ✓ One lowercase letter
                    </Text>
                    <Text style={[styles.requirement, /(?=.*[A-Z])/.test(password) && styles.requirementMet]}>
                      ✓ One uppercase letter
                    </Text>
                    <Text style={[styles.requirement, /(?=.*\d)/.test(password) && styles.requirementMet]}>
                      ✓ One number
                    </Text>
                    <Text style={[styles.requirement, /(?=.*[@$!%*?&])/.test(password) && styles.requirementMet]}>
                      ✓ One special character (@$!%*?&)
                    </Text>
                  </View>
                )}
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkedBox]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>Remember me</Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={styles.signInButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.signInGradient}>
                  <Text style={styles.signInText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>New to SymptomAI?</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Create Account Link */}
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.createAccountText}>Create an account</Text>
              </TouchableOpacity>

              {/* Trust Badge */}
              <View style={styles.trustBadge}>
                <Text style={styles.trustText}>🔒 Your data is secure and encrypted</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordRequirements: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  requirement: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  requirementMet: {
    color: '#10B981',
    fontWeight: '500',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  createAccountText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    textAlign: 'center',
  },
  trustBadge: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
  },
  trustText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default LoginScreen;