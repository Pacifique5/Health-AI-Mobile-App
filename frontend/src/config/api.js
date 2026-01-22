import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.12.73.180:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear user data
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/signup', {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const uploadProfilePicture = async (imageAsset) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'profile.jpg',
    });

    const response = await api.post('/api/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

// Symptom analysis
export const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await api.post('/api/symptoms/analyze', { symptoms });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

// Conversation endpoints
export const createConversation = async (title) => {
  try {
    const response = await api.post('/api/conversations', { title });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get('/api/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await api.get(`/api/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const addMessage = async (conversationId, content, sender = 'user') => {
  try {
    const response = await api.post(`/api/conversations/${conversationId}/messages`, {
      content,
      sender
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/api/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export default api;