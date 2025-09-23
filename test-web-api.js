// Using standard browser APIs available in Node.js 18+
async function testWebAPI() {
  console.log('🌐 Testing Web API endpoints...\n');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // Test 1: Login API
    console.log('1️⃣ Testing Login API...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@storerate.com',
        password: 'Customer123!'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.user.name, '-', loginData.user.email);
    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error.error);
    }
    
    // Test 2: Registration API
    console.log('\n2️⃣ Testing Registration API...');
    const registerResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Web API Test User Registration Name',
        email: 'webtest@example.com',
        password: 'WebTest123!',
        address: '789 Web Test Avenue, Web City, WC 99999',
        role: 'customer'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful:', registerData.user.name, '-', registerData.user.email);
    } else {
      const error = await registerResponse.json();
      console.log('❌ Registration failed:', error.error);
    }
    
    // Test 3: Invalid Registration (validation test)
    console.log('\n3️⃣ Testing Validation Rules...');
    const invalidResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short', // Too short (< 20 chars)
        email: 'invalid@example.com',
        password: 'InvalidPass123!',
        role: 'customer'
      })
    });
    
    if (!invalidResponse.ok) {
      const error = await invalidResponse.json();
      console.log('✅ Validation working:', error.error);
    } else {
      console.log('❌ Validation failed - invalid data was accepted');
    }
    
    // Test 4: Get Users API
    console.log('\n4️⃣ Testing Get Users API...');
    const usersResponse = await fetch(`${baseURL}/api/users`);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ Users API working: Found ${usersData.users.length} users`);
      usersData.users.slice(0, 2).forEach(user => {
        console.log(`   - ${user.name} (${user.role})`);
      });
    } else {
      console.log('❌ Users API failed');
    }
    
    // Test 5: Get Stores API
    console.log('\n5️⃣ Testing Get Stores API...');
    const storesResponse = await fetch(`${baseURL}/api/stores`);
    
    if (storesResponse.ok) {
      const storesData = await storesResponse.json();
      console.log(`✅ Stores API working: Found ${storesData.stores.length} stores`);
      storesData.stores.slice(0, 2).forEach(store => {
        console.log(`   - ${store.name} (${store.category}) - Rating: ${store.averageRating}`);
      });
    } else {
      console.log('❌ Stores API failed');
    }
    
    console.log('\n🎉 Web API testing completed!');
    
  } catch (error) {
    console.error('❌ Web API test failed:', error.message);
  }
}

testWebAPI();