import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let API_BASE_URL = 'https://erp.thumps.app/';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout after 10 seconds
  withCredentials: true,
});


const handleSessionExpired = async () => {
  console.log('Session expired. Logging out user...');
  await AsyncStorage.removeItem('sessionID');
  // Redirect user to login screen (Implement this in your app)
};


apiClient.interceptors.request.use(
  async (config) => {
    try {
      const sessionID = await AsyncStorage.getItem('sessionID');
      if (sessionID && typeof sessionID === 'string' && sessionID.trim() !== '') {
        config.headers['Cookie'] = `session_id=MvDBvoLHG4gOIcRmOVgBFg9eQbCspIbN-i7s0Vz4eYSnPdxkA55Qysg3zWoCxGjrmegGnO3J8R7W_O7-52mo`;
      } else {
        config.headers['db'] = `thumps18`;
        config.headers['login'] = `thumpsbot@yopmail.com`;
        config.headers['password'] = `Welcome@123`;
        // Optional: explicitly remove Cookie if sessionID is invalid
        delete config.headers['Cookie'];
      }
    } catch (error) {
      console.warn('Error retrieving sessionID:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle session expiration
apiClient.interceptors.response.use(
  (response) => response.data, // Return only the data
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        await handleSessionExpired(); // Clear session and log out
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
