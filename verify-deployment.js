#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Tests all major functionality before deployment
 */

const https = require('https');
const http = require('http');

console.log('🚀 StoreRate Deployment Verification');
console.log('=====================================');

// Test configuration
const config = {
  host: 'localhost',
  port: 3000,
  timeout: 10000
};

// Test endpoints
const endpoints = [
  { path: '/', name: 'Landing Page' },
  { path: '/auth', name: 'Authentication Page' },
  { path: '/api/stores', name: 'Stores API' },
  { path: '/api/users', name: 'Users API' },
  { path: '/api/ratings', name: 'Ratings API' }
];

function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: config.host,
      port: config.port,
      path: endpoint.path,
      timeout: config.timeout
    }, (res) => {
      const success = res.statusCode >= 200 && res.statusCode < 400;
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: res.statusCode,
        success
      });
    });

    req.on('error', (err) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Running endpoint tests...\n');
  
  const results = await Promise.all(
    endpoints.map(endpoint => testEndpoint(endpoint))
  );

  let allPassed = true;
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   Path: ${result.path}`);
    console.log(`   Status: ${result.status}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
    
    if (!result.success) {
      allPassed = false;
    }
  });

  console.log('=====================================');
  if (allPassed) {
    console.log('🎉 All tests passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the issues above.');
    process.exit(1);
  }
}

// Check if server is running first
const req = http.get({
  hostname: config.host,
  port: config.port,
  path: '/',
  timeout: 5000
}, (res) => {
  console.log('✅ Server is running, starting tests...\n');
  runTests();
});

req.on('error', (err) => {
  console.log('❌ Server is not running on http://localhost:3000');
  console.log('   Please start the server first with: pnpm dev or pnpm start');
  console.log(`   Error: ${err.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  console.log('❌ Server connection timeout');
  console.log('   Please make sure the server is running on http://localhost:3000');
  process.exit(1);
});