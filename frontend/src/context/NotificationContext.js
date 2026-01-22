import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    healthReminders: true,
    conversationUpdates: true,
    systemNotifications: true,
    medicationReminders: true,
    appointmentReminders: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setNotifications(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSetting = async (key, value) => {
    try {
      const updatedSettings = { ...notifications, [key]: value };
      setNotifications(updatedSettings);
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving notification setting:', error);
    }
  };

  const scheduleNotification = (type, title, body, scheduledTime) => {
    // This would integrate with expo-notifications or react-native-push-notification
    // For now, we'll just log the notification
    console.log('Notification scheduled:', { type, title, body, scheduledTime });
    
    // In a real implementation, you would:
    // 1. Check if the notification type is enabled
    // 2. Schedule the notification with the system
    // 3. Store the notification ID for later cancellation
    
    if (notifications[type]) {
      // Schedule the actual notification here
      return true;
    }
    return false;
  };

  const cancelNotification = (notificationId) => {
    // Cancel a scheduled notification
    console.log('Notification cancelled:', notificationId);
  };

  const sendHealthReminder = (message) => {
    if (notifications.healthReminders) {
      scheduleNotification('healthReminders', 'Health Reminder', message, new Date());
    }
  };

  const sendMedicationReminder = (medicationName, time) => {
    if (notifications.medicationReminders) {
      scheduleNotification(
        'medicationReminders', 
        'Medication Reminder', 
        `Time to take your ${medicationName}`, 
        time
      );
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      loading,
      updateNotificationSetting,
      scheduleNotification,
      cancelNotification,
      sendHealthReminder,
      sendMedicationReminder,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};