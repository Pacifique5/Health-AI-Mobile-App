import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const quickActions = [
    { id: 1, title: 'Check Symptoms', icon: '🔍', screen: 'SymptomChecker' },
    { id: 2, title: 'Heart Health', icon: '❤️', screen: null },
    { id: 3, title: 'Preventive Care', icon: '🛡️', screen: null },
    { id: 4, title: 'Medication', icon: '💊', screen: null },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => action.screen && navigation.navigate(action.screen)}
                disabled={!action.screen}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Stay hydrated! Drink at least 8 glasses of water daily.
            </Text>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tipText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;