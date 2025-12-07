/**
 * Fix Users Script
 * 
 * This script deletes all users and recreates them with properly hashed passwords.
 * Run this if you have users with double-hashed passwords.
 * 
 * Usage: node scripts/fixUsers.js
 */

const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

// User data with plain passwords (will be hashed by schema)
const usersData = [
  {
    username: 'admin',
    email: 'admin@codeq.dev',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator and full-stack developer with 10+ years of experience.',
    title: 'Senior Full-Stack Developer',
    location: 'San Francisco, CA'
  },
  {
    username: 'sarah_dev',
    email: 'sarah@codeq.dev',
    password: 'expert123',
    role: 'expert',
    bio: 'React and Next.js expert. Love helping developers build amazing web applications.',
    title: 'Frontend Architect',
    location: 'New York, NY'
  },
  {
    username: 'alex_coder',
    email: 'alex@codeq.dev',
    password: 'expert123',
    role: 'expert',
    bio: 'Backend specialist focusing on Node.js, Express, and MongoDB. Always happy to help!',
    title: 'Backend Engineer',
    location: 'Austin, TX'
  },
  {
    username: 'john_doe',
    email: 'john@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Learning web development. Excited to be part of this community!',
    title: 'Junior Developer',
    location: 'Chicago, IL'
  },
  {
    username: 'emma_dev',
    email: 'emma@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Frontend developer passionate about React and modern JavaScript.',
    title: 'Frontend Developer',
    location: 'Seattle, WA'
  },
  {
    username: 'mike_codes',
    email: 'mike@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Full-stack developer learning the ropes. Ask me anything about my journey!',
    title: 'Software Developer',
    location: 'Boston, MA'
  },
  {
    username: 'lisa_tech',
    email: 'lisa@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'UI/UX designer turned developer. Love creating beautiful and functional interfaces.',
    title: 'UI Developer',
    location: 'Portland, OR'
  },
  {
    username: 'david_web',
    email: 'david@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Backend developer specializing in REST APIs and database design.',
    title: 'Backend Developer',
    location: 'Denver, CO'
  },
  {
    username: 'sophia_code',
    email: 'sophia@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'JavaScript enthusiast. Always exploring new frameworks and libraries.',
    title: 'JavaScript Developer',
    location: 'Miami, FL'
  }
];

async function fixUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing users
    console.log('🗑️  Deleting existing users...');
    await User.deleteMany({});
    console.log('✅ All users deleted');

    // Create users with properly hashed passwords
    console.log('👥 Creating users with correct password hashing...');
    const users = [];
    for (const userData of usersData) {
      // Use User.create() which triggers the pre-save hook to hash the password
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password, // Plain password - will be hashed by pre-save hook
        role: userData.role,
        bio: userData.bio,
        title: userData.title,
        location: userData.location
      });
      users.push(user);
      console.log(`  ✅ Created user: ${userData.username} (${userData.email})`);
    }

    console.log('\n🎉 Users fixed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('  Admin: admin@codeq.dev / admin123');
    console.log('  Expert: sarah@codeq.dev / expert123');
    console.log('  Expert: alex@codeq.dev / expert123');
    console.log('  Student: john@codeq.dev / student123');
    console.log('  (All other users: student123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing users:', error);
    process.exit(1);
  }
}

// Run fix
fixUsers();

