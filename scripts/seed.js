/**
 * Database seeding script
 * Chạy: node scripts/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onlynextjs-util';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const users = [
      {
        name: 'Nguyễn Văn A',
        email: 'admin@example.com',
        password: hashedPassword,
      },
      {
        name: 'Trần Thị B',
        email: 'user@example.com',
        password: hashedPassword,
      },
      {
        name: 'Lê Văn C',
        email: 'demo@example.com',
        password: hashedPassword,
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Sample accounts:');
    console.log('   Email: admin@example.com');
    console.log('   Email: user@example.com');
    console.log('   Email: demo@example.com');
    console.log('   Password: 123456');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit();
  }
}

// Run the seeding
seedDatabase();
