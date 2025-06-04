// Application constants

export const APP_NAME = 'OnlyNextjs Util';
export const APP_DESCRIPTION = 'Ứng dụng quản lý hiện đại với Next.js 15, NextAuth và MongoDB';

// Task constants
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Chờ xử lý',
  [TASK_STATUS.IN_PROGRESS]: 'Đang thực hiện',
  [TASK_STATUS.COMPLETED]: 'Hoàn thành',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Thấp',
  [TASK_PRIORITY.MEDIUM]: 'Trung bình',
  [TASK_PRIORITY.HIGH]: 'Cao',
};

// Color schemes
export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [TASK_PRIORITY.MEDIUM]: 'bg-orange-100 text-orange-800',
  [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-800',
};

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_TASK_TITLE_LENGTH: 200,
  MAX_TASK_DESCRIPTION_LENGTH: 1000,
  MAX_USER_NAME_LENGTH: 100,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  TASK_FILTER: 'task-filter',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/dashboard/tasks',
  NEW_TASK: '/dashboard/tasks/new',
};

// Toast durations (ms)
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  SERVER_ERROR: 'Lỗi server nội bộ',
};

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Nhiệm vụ đã được tạo thành công',
  TASK_UPDATED: 'Nhiệm vụ đã được cập nhật',
  TASK_DELETED: 'Nhiệm vụ đã được xóa',
  USER_REGISTERED: 'Đăng ký thành công',
  USER_LOGGED_IN: 'Đăng nhập thành công',
};

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false, // Future feature
};

// API endpoints (if needed)
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  TASKS: '/api/tasks',
  USERS: '/api/users',
};

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
};

// Default values
export const DEFAULTS = {
  TASK_PRIORITY: TASK_PRIORITY.MEDIUM,
  TASK_STATUS: TASK_STATUS.PENDING,
  PAGE_SIZE: PAGINATION.DEFAULT_PAGE_SIZE,
};

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];
