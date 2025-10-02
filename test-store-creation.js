// Test script to verify store creation process
console.log('Store Creation Test');

// Test API endpoints
async function testStoreCreation() {
  try {
    // 1. Create a test user with store_owner role
    console.log('Creating test user...');
    const userResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Store Owner',
        email: 'storeowner@test.com',
        password: 'password123',
        role: 'store_owner',
        address: 'Test Address'
      })
    });
    
    if (!userResponse.ok) {
      console.log('User creation failed:', await userResponse.text());
    } else {
      console.log('User created successfully');
    }

    // 2. Test login
    console.log('Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'storeowner@test.com',
        password: 'password123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login result:', loginResult);
    
    if (loginResult.user) {
      // 3. Test store creation
      console.log('Testing store creation...');
      const storeResponse = await fetch('http://localhost:3000/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Store',
          description: 'Test Description',
          address: 'Test Address',
          category: 'Restaurant',
          imageUrl: 'data:image/jpeg;base64,test',
          ownerId: loginResult.user.id
        })
      });
      
      if (storeResponse.ok) {
        console.log('Store created successfully!');
      } else {
        console.log('Store creation failed:', await storeResponse.text());
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testStoreCreation();