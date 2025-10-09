// Centralized logging utility
import config from '../config/env';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Current log level (can be configured per environment)
const CURRENT_LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

// Color codes for console output (will work in React Native debugger)
const COLORS = {
  DEBUG: '#6B7280', // Gray
  INFO: '#3B82F6',  // Blue
  WARN: '#F59E0B',  // Yellow
  ERROR: '#EF4444', // Red
  SUCCESS: '#10B981', // Green
};

// Icons for different log types
const ICONS = {
  DEBUG: '🐛',
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  SUCCESS: '✅',
  API: '🌐',
  NAV: '🧭',
  OCR: '🔍',
  SCAN: '📱',
  USER: '👤',
};

/**
 * Format log message with timestamp and metadata
 */
const formatMessage = (level, message, data = null, category = null) => {
  const timestamp = new Date().toISOString().substr(11, 8); // HH:mm:ss
  const icon = ICONS[category] || ICONS[level] || '';
  const categoryStr = category ? `[${category}]` : '';
  
  let formattedMessage = `${icon} ${timestamp} ${categoryStr} ${message}`;
  
  if (data !== null && data !== undefined) {
    if (typeof data === 'object') {
      formattedMessage += `\n📋 Data: ${JSON.stringify(data, null, 2)}`;
    } else {
      formattedMessage += `\n📋 Data: ${data}`;
    }
  }
  
  return formattedMessage;
};

/**
 * Check if logging is enabled for the current environment and level
 */
const shouldLog = (level) => {
  if (!config.ENABLE_CONSOLE_LOGS) return false;
  return LOG_LEVELS[level] >= CURRENT_LOG_LEVEL;
};

/**
 * Core logging function
 */
const log = (level, message, data = null, category = null) => {
  if (!shouldLog(level)) return;
  
  const formattedMessage = formatMessage(level, message, data, category);
  
  // Use appropriate console method based on level
  switch (level) {
    case 'DEBUG':
      console.debug(formattedMessage);
      break;
    case 'INFO':
      console.info(formattedMessage);
      break;
    case 'WARN':
      console.warn(formattedMessage);
      break;
    case 'ERROR':
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

// Logger object with different log levels and categories
const logger = {
  // Basic log levels
  debug: (message, data = null, category = null) => log('DEBUG', message, data, category),
  info: (message, data = null, category = null) => log('INFO', message, data, category),
  warn: (message, data = null, category = null) => log('WARN', message, data, category),
  error: (message, data = null, category = null) => log('ERROR', message, data, category),
  
  // Categorized loggers for better organization
  api: {
    request: (endpoint, data = null) => log('INFO', `API Request: ${endpoint}`, data, 'API'),
    response: (endpoint, data = null) => log('INFO', `API Response: ${endpoint}`, data, 'API'),
    error: (endpoint, error) => log('ERROR', `API Error: ${endpoint}`, error, 'API'),
  },
  
  navigation: {
    navigate: (from, to, params = null) => log('INFO', `Navigation: ${from} → ${to}`, params, 'NAV'),
    param: (screen, params) => log('DEBUG', `Params received: ${screen}`, params, 'NAV'),
    error: (message, error) => log('ERROR', `Navigation Error: ${message}`, error, 'NAV'),
  },
  
  ocr: {
    start: (imagePath) => log('INFO', 'OCR processing started', { imagePath }, 'OCR'),
    success: (extractedData) => log('INFO', 'OCR processing completed', extractedData, 'OCR'),
    error: (error, imagePath = null) => log('ERROR', 'OCR processing failed', { error, imagePath }, 'OCR'),
    debug: (step, data) => log('DEBUG', `OCR ${step}`, data, 'OCR'),
  },
  
  scan: {
    start: (mode) => log('INFO', `Document scan started: ${mode}`, null, 'SCAN'),
    complete: (result) => log('INFO', 'Document scan completed', result, 'SCAN'),
    error: (error) => log('ERROR', 'Document scan failed', error, 'SCAN'),
  },
  
  user: {
    action: (action, data = null) => log('INFO', `User action: ${action}`, data, 'USER'),
    error: (action, error) => log('ERROR', `User action failed: ${action}`, error, 'USER'),
  },
  
  // Performance logging
  performance: {
    start: (operation) => {
      if (shouldLog('DEBUG')) {
        console.time(`⏱️ ${operation}`);
        log('DEBUG', `Performance tracking started: ${operation}`, null, 'PERF');
      }
    },
    end: (operation) => {
      if (shouldLog('DEBUG')) {
        console.timeEnd(`⏱️ ${operation}`);
        log('DEBUG', `Performance tracking ended: ${operation}`, null, 'PERF');
      }
    },
  },
  
  // Success logging
  success: (message, data = null) => log('SUCCESS', message, data, 'SUCCESS'),
  
  // Group logging for related operations
  group: {
    start: (label) => {
      if (shouldLog('DEBUG')) {
        console.group(`📁 ${label}`);
      }
    },
    end: () => {
      if (shouldLog('DEBUG')) {
        console.groupEnd();
      }
    },
  },
};

// Export logger and utilities
export default logger;

// Named exports for convenience
export const {
  debug,
  info,
  warn,
  error,
  success,
  api,
  navigation,
  ocr,
  scan,
  user,
  performance,
  group,
} = logger;

// Utility to replace console.log statements
export const replaceConsoleLog = (message, data = null) => {
  logger.debug(message, data);
};