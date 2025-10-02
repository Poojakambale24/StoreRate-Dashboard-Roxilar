const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAccountCreation() {
  console.log('🧪 Testing account creation...\n');

  try {
    // Test 1: Valid account creation
    console.log('1️⃣ Testing valid account creation...');
    const validAccount = {
      name: 'Test User Account Creation Name',
      email: `testuser${Date.now()}@example.com`,
      password: 'TestUser123!',
      address: '123 Test Avenue, Test City, TC 12345',
      role: 'customer'
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const response = await makeRequest(options, validAccount);
    
    if (response.status === 201) {
      console.log('✅ Account creation successful!');
      console.log('Created user:', response.data.user.name, '-', response.data.user.email);
    } else {
      console.log('❌ Account creation failed:', response.data.error);
    }

    // Test 2: Invalid account creation (validation test)
    console.log('\n2️⃣ Testing validation (short name)...');
    const invalidAccount = {
      name: 'Short',
      email: `invalid${Date.now()}@example.com`,
      password: 'TestUser123!',
      role: 'customer'
    };

    const response2 = await makeRequest(options, invalidAccount);
    
    if (response2.status === 400) {
      console.log('✅ Validation working:', response2.data.error);
    } else {
      console.log('❌ Validation failed - invalid data was accepted');
    }

    // Test 3: Test login with created account
    console.log('\n3️⃣ Testing login with created account...');
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const loginData = {
      email: validAccount.email,
      password: validAccount.password
    };

    const loginResponse = await makeRequest(loginOptions, loginData);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful with new account!');
      console.log('Logged in user:', loginResponse.data.user.name);
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
    }

    // Test 4: Test demo account login
    console.log('\n4️⃣ Testing demo account login...');
    const demoLoginData = {
      email: 'customer@storerate.com',
      password: 'Customer123!'
    };

    const demoResponse = await makeRequest(loginOptions, demoLoginData);
    
    if (demoResponse.status === 200) {
      console.log('✅ Demo account login successful!');
      console.log('Demo user:', demoResponse.data.user.name);
    } else {
      console.log('❌ Demo login failed:', demoResponse.data.error);
    }

    console.log('\n🎉 Account creation testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAccountCreation();