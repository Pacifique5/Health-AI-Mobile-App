import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, changePassword, uploadProfilePicture } from '../config/api';
import GradientButton from '../components/GradientButton';
import Input from '../components/Input';

const SettingsScreen = ({ navigation }) => {
  const { user, updateUser, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  
  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Email change form
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [emailPassword, setEmailPassword] = useState('');
  
  // Username change form
  const [newUsername, setNewUsername] = useState(user?.username || '');

  const handleProfilePictureChange = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLoading(true);
        try {
          const response = await uploadProfilePicture(result.assets[0]);
          updateUser({ ...user, profilePicture: response.profilePicture });
          Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error) {
          Alert.alert('Error', error.message || 'Failed to update profile picture');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail || !emailPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!newEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({ email: newEmail, password: emailPassword });
      updateUser({ ...user, email: newEmail });
      Alert.alert('Success', 'Email updated successfully!');
      setShowEmailModal(false);
      setEmailPassword('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    if (newUsername.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({ username: newUsername });
      updateUser({ ...user, username: newUsername });
      Alert.alert('Success', 'Username updated successfully!');
      setShowUsernameModal(false);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
          }
        },
      ]
    );
  };

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#111827', '#1F2937']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
            />
            
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password (min 6 characters)"
            />
            
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <GradientButton
                title="Update Password"
                onPress={handlePasswordChange}
                loading={loading}
                style={styles.updateButton}
              />
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderEmailModal = () => (
    <Modal
      visible={showEmailModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEmailModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#111827', '#1F2937']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Email</Text>
            
            <Input
              label="New Email"
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter new email address"
              keyboardType="email-address"
            />
            
            <Input
              label="Current Password"
              value={emailPassword}
              onChangeText={setEmailPassword}
              secureTextEntry
              placeholder="Enter password to confirm"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <GradientButton
                title="Update Email"
                onPress={handleEmailChange}
                loading={loading}
                style={styles.updateButton}
              />
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderUsernameModal = () => (
    <Modal
      visible={showUsernameModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUsernameModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#111827', '#1F2937']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Username</Text>
            
            <Input
              label="New Username"
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username (min 3 characters)"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowUsernameModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <GradientButton
                title="Update Username"
                onPress={handleUsernameChange}
                loading={loading}
                style={styles.updateButton}
              />
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              
              <View style={styles.profileContainer}>
                <TouchableOpacity 
                  style={styles.profilePictureContainer}
                  onPress={handleProfilePictureChange}
                >
                  {user?.profilePicture ? (
                    <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <View style={styles.profilePicturePlaceholder}>
                      <Text style={styles.profilePictureText}>
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.cameraIcon}>
                    <Text style={styles.cameraIconText}>📷</Text>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.username || 'User'}</Text>
                  <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
                </View>
              </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowUsernameModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>👤</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Username</Text>
                  <Text style={styles.settingValue}>{user?.username || 'Not set'}</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowEmailModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>✉️</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Email</Text>
                  <Text style={styles.settingValue}>{user?.email || 'Not set'}</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowPasswordModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🔒</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Password</Text>
                  <Text style={styles.settingValue}>••••••••</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* App Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🔔</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingValue}>Enabled</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🌙</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingValue}>Enabled</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Support */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>❓</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Help & FAQ</Text>
                  <Text style={styles.settingValue}>Get help</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>📞</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Contact Us</Text>
                  <Text style={styles.settingValue}>Send feedback</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Logout */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.logoutGradient}>
                  <Text style={styles.logoutText}>🚪 Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modals */}
          {renderPasswordModal()}
          {renderEmailModal()}
          {renderUsernameModal()}
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 20,
  },
  profilePictureContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePicturePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIconText: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingValue: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  settingArrow: {
    color: '#6B7280',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 40,
  },
  logoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SettingsScreen;