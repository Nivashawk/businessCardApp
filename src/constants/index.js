// Application Constants
// This file contains all the constants used throughout the application

// Tab names for contacts screen
export const TAB_NAMES = {
  MANUAL_CONTACTS: 'Manual Contacts',
  SHARED_CONTACTS: 'Shared Contacts',
  RECEIVED_CONTACTS: 'Received Contacts',
};

// Document scanner modes
export const SCANNER_MODES = {
  BUSINESS_CARD: 'businessCard',
  DOCUMENT: 'document',
  LOGO: 'logo',
};

// Navigation delays (in milliseconds)
export const DELAYS = {
  MODAL_OPEN: 300,
  TAB_SWITCH: 500,
  SEARCH_DEBOUNCE: 500,
  IMAGE_PROCESSING: 1000,
};

// Image processing constants
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  LOGO_SIZE: 800,
  BUSINESS_CARD_WIDTH: 1200,
  BUSINESS_CARD_HEIGHT: 800,
};

// OCR confidence thresholds
export const OCR_CONFIG = {
  MIN_CONFIDENCE: 0.7,
  HIGH_CONFIDENCE: 0.9,
  TEXT_MIN_LENGTH: 2,
  PHONE_MIN_LENGTH: 10,
  EMAIL_MIN_LENGTH: 5,
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: 'web/session/authenticate',
  HOME: 'api/home',
  BUSINESS: 'api/business',
  CONTACTS: 'api/contacts',
  EVENTS: 'api/events',
};

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  SESSION_ID: 'sessionID',
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  MANUAL_CONTACTS: '@manual_contacts',
  IS_LOGGED_IN: 'isLoggedIn',
};

// Filter options
export const FILTER_OPTIONS = {
  EVENT_TYPE: {
    ALL: 'ALL',
    CONFERENCE: 'CONFERENCE',
    WORKSHOP: 'WORKSHOP',
    MEETUP: 'MEETUP',
    WEBINAR: 'WEBINAR',
  },
  DATE_RANGE: {
    ALL: 'ALL',
    TODAY: 'TODAY',
    LAST_7_DAYS: 'LAST_7_DAYS',
    LAST_30_DAYS: 'LAST_30_DAYS',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  PERMISSION_DENIED: 'Permission denied. Please grant the required permissions.',
  INVALID_INPUT: 'Invalid input provided.',
  OCR_FAILED: 'Could not extract text from the image. Please try again.',
  SCANNER_FAILED: 'Document scanner failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CONTACT_SAVED: 'Contact saved successfully!',
  IMAGE_PROCESSED: 'Image processed successfully!',
  OCR_COMPLETED: 'Text extraction completed!',
  SCAN_COMPLETED: 'Document scan completed!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  URL_REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
};

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 65,
  SAFE_AREA_PADDING: 20,
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    EXTRA_LARGE: 24,
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
};

// File types and sizes
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
};

// Business card field types for OCR
export const BUSINESS_CARD_FIELDS = {
  NAME: 'name',
  BUSINESS_NAME: 'businessName',
  PHONE: 'phone',
  TELEPHONE: 'telephone',
  FAX: 'fax',
  EMAIL: 'email',
  WEBSITE: 'website',
  ADDRESS: 'address',
  JOB_TITLE: 'jobTitle',
};

// Navigation screen names
export const SCREEN_NAMES = {
  HOME: 'Home',
  CONTACTS: 'Contacts',
  BUSINESS: 'Business',
  EVENTS: 'Events',
  SCAN_QR: 'ScanQR',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  CREATE_BUSINESS: 'CreateBusiness',
  MANUAL_CONTACT_DETAIL: 'ManualContactDetail',
};

export default {
  TAB_NAMES,
  SCANNER_MODES,
  DELAYS,
  IMAGE_CONFIG,
  OCR_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  FILTER_OPTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  UI_CONSTANTS,
  FILE_CONFIG,
  BUSINESS_CARD_FIELDS,
  SCREEN_NAMES,
};