import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const EmergencyContactsScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Try to use expo-location if available
      try {
        const Location = require('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission',
            'Please enable location services to find nearby hospitals.',
            [{ text: 'OK' }]
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (expoError) {
        // Fallback: Use browser geolocation if expo-location is not available
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Geolocation error:', error);
              Alert.alert('Location Error', 'Unable to get your current location.');
            }
          );
        } else {
          console.log('Location services not available');
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const handleFindNearestHospital = async () => {
    if (!userLocation) {
      Alert.alert(
        'Finding Hospitals',
        'We\'ll help you find nearby hospitals. This will open Google Maps.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Maps', 
            onPress: () => openMapsWithoutLocation()
          }
        ]
      );
      return;
    }

    // Create Google Maps URL with hospital search
    const { latitude, longitude } = userLocation;
    const googleMapsUrl = `https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},15z`;
    
    // Alternative: Use Google Maps app if available
    const googleMapsAppUrl = `comgooglemaps://?q=hospitals&center=${latitude},${longitude}&zoom=15`;
    
    try {
      // Try to open Google Maps app first
      const canOpenApp = await Linking.canOpenURL(googleMapsAppUrl);
      if (canOpenApp) {
        await Linking.openURL(googleMapsAppUrl);
      } else {
        // Fallback to web version
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Unable to open maps. Please try again.');
    }
  };

  const openMapsWithoutLocation = async () => {
    // Open Google Maps with general hospital search
    const googleMapsUrl = 'https://www.google.com/maps/search/hospitals+near+me';
    const googleMapsAppUrl = 'comgooglemaps://?q=hospitals';
    
    try {
      const canOpenApp = await Linking.canOpenURL(googleMapsAppUrl);
      if (canOpenApp) {
        await Linking.openURL(googleMapsAppUrl);
      } else {
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Unable to open maps. Please try again.');
    }
  };

  const emergencyContacts = [
    { 
      name: 'Emergencies', 
      phone: '911', 
      description: 'Health emergencies', 
      urgent: true,
      icon: '🚨'
    },
    { 
      name: 'Threats', 
      phone: '912', 
      description: 'National threats line', 
      urgent: true,
      icon: '🇷🇼'
    },
    { 
      name: 'Poison Control', 
      phone: '988', 
      description: 'Poison emergencies', 
      urgent: true,
      icon: '☠️'
    },
    { 
      name: 'Mental Health', 
      phone: '988', 
      description: '24/7 crisis support', 
      urgent: true,
      icon: '🧠'
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.background}>
          {/* Header */}
          <LinearGradient colors={['#DC2626', '#fb9696ff']} style={styles.header}>
            <Text style={styles.headerIcon}>🚨</Text>
            <Text style={styles.headerTitle}>Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyInfoTitle}>⚠️ When to Call Emergency Services</Text>
              <Text style={styles.emergencyInfoText}>
                Call immediately if you experience: chest pain, difficulty breathing, severe bleeding, 
                loss of consciousness, severe allergic reactions, or any life-threatening emergency.
              </Text>
            </View>
            
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity key={index} style={styles.emergencyContact}>
                <View style={styles.emergencyContactInfo}>
                  <Text style={styles.emergencyContactName}>{contact.name}</Text>
                  {contact.urgent && (
                    <Text style={styles.urgentBadge}>URGENT</Text>
                  )}
                  <Text style={styles.emergencyContactDesc}>{contact.description}</Text>
                </View>
                <View style={styles.emergencyContactPhoneBadge}>
                  <Text style={styles.emergencyContactPhoneText}>{contact.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.additionalResources}>
              <Text style={styles.resourcesTitle}>Additional Resources</Text>
              <TouchableOpacity 
                style={[
                  styles.resourceButton,
                  userLocation && styles.resourceButtonWithLocation
                ]}
                onPress={handleFindNearestHospital}
              >
                <Text style={styles.resourceButtonText}>
                  🏥 Find Nearest Hospital
                  {userLocation && ' 📍'}
                </Text>
                {userLocation && (
                  <Text style={styles.locationStatus}>Location detected</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.rwandaNote}>
              <Text style={styles.rwandaNoteText}>
                🏥 For immediate life-threatening emergencies, call 116 immediately.
                Emergency services in Rwanda: Police (112), Fire (113), Medical (114)
              </Text>
            </View>
          </ScrollView>
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
    paddingHorizontal: 30,
    paddingVertical: 10,
    paddingTop: 15,
    paddingBottom:15,
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
  closeButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emergencyInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 9,
    borderLeftColor: '#F59E0B',
  },
  emergencyInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  emergencyInfoText: {
    fontSize: 15,
    color: '#000000ff',
    lineHeight: 24,
  },
  emergencyContact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: '#fb9696ff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 100,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fb9696ff',
    color: '#343030ff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  emergencyContactDesc: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  emergencyContactPhoneBadge: {
    backgroundColor: '#fb9696ff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#fb9696ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyContactPhoneText: {
    color: '#343030ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  additionalResources: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  resourcesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  resourceButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minHeight: 64,
    justifyContent: 'center',
  },
  resourceButtonWithLocation: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  resourceButtonText: {
    color: '#343030ff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  locationStatus: {
    color: '#343030ff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  rwandaNote: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 60,
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
  },
  rwandaNoteText: {
    fontSize: 16,
    color: '#212223ff',
    lineHeight: 24,
  },
});

export default EmergencyContactsScreen;