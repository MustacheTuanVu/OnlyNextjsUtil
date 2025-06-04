#!/usr/bin/env node

/**
 * URL Encoding Test Script
 * Kiểm tra việc encode/decode URL parameters với ký tự tiếng Việt
 * 
 * Chạy: node scripts/test-encoding.js
 */

// Import utilities
const { createUrlWithParams, decodeUrlParam, encodeUrlParam } = require('../utils/string');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function testStringUtils() {
  log(`\n${colors.bold}🧪 Testing String Utilities${colors.reset}\n`);

  // Test cases with Vietnamese characters
  const testMessages = [
    'Đăng ký thành công, vui lòng đăng nhập',
    'Tạo nhiệm vụ thành công!',
    'Có lỗi xảy ra khi xử lý',
    'Xin chào! Chào mừng bạn',
    'Email đã được sử dụng',
    'Mật khẩu phải có ít nhất 6 ký tự'
  ];

  info('Testing encodeUrlParam and decodeUrlParam...');
  
  testMessages.forEach((message, index) => {
    try {
      // Test encoding
      const encoded = encodeUrlParam(message);
      const decoded = decodeUrlParam(encoded);
      
      if (decoded === message) {
        success(`Test ${index + 1}: "${message}" ✓`);
      } else {
        error(`Test ${index + 1}: Mismatch - Original: "${message}", Decoded: "${decoded}"`);
      }
    } catch (err) {
      error(`Test ${index + 1}: Error - ${err.message}`);
    }
  });

  info('\nTesting createUrlWithParams...');
  
  const testUrls = [
    {
      path: '/login',
      params: { message: 'Đăng ký thành công' },
      description: 'Login success message'
    },
    {
      path: '/dashboard/tasks',
      params: { 
        filter: 'pending', 
        message: 'Tạo nhiệm vụ thành công',
        page: 1 
      },
      description: 'Tasks page with filter and message'
    },
    {
      path: '/register',
      params: { error: 'Email đã được sử dụng' },
      description: 'Register error message'
    }
  ];

  testUrls.forEach((test, index) => {
    try {
      const url = createUrlWithParams(test.path, test.params);
      log(`  ${index + 1}. ${test.description}:`);
      log(`     URL: ${url}`, colors.blue);
      
      // Test if URL is valid
      const urlObj = new URL(url, 'http://localhost:3000');
      success(`     Valid URL structure ✓`);
      
      // Test parameter extraction
      const extractedParams = {};
      urlObj.searchParams.forEach((value, key) => {
        extractedParams[key] = decodeUrlParam(value);
      });
      
      log(`     Extracted params: ${JSON.stringify(extractedParams)}`, colors.yellow);
      
    } catch (err) {
      error(`  ${index + 1}. ${test.description}: Error - ${err.message}`);
    }
  });
}

function testSpecialCharacters() {
  log(`\n${colors.bold}🔤 Testing Special Characters${colors.reset}\n`);

  const specialTests = [
    'Tên có dấu: Nguyễn Văn Ánh',
    'Ký tự đặc biệt: !@#$%^&*()',
    'Unicode: 你好 مرحبا 🌟',
    'Mixed: Hello Việt Nam 123!',
    'Email: user@domain.com.vn',
    'Path: /api/users/create?name=test'
  ];

  specialTests.forEach((test, index) => {
    try {
      const encoded = encodeUrlParam(test);
      const decoded = decodeUrlParam(encoded);
      
      if (decoded === test) {
        success(`Special test ${index + 1}: "${test}" ✓`);
      } else {
        error(`Special test ${index + 1}: Failed`);
        log(`  Original: ${test}`);
        log(`  Encoded:  ${encoded}`);
        log(`  Decoded:  ${decoded}`);
      }
    } catch (err) {
      error(`Special test ${index + 1}: Error - ${err.message}`);
    }
  });
}

function testEdgeCases() {
  log(`\n${colors.bold}⚡ Testing Edge Cases${colors.reset}\n`);

  const edgeCases = [
    '',
    ' ',
    '   ',
    '\n\t\r',
    'a'.repeat(1000), // Very long string
    '%%invalid%%',
    null,
    undefined
  ];

  edgeCases.forEach((test, index) => {
    try {
      const encoded = encodeUrlParam(String(test || ''));
      const decoded = decodeUrlParam(encoded);
      
      success(`Edge case ${index + 1}: Handled safely ✓`);
    } catch (err) {
      // Expected for some cases
      log(`Edge case ${index + 1}: ${err.message}`, colors.yellow);
    }
  });
}

function simulateRegistrationFlow() {
  log(`\n${colors.bold}🔄 Simulating Registration Flow${colors.reset}\n`);

  try {
    // Simulate successful registration
    info('Simulating successful registration...');
    
    const successMessage = 'Đăng ký thành công, vui lòng đăng nhập';
    const loginUrl = createUrlWithParams('/login', { message: successMessage });
    
    log(`Generated URL: ${loginUrl}`, colors.blue);
    
    // Parse URL like the login page would
    const url = new URL(loginUrl, 'http://localhost:3000');
    const messageParam = url.searchParams.get('message');
    const decodedMessage = messageParam ? decodeUrlParam(messageParam) : null;
    
    if (decodedMessage === successMessage) {
      success('Registration flow simulation: PASSED ✓');
    } else {
      error('Registration flow simulation: FAILED');
      log(`Expected: ${successMessage}`);
      log(`Got: ${decodedMessage}`);
    }

    // Simulate error case
    info('\nSimulating registration error...');
    
    const errorMessage = 'Email đã được sử dụng';
    const errorUrl = createUrlWithParams('/register', { error: errorMessage });
    
    log(`Generated error URL: ${errorUrl}`, colors.blue);
    
    const errorUrlObj = new URL(errorUrl, 'http://localhost:3000');
    const errorParam = errorUrlObj.searchParams.get('error');
    const decodedError = errorParam ? decodeUrlParam(errorParam) : null;
    
    if (decodedError === errorMessage) {
      success('Error flow simulation: PASSED ✓');
    } else {
      error('Error flow simulation: FAILED');
    }

  } catch (err) {
    error(`Registration flow simulation failed: ${err.message}`);
  }
}

async function runTests() {
  log(`\n${colors.bold}🧪 URL Encoding Test Suite${colors.reset}\n`);
  
  testStringUtils();
  testSpecialCharacters();
  testEdgeCases();
  simulateRegistrationFlow();
  
  log(`\n${colors.bold}--- Test Summary ---${colors.reset}`);
  success('All URL encoding tests completed!');
  log(`\n${colors.blue}Next steps:${colors.reset}`);
  log('1. npm run dev - Test registration in browser');
  log('2. Try registering with Vietnamese name');
  log('3. Check that success message displays correctly');
  
  log(`\n${colors.yellow}If you encounter header encoding errors:${colors.reset}`);
  log('- Check that all redirect URLs use createUrlWithParams()');
  log('- Verify message decoding in receiving pages');
  log('- Run this test script again');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n👋 Test interrupted');
  process.exit(1);
});

// Run the tests
runTests().catch(err => {
  error(`Test suite crashed: ${err.message}`);
  process.exit(1);
});
