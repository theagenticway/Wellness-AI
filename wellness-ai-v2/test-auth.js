#!/usr/bin/env node

// Simple test script to verify authentication is working
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3001';

async function testAuthentication() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Login with demo member account
    console.log('1️⃣ Testing login with demo@wellnessai.com...');
    const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@wellnessai.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, errorText);
      return;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('   User:', loginResult.user.firstName, loginResult.user.lastName);
    console.log('   Email:', loginResult.user.email);
    console.log('   Type:', loginResult.user.type);
    console.log('   Token:', loginResult.token.substring(0, 20) + '...');

    // Test 2: Use token to access protected endpoint
    console.log('\n2️⃣ Testing protected endpoint with token...');
    const protectedResponse = await fetch(`${BACKEND_URL}/api/wellness/daily-plan`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginResult.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!protectedResponse.ok) {
      const errorText = await protectedResponse.text();
      console.log('❌ Protected endpoint failed:', protectedResponse.status, errorText);
      return;
    }

    const protectedResult = await protectedResponse.json();
    console.log('✅ Protected endpoint accessed successfully!');
    console.log('   Plan generated for:', protectedResult.data?.greeting || 'User');

    // Test 3: Login with professional account
    console.log('\n3️⃣ Testing login with professional@wellnessai.com...');
    const profLoginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'professional@wellnessai.com',
        password: 'password123'
      })
    });

    if (!profLoginResponse.ok) {
      const errorText = await profLoginResponse.text();
      console.log('❌ Professional login failed:', profLoginResponse.status, errorText);
      return;
    }

    const profLoginResult = await profLoginResponse.json();
    console.log('✅ Professional login successful!');
    console.log('   User:', profLoginResult.user.firstName, profLoginResult.user.lastName);
    console.log('   Type:', profLoginResult.user.type);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Login Accounts Verified:');
    console.log('   👤 demo@wellnessai.com / password123 (Member)');
    console.log('   👩‍⚕️ professional@wellnessai.com / password123 (Professional)');

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.log('\n🔍 Make sure:');
    console.log('   - Backend server is running on port 3001');
    console.log('   - Database is connected and seeded');
    console.log('   - Run: cd wellness-ai-v2 && docker-compose up');
  }
}

// Run the test
testAuthentication();