// Deployment Troubleshooting Script
const { Pool } = require('pg')

async function checkDeploymentIssues() {
  console.log('🔍 Checking Deployment Issues...\n')
  
  // 1. Check Environment Variables
  console.log('📋 Environment Variables Check:')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set (using default)')
  console.log()

  // 2. Test Database Connection
  console.log('🔌 Database Connection Test:')
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })

    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    console.log('✅ Database connection successful')
    console.log('Server time:', result.rows[0].now)

    // 3. Check if users table exists
    console.log('\n📊 Database Schema Check:')
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `)
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Users table exists')
      
      // Check table structure
      const columnCheck = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `)
      
      console.log('Table columns:')
      columnCheck.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
      })
    } else {
      console.log('❌ Users table does not exist')
      console.log('Need to run database initialization')
    }

    await pool.end()

  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 This looks like a DNS resolution issue')
      console.log('   - Check if the database server is accessible')
      console.log('   - Verify the DATABASE_URL is correct')
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection refused - database server might be down')
    } else if (error.code === '28000') {
      console.log('💡 Authentication failed - check credentials in DATABASE_URL')
    }
  }

  // 4. Test API Registration Flow
  console.log('\n🧪 Testing Registration API:')
  try {
    const testData = {
      name: 'Test User for Deployment Check',
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      role: 'customer'
    }

    console.log('Testing with data:', { ...testData, password: '****' })
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Registration API works locally')
    } else {
      console.log('❌ Registration API failed:', result.error)
    }

  } catch (error) {
    console.log('❌ Cannot test API (server not running):', error.message)
  }

  console.log('\n🚀 Deployment Checklist:')
  console.log('1. ✅ Set DATABASE_URL in production environment')
  console.log('2. ✅ Set NEXTAUTH_SECRET in production environment') 
  console.log('3. ✅ Set NEXTAUTH_URL to your production domain')
  console.log('4. ✅ Run database initialization in production')
  console.log('5. ✅ Check database connectivity from production server')
  console.log('6. ✅ Verify SSL settings for database connection')
}

checkDeploymentIssues().catch(console.error)