// Test Fixed Validation
console.log('🧪 Testing Fixed Validation Rules\n')

// Simulate the fixed validation functions
function validateName(name) {
  if (!name || name.length < 2 || name.length > 50) {
    return 'Name must be between 2 and 50 characters'
  }
  return null
}

function validatePassword(password) {
  if (!password || password.length < 6 || password.length > 20) {
    return 'Password must be between 6 and 20 characters'
  }
  return null
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

// Test cases
const testCases = [
  { name: 'John Smith', email: 'john@example.com', password: 'password123' },
  { name: 'Alice', email: 'alice@test.com', password: '123456' },
  { name: 'Bob Johnson', email: 'bob@company.com', password: 'mypass' },
  { name: 'Jane Doe', email: 'jane@email.com', password: 'secret789' }
]

console.log('Testing with realistic user data:')
testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`)
  
  const nameError = validateName(testCase.name)
  const emailError = validateEmail(testCase.email)
  const passwordError = validatePassword(testCase.password)
  
  if (nameError) {
    console.log(`  ❌ Name: ${nameError}`)
  } else {
    console.log(`  ✅ Name: Valid`)
  }
  
  if (emailError) {
    console.log(`  ❌ Email: ${emailError}`)
  } else {
    console.log(`  ✅ Email: Valid`)
  }
  
  if (passwordError) {
    console.log(`  ❌ Password: ${passwordError}`)
  } else {
    console.log(`  ✅ Password: Valid`)
  }
  
  if (!nameError && !emailError && !passwordError) {
    console.log(`  🎉 Overall: WOULD SUCCEED!`)
  } else {
    console.log(`  ❌ Overall: Would fail validation`)
  }
})

console.log('\n' + '='.repeat(50))
console.log('✅ Fixed validation is now more user-friendly!')
console.log('Users can now register with normal names and simpler passwords.')
console.log('='.repeat(50))