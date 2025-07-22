#!/usr/bin/env node

// Quick script to insert users directly via backend API
const fetch = require('node-fetch');

async function insertUsers() {
  console.log('🌱 Creating users via registration endpoint...\n');

  const BACKEND_URL = 'http://localhost:3001';

  try {
    // Create demo member user
    console.log('1️⃣ Creating demo member...');
    const memberResponse = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Demo',
        lastName: 'Member',
        email: 'demo@wellnessai.com',
        password: 'password123'
      })
    });

    if (memberResponse.ok) {
      const memberResult = await memberResponse.json();
      console.log('✅ Demo member created:', memberResult.user.email);
    } else {
      const memberError = await memberResponse.text();
      console.log('❌ Demo member failed:', memberResponse.status, memberError);
    }

    // Create professional user
    console.log('\n2️⃣ Creating professional...');
    const profResponse = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Dr. Sarah',
        lastName: 'Wilson',
        email: 'professional@wellnessai.com',
        password: 'password123'
      })
    });

    if (profResponse.ok) {
      const profResult = await profResponse.json();
      console.log('✅ Professional created:', profResult.user.email);
    } else {
      const profError = await profResponse.text();
      console.log('❌ Professional failed:', profResponse.status, profError);
    }

    console.log('\n🎉 User creation completed!');
    console.log('\n📋 Try logging in with:');
    console.log('   👤 demo@wellnessai.com / password123');
    console.log('   👩‍⚕️ professional@wellnessai.com / password123');

  } catch (error) {
    console.error('💥 Script failed:', error.message);
  }
}

insertUsers();