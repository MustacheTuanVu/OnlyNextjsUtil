// URL and string utilities

/**
 * Safely encode URL parameters, especially for Vietnamese characters
 */
export function encodeUrlParam(param: string): string {
  try {
    return encodeURIComponent(param);
  } catch (error) {
    console.error('Error encoding URL parameter:', error);
    // Fallback to basic encoding
    return param.replace(/[^a-zA-Z0-9-_.~]/g, '');
  }
}

/**
 * Safely decode URL parameters
 */
export function decodeUrlParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch (error) {
    console.error('Error decoding URL parameter:', error);
    return param;
  }
}

/**
 * Create a URL with encoded query parameters
 */
export function createUrlWithParams(
  basePath: string, 
  params: Record<string, string | number | boolean>
): string {
  const url = new URL(basePath, 'http://localhost'); // Base URL for parsing
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, encodeUrlParam(String(value)));
    }
  });
  
  return `${url.pathname}${url.search}`;
}

/**
 * Extract and decode query parameters from URL string
 */
export function extractUrlParams(urlString: string): Record<string, string> {
  try {
    const url = new URL(urlString, 'http://localhost');
    const params: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      params[key] = decodeUrlParam(value);
    });
    
    return params;
  } catch (error) {
    console.error('Error extracting URL parameters:', error);
    return {};
  }
}

/**
 * Sanitize string for safe display
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Truncate string with ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Convert string to slug (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Remove Vietnamese accents
 */
export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Format phone number (Vietnamese format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
}

/**
 * Check if string is valid Vietnamese phone number
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)([3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Check if string contains only Vietnamese characters
 */
export function isVietnameseText(str: string): boolean {
  const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
  return vietnameseRegex.test(str);
}

/**
 * Format currency (Vietnamese Dong)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyStr: string): number {
  return parseInt(currencyStr.replace(/[^\d]/g, '')) || 0;
}
