// Environment configuration
// This file manages environment variables and configurations

// Import environment variables from .env file
// import { API_PASSWORD as ENV_API_PASSWORD, LOGIN_EMAIL as ENV_LOGIN_EMAIL } from '@env';

// Development environment settings
const development = {
  API_BASE_URL: 'https://thumps.app/',
  DB_NAME: 'thumps_dev',
  LOGIN_EMAIL: 'thumpsbot@yopmail.com',
  // Password should be set via environment variable
  API_PASSWORD: 'Welcome@123',
  DEFAULT_TIMEOUT: 10000,
  ENABLE_CONSOLE_LOGS: true,
};

// Production environment settings
const production = {
  API_BASE_URL: 'https://thumps.app/',
  DB_NAME: 'thumps_prod',
  // LOGIN_EMAIL: ENV_LOGIN_EMAIL || '',
  // API_PASSWORD: ENV_API_PASSWORD || '',
  DEFAULT_TIMEOUT: 15000,
  ENABLE_CONSOLE_LOGS: false,
};

// Test environment settings
const test = {
  API_BASE_URL: 'https://test.thumps.app/',
  DB_NAME: 'thumps_test',
  LOGIN_EMAIL: 'test@thumps.app',
  API_PASSWORD: 'Welcome@123',
  DEFAULT_TIMEOUT: 5000,
  ENABLE_CONSOLE_LOGS: true,
};

// Get current environment
const getEnvironment = () => {
  // For React Native, check __DEV__ flag
  // __DEV__ is true in development, false in production builds
  if (__DEV__) {
    return 'development';
  }
  
  return 'production';
};

// Environment configurations
const environments = {
  development,
  production,
  test,
};

// Get current environment config
const currentEnv = getEnvironment();
const config = environments[currentEnv];

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['API_PASSWORD'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!config[varName] || config[varName].trim() === '') {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('⚠️  Please set these variables in your environment or .env file');
    
    // In development, show helpful message
    if (currentEnv === 'development') {
      console.warn('💡 For development, you can create a .env file with:');
      missingVars.forEach(varName => {
        console.warn(`   ${varName}=your_${varName.toLowerCase()}_here`);
      });
    }
  }
  
  return missingVars.length === 0;
};

// Export configuration
export default {
  ...config,
  ENVIRONMENT: currentEnv,
  isValid: validateConfig(),
};

// Named exports for convenience
export const {
  API_BASE_URL,
  DB_NAME,
  LOGIN_EMAIL,
  API_PASSWORD,
  DEFAULT_TIMEOUT,
  ENABLE_CONSOLE_LOGS,
  ENVIRONMENT,
} = config;