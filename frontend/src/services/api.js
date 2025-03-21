import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobsforce-api.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error('Network error:', error);
      throw new Error('Network error - please check your connection');
    } else {
      console.error('Request config error:', error);
      throw new Error('Error setting up request');
    }
  }
);

export default api;
