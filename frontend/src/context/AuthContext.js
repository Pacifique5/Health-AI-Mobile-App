import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (userData) => {
    try {
      // Store complete user data including token
      const userToStore = {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
        access_token: userData.access_token
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        const updatedUser = { ...parsedUser, ...updatedUserData };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginUser, 
      logoutUser, 
      updateUser,
      isAuthenticated: !!user?.access_token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};