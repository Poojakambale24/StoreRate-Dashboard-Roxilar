const { default: fetch } = require('node-fetch');

async function testLogin() {
  console.log('🔐 Testing login functionality...');
  
  try {
    // Test customer login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@storerate.com',
        password: 'Customer123!'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('User data:', loginData.user);
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
}

async function testRegistration() {
  console.log('\n📝 Testing user registration...');
  
  try {
    // Test new user registration
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User Registration Account',
        email: 'testuser@example.com',
        password: 'TestPass123!',
        address: '456 Test Street, Test City, TC 12345',
        role: 'customer'
      }),
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      console.log('New user data:', registerData.user);
    } else {
      console.log('❌ Registration failed:', registerData.error);
    }
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
  }
}

async function testValidation() {
  console.log('\n🔍 Testing validation rules...');
  
  // Test invalid name (too short)
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Short',
        email: 'test2@example.com',
        password: 'TestPass123!',
        role: 'customer'
      }),
    });

    const data = await response.json();
    if (!response.ok && data.error.includes('20 and 60 characters')) {
      console.log('✅ Name validation working:', data.error);
    } else {
      console.log('❌ Name validation failed');
    }
  } catch (error) {
    console.error('❌ Validation test failed:', error.message);
  }

  // Test invalid password (no uppercase)
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Valid Test User Name Here',
        email: 'test3@example.com',
        password: 'testpass123!',
        role: 'customer'
      }),
    });

    const data = await response.json();
    if (!response.ok && data.error.includes('uppercase')) {
      console.log('✅ Password validation working:', data.error);
    } else {
      console.log('❌ Password validation failed');
    }
  } catch (error) {
    console.error('❌ Password validation test failed:', error.message);
  }
}

async function runAllTests() {
  await testLogin();
  await testRegistration();
  await testValidation();
  console.log('\n🎉 All tests completed!');
}

runAllTests();