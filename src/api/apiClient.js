import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'https://erp.thumps.app/';
const API_BASE_URL = 'http://e5eb-2405-201-e01a-d894-c21-2096-c2e3-3a3c.ngrok-free.app/';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Handle session expiration by clearing stored session data
 */
const handleSessionExpired = async () => {
  console.log('Session expired. Logging out user...');
  await AsyncStorage.removeItem('sessionID');
  // Redirect user to login screen (Implement this in your app)
};

/**
 * Creates a fetch request with appropriate headers and timeout
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options
 * @returns {Promise<any>} - JSON response from API
 */
const fetchWithTimeout = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  // Set timeout
  const timeout = setTimeout(() => {
    controller.abort();
  }, options.timeout || DEFAULT_TIMEOUT);
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      signal,
    });
    
    clearTimeout(timeout);
    
    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      await handleSessionExpired();
      throw new Error('Session expired');
    }
    
    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    // Return JSON data directly (mimics axios.interceptors.response behavior)
    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    throw error;
  }
};

/**
 * Add common headers to request options
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Modified request options with headers
 */
const addHeaders = async (options = {}) => {
  // Initialize headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const sessionID = await AsyncStorage.getItem('sessionID');
    
    if (sessionID && typeof sessionID === 'string' && sessionID.trim() !== '') {
      headers['Cookie'] = sessionID;
    } else {
      // Remove Cookie if sessionID is invalid
      delete headers['Cookie'];
    }
  } catch (error) {
    console.warn('Error retrieving sessionID:', error);
  }
  
  return {
    ...options,
    headers,
    credentials: 'include', // Equivalent to withCredentials: true
  };
};

/**
 * API client with fetch implementation
 */
const apiClient = {
  /**
   * Make a GET request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} - JSON response
   */
  async get(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders({
      ...options,
      method: 'GET',
    });
    
    return fetchWithTimeout(url, requestOptions);
  },
  
  /**
   * Make a POST request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} - JSON response
   */
  async post(endpoint, data, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders({
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return fetchWithTimeout(url, requestOptions);
  },
  
  /**
   * Make a PUT request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} - JSON response
   */
  async put(endpoint, data, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders({
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    return fetchWithTimeout(url, requestOptions);
  },
  
  /**
   * Make a DELETE request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} - JSON response
   */
  async delete(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders({
      ...options,
      method: 'DELETE',
    });
    
    return fetchWithTimeout(url, requestOptions);
  },
  
  /**
   * Make a PATCH request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} - JSON response
   */
  async patch(endpoint, data, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders({
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    return fetchWithTimeout(url, requestOptions);
  },
  
  /**
   * Get the full response including headers (useful for authentication)
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Response>} - Full fetch Response object
   */
  async getFullResponse(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const requestOptions = await addHeaders(options);
    
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeout = setTimeout(() => {
      controller.abort();
    }, options.timeout || DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal,
      });
      
      clearTimeout(timeout);
      
      if (response.status === 401) {
        await handleSessionExpired();
      }
      
      return response; // Return the full response object with headers
    } catch (error) {
      clearTimeout(timeout);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
};

export default apiClient;