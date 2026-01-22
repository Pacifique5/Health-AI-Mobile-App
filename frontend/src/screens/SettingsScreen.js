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
  Platform,
  Switch
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import { updateProfile, changePassword, uploadProfilePicture } from '../config/api';
import GradientButton from '../components/GradientButton';
import Input from '../components/Input';

const SettingsScreen = ({ navigation }) => {
  const { user, updateUser, logoutUser } = useContext(AuthContext);
  const { theme, colors, toggleTheme, isDark } = useContext(ThemeContext);
  const { notifications, updateNotificationSetting } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  
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

  const getNotificationDescription = (key) => {
    const descriptions = {
      healthReminders: 'Get reminders about your health and wellness',
      conversationUpdates: 'Notifications about your chat conversations',
      systemNotifications: 'Important app updates and announcements',
      medicationReminders: 'Reminders to take your medications',
      appointmentReminders: 'Upcoming medical appointment alerts',
    };
    return descriptions[key] || '';
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
          <LinearGradient colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#FFFFFF', '#F8FAFC']} style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>
            
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
                style={[styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
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
          <LinearGradient colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#FFFFFF', '#F8FAFC']} style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Email</Text>
            
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
                style={[styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
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
          <LinearGradient colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#FFFFFF', '#F8FAFC']} style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Username</Text>
            
            <Input
              label="New Username"
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username (min 3 characters)"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={() => setShowUsernameModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
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

  const renderNotificationsModal = () => (
    <Modal
      visible={showNotificationsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowNotificationsModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#FFFFFF', '#F8FAFC']} style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Notification Settings</Text>
            
            {Object.entries(notifications).map(([key, value]) => (
              <View key={key} style={styles.notificationItem}>
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    {getNotificationDescription(key)}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) => updateNotificationSetting(key, newValue)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={value ? colors.surface : colors.background}
                />
              </View>
            ))}
            
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.primary, marginTop: 20 }]}
              onPress={() => setShowNotificationsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LinearGradient colors={theme === 'dark' ? ['#111827', '#1F2937'] : ['#F8FAFC', '#E0F2FE']} style={styles.gradient}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
              
              <View style={[styles.profileContainer, { backgroundColor: colors.card }]}>
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
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {user?.username || 'User'}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                    {user?.email || 'No email'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
              
              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => setShowUsernameModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>👤</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Username</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    {user?.username || 'Not set'}
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => setShowEmailModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>✉️</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Email</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    {user?.email || 'Not set'}
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => setShowPasswordModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🔒</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Password</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>••••••••</Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </View>

            {/* App Settings */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
              
              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={toggleTheme}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>{isDark ? '🌙' : '☀️'}</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    {isDark ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? colors.surface : colors.background}
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => setShowNotificationsModal(true)}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🔔</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    {Object.values(notifications).some(v => v) ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Support */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
              
              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('HelpFAQ')}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>❓</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Help & FAQ</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    Get help and answers
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('EmergencyContacts')}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingIconText}>🚨</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Emergency Contacts</Text>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    24/7 emergency numbers
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modals */}
          {renderPasswordModal()}
          {renderEmailModal()}
          {renderUsernameModal()}
          {renderNotificationsModal()}
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
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
  },
  settingArrow: {
    fontSize: 20,
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
  // Notification Modal Styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationContent: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default SettingsScreen;