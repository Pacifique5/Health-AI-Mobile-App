import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await api.post('/api/analyze', { symptoms });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/login', {
      username: email,
      password: password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await api.post('/api/signup', {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};

export default api;
