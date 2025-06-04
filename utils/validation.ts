// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Task validation
export interface TaskValidation {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export const validateTask = (data: TaskValidation) => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Tiêu đề là bắt buộc');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Tiêu đề không được vượt quá 200 ký tự');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Mô tả không được vượt quá 1000 ký tự');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Mức độ ưu tiên không hợp lệ');
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.push('Ngày hết hạn không thể là quá khứ');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User validation
export interface UserValidation {
  name: string;
  email: string;
  password: string;
}

export const validateUser = (data: UserValidation) => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Tên là bắt buộc');
  }

  if (data.name && data.name.length > 100) {
    errors.push('Tên không được vượt quá 100 ký tự');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email không hợp lệ');
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format relative time
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  return formatDate(date);
};

// Calculate task progress
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Local storage helpers
export const localStorage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage quota exceeded
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Handle errors
    }
  }
};
