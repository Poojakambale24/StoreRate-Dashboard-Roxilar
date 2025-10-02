const http = require('http');

function testSimpleConnection() {
  console.log('🔌 Testing simple server connection...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server responding with status: ${res.statusCode}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Server is accessible and responding');
      testAPIRoute();
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Connection failed: ${e.message}`);
  });

  req.end();
}

function testAPIRoute() {
  console.log('\n🔍 Testing API route...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`API Status: ${res.statusCode}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ API routes are working');
        try {
          const data = JSON.parse(body);
          console.log(`Found ${data.users ? data.users.length : 0} users in database`);
        } catch (e) {
          console.log('Response received but not JSON');
        }
      } else {
        console.log('❌ API route error:', body);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ API request failed: ${e.message}`);
  });

  req.end();
}

testSimpleConnection();