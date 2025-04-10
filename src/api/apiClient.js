import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let API_BASE_URL = 'https://reqres.in/';

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
    // const sessionID = await AsyncStorage.getItem('sessionID');
    // if (sessionID) {
    //   config.headers['Cookie'] = `session_id=${sessionID}`;
    // }
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
