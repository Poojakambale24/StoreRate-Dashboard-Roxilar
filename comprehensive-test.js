const http = require('http')

function testEndpoint(path) {
  return new Promise((resolve) => {
    console.log(`Testing ${path}...`)
    
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      console.log(`✅ ${path} - Status: ${res.statusCode}`)
      resolve({ path, status: res.statusCode, success: true })
    })
    
    req.on('error', (error) => {
      console.log(`❌ ${path} - Error: ${error.message}`)
      resolve({ path, error: error.message, success: false })
    })
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - Timeout`)
      req.abort()
      resolve({ path, error: 'timeout', success: false })
    })
  })
}

async function testAllEndpoints() {
  console.log('🔧 Testing StoreRate Application Endpoints (Production Mode)...\n')
  
  const endpoints = [
    '/',
    '/auth',
    '/dashboard', 
    '/stores',
    '/reviews',
    '/api/stores',
    '/api/users',
    '/api/ratings',
    '/api/dashboard/stats'
  ]
  
  const results = []
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint)
    results.push(result)
  }
  
  console.log('\n📊 Test Results Summary:')
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`✅ Successful: ${successful}/${results.length}`)
  console.log(`❌ Failed: ${failed}/${results.length}`)
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints are working! Website is ready for deployment!')
  } else {
    console.log('\n⚠️  Some endpoints have issues. Check the errors above.')
  }
}

testAllEndpoints()