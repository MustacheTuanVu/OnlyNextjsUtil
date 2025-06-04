#!/usr/bin/env node

/**
 * Health Check Script
 * Kiểm tra tình trạng của ứng dụng và các dependencies
 * 
 * Chạy: node scripts/health-check.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

async function checkEnvironmentVariables() {
  info('Checking environment variables...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    error('.env.local file not found');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      success(`${varName} is present`);
    } else {
      error(`${varName} is missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

async function checkMongoDBConnection() {
  info('Checking MongoDB connection...');
  
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      error('MONGODB_URI not found in environment variables');
      return false;
    }
    
    await mongoose.connect(MONGODB_URI);
    success('MongoDB connection successful');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    info(`Found ${collections.length} collections: ${collections.map(c => c.name).join(', ')}`);
    
    await mongoose.disconnect();
    return true;
  } catch (err) {
    error(`MongoDB connection failed: ${err.message}`);
    return false;
  }
}

async function checkFileStructure() {
  info('Checking file structure...');
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'app/layout.tsx',
    'app/page.tsx',
    'lib/mongodb.ts',
    'lib/auth.ts',
    'models/User.ts',
    'models/Task.ts'
  ];
  
  let allPresent = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      success(`${file} exists`);
    } else {
      error(`${file} is missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

async function checkDependencies() {
  info('Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'next-auth',
      'mongodb',
      'mongoose',
      'bcryptjs',
      'lucide-react',
      'tailwindcss'
    ];
    
    let allPresent = true;
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        success(`${dep} is installed`);
      } else {
        error(`${dep} is missing`);
        allPresent = false;
      }
    });
    
    return allPresent;
  } catch (err) {
    error(`Error reading package.json: ${err.message}`);
    return false;
  }
}

async function checkNextJSConfig() {
  info('Checking Next.js configuration...');
  
  try {
    const nextConfig = require(path.join(process.cwd(), 'next.config.js'));
    
    if (nextConfig.experimental?.serverActions) {
      success('Server Actions are configured');
    } else {
      warning('Server Actions configuration not found - may affect functionality');
    }
    
    return true;
  } catch (err) {
    error(`Error reading next.config.js: ${err.message}`);
    return false;
  }
}

async function checkModels() {
  info('Checking MongoDB models...');
  
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Import models to test them
    const User = require('../models/User');
    
    success('User model loaded successfully');
    
    // Test model creation (without saving)
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password'
    });
    
    // Validate without saving
    await testUser.validate();
    
    success('Model validation passed');
    
    await mongoose.disconnect();
    return true;
  } catch (err) {
    error(`Model check failed: ${err.message}`);
    return false;
  }
}

async function runHealthCheck() {
  log(`\n${colors.bold}🏥 OnlyNextjs Util - Health Check${colors.reset}\n`);
  
  const checks = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'File Structure', fn: checkFileStructure },
    { name: 'Dependencies', fn: checkDependencies },
    { name: 'Next.js Configuration', fn: checkNextJSConfig },
    { name: 'MongoDB Connection', fn: checkMongoDBConnection },
    { name: 'Database Models', fn: checkModels }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    log(`\n${colors.bold}--- ${check.name} ---${colors.reset}`);
    try {
      const result = await check.fn();
      if (!result) allPassed = false;
    } catch (err) {
      error(`${check.name} check failed: ${err.message}`);
      allPassed = false;
    }
  }
  
  log(`\n${colors.bold}--- Summary ---${colors.reset}`);
  
  if (allPassed) {
    success('All health checks passed! 🎉');
    success('Your application is ready to run.');
    log(`\n${colors.blue}Next steps:${colors.reset}`);
    log('1. npm run dev - Start development server');
    log('2. npm run seed - Add sample data (optional)');
    log('3. Open http://localhost:3000');
  } else {
    error('Some health checks failed. Please fix the issues above.');
    log(`\n${colors.yellow}Need help? Check the troubleshooting guide:${colors.reset}`);
    log('docs/TROUBLESHOOTING.md');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log('\n👋 Health check interrupted');
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  process.exit(1);
});

// Run the health check
runHealthCheck().catch(err => {
  error(`Health check crashed: ${err.message}`);
  process.exit(1);
});
