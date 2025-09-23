const http = require('http')

async function testServer() {
  return new Promise((resolve) => {
    console.log('Testing server connection on port 3001...')
    
    const req = http.get('http://localhost:3001', (res) => {
      console.log('Status:', res.statusCode)
      console.log('Status Text:', res.statusMessage)
      console.log('✅ Server is accessible!')
      resolve(true)
    })
    
    req.on('error', (error) => {
      console.log('❌ Connection error:', error.message)
      resolve(false)
    })
    
    req.setTimeout(5000, () => {
      console.log('❌ Connection timeout')
      req.abort()
      resolve(false)
    })
  })
}

testServer()