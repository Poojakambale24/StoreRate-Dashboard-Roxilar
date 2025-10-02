// Quick Auth Test
const fetch = require('node-fetch')

async function quickAuthTest() {
    console.log('🧪 Quick Authentication Test\n')
    
    // Wait for server
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test Registration
    console.log('Testing Registration...')
    try {
        const testUser = {
            name: 'Test User Quick',
            email: `quick-test-${Date.now()}@example.com`,
            password: 'TestPass123!',
            role: 'customer'
        }
        
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        })
        
        const result = await response.json()
        
        console.log('Status:', response.status)
        console.log('Response:', result)
        
        if (!response.ok) {
            console.log('❌ Registration failed!')
            console.log('Error details:', result)
        } else {
            console.log('✅ Registration successful!')
        }
        
    } catch (error) {
        console.log('❌ Registration test error:', error.message)
    }
}

quickAuthTest()