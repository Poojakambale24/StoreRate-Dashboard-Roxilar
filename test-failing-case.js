// Test the failing case specifically
console.log('🧪 Testing Failing Registration Case\n')

// Test the exact data that's failing
const failingCase = {
  name: 'Aniket Raju Kambaleokkkkk',
  email: 'aniket234@gmail.com',
  password: '•••••••••••', // This represents the hidden password
  address: 'Sangli, Maharashtra',
  role: 'customer'
}

// Simulate validation functions
function validateName(name) {
  console.log(`Name: "${name}" (${name.length} chars)`)
  if (!name || name.length < 2 || name.length > 50) {
    return `Name must be between 2 and 50 characters (current: ${name.length})`
  }
  return null
}

function validateEmail(email) {
  console.log(`Email: "${email}"`)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

function validatePassword(password) {
  console.log(`Password: "${password}" (${password.length} chars)`)
  if (!password || password.length < 6 || password.length > 20) {
    return `Password must be between 6 and 20 characters (current: ${password.length})`
  }
  return null
}

function validateAddress(address) {
  console.log(`Address: "${address}" (${address ? address.length : 0} chars)`)
  if (address && address.length > 400) {
    return `Address must not exceed 400 characters (current: ${address.length})`
  }
  return null
}

function validateRole(role) {
  console.log(`Role: "${role}"`)
  const validRoles = ['admin', 'store_owner', 'customer']
  if (!validRoles.includes(role)) {
    return `Invalid role. Must be one of: ${validRoles.join(', ')}`
  }
  return null
}

console.log('Testing the failing registration case:')
console.log('=====================================')

const nameError = validateName(failingCase.name)
const emailError = validateEmail(failingCase.email)
const passwordError = validatePassword(failingCase.password)
const addressError = validateAddress(failingCase.address)
const roleError = validateRole(failingCase.role)

console.log('\nValidation Results:')
console.log('==================')

if (nameError) console.log(`❌ Name: ${nameError}`)
else console.log('✅ Name: Valid')

if (emailError) console.log(`❌ Email: ${emailError}`)
else console.log('✅ Email: Valid')

if (passwordError) console.log(`❌ Password: ${passwordError}`)
else console.log('✅ Password: Valid')

if (addressError) console.log(`❌ Address: ${addressError}`)
else console.log('✅ Address: Valid')

if (roleError) console.log(`❌ Role: ${roleError}`)
else console.log('✅ Role: Valid')

console.log('\n' + '='.repeat(50))
if (!nameError && !emailError && !passwordError && !addressError && !roleError) {
  console.log('🎉 All validation should PASS!')
  console.log('💡 Issue might be:')
  console.log('   - Database connection problem')
  console.log('   - Environment variables missing in production')
  console.log('   - Network/CORS issues')
} else {
  console.log('❌ Validation FAILED - this explains the error')
}
console.log('='.repeat(50))