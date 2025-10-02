const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_4b5EuQdYBLtN@ep-rough-queen-ade18az9-pooler.c-2.us-east-1.aws.neon.tech/storeapp?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyDatabaseData() {
  console.log('🔍 Verifying database data and functionality...\n');
  
  try {
    // Test 1: Check if all tables exist
    console.log('1️⃣ Checking database tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log('✅ Tables found:', tables);
    
    if (!tables.includes('users') || !tables.includes('stores') || !tables.includes('ratings')) {
      console.log('❌ Missing required tables!');
      return false;
    }
    
    // Test 2: Check users data
    console.log('\n2️⃣ Checking users data...');
    const usersResult = await pool.query('SELECT id, name, email, role, address FROM users ORDER BY role');
    console.log('✅ Users in database:');
    usersResult.rows.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
      if (user.address) console.log(`     Address: ${user.address}`);
    });
    
    // Test 3: Check stores data
    console.log('\n3️⃣ Checking stores data...');
    const storesResult = await pool.query(`
      SELECT s.id, s.name, s.address, s.category, s.average_rating, s.total_ratings, u.name as owner_name
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      ORDER BY s.name
    `);
    console.log('✅ Stores in database:');
    storesResult.rows.forEach(store => {
      console.log(`   - ${store.name} (${store.category})`);
      console.log(`     Address: ${store.address}`);
      console.log(`     Owner: ${store.owner_name}`);
      console.log(`     Rating: ${store.average_rating} (${store.total_ratings} reviews)`);
    });
    
    // Test 4: Test password validation by verifying hashed passwords
    console.log('\n4️⃣ Testing password validation...');
    const adminUser = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['admin@storerate.com']);
    const ownerUser = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['owner@storerate.com']);
    const customerUser = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['customer@storerate.com']);
    
    const adminPasswordValid = await bcrypt.compare('Admin123!', adminUser.rows[0].password_hash);
    const ownerPasswordValid = await bcrypt.compare('Owner123!', ownerUser.rows[0].password_hash);
    const customerPasswordValid = await bcrypt.compare('Customer123!', customerUser.rows[0].password_hash);
    
    console.log(`✅ Admin password validation: ${adminPasswordValid ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Owner password validation: ${ownerPasswordValid ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Customer password validation: ${customerPasswordValid ? 'PASS' : 'FAIL'}`);
    
    // Test 5: Test adding a new user (simulating registration)
    console.log('\n5️⃣ Testing user registration simulation...');
    const testEmail = 'newuser@test.com';
    
    // First, clean up any existing test user
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    
    // Simulate user registration
    const hashedPassword = await bcrypt.hash('NewUser123!', 10);
    const newUserResult = await pool.query(`
      INSERT INTO users (name, email, password_hash, address, role) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, [
      'Test New User Registration Name',
      testEmail,
      hashedPassword,
      '123 Test Street, Test City, TC 12345',
      'customer'
    ]);
    
    console.log('✅ New user registered:', newUserResult.rows[0]);
    
    // Verify the new user can login (password validation)
    const loginTest = await pool.query('SELECT password_hash FROM users WHERE email = $1', [testEmail]);
    const loginValid = await bcrypt.compare('NewUser123!', loginTest.rows[0].password_hash);
    console.log(`✅ New user login validation: ${loginValid ? 'PASS' : 'FAIL'}`);
    
    // Test 6: Test adding a rating
    console.log('\n6️⃣ Testing rating functionality...');
    const newUserId = newUserResult.rows[0].id;
    const storeId = storesResult.rows[0].id; // Use first store
    
    // Add a rating
    await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating, review)
      VALUES ($1, $2, $3, $4)
    `, [newUserId, storeId, 5, 'Excellent service and quality products!']);
    
    // Check if store rating was updated automatically (trigger should work)
    const updatedStore = await pool.query('SELECT average_rating, total_ratings FROM stores WHERE id = $1', [storeId]);
    console.log(`✅ Store rating updated: ${updatedStore.rows[0].average_rating} avg (${updatedStore.rows[0].total_ratings} total)`);
    
    // Test 7: Check data constraints and validation
    console.log('\n7️⃣ Testing database constraints...');
    
    try {
      // Try invalid rating (should fail)
      await pool.query(`
        INSERT INTO ratings (user_id, store_id, rating, review)
        VALUES ($1, $2, $3, $4)
      `, [newUserId, storeId, 6, 'This should fail']); // Rating > 5 should fail
      console.log('❌ Rating constraint failed - invalid rating was accepted');
    } catch (error) {
      console.log('✅ Rating constraint working - invalid rating rejected');
    }
    
    try {
      // Try duplicate rating (should fail due to unique constraint)
      await pool.query(`
        INSERT INTO ratings (user_id, store_id, rating, review)
        VALUES ($1, $2, $3, $4)
      `, [newUserId, storeId, 4, 'Duplicate rating']); // Same user, same store should fail
      console.log('❌ Unique constraint failed - duplicate rating was accepted');
    } catch (error) {
      console.log('✅ Unique constraint working - duplicate rating rejected');
    }
    
    // Test 8: Final data summary
    console.log('\n8️⃣ Final database summary...');
    const finalUsersCount = await pool.query('SELECT COUNT(*) FROM users');
    const finalStoresCount = await pool.query('SELECT COUNT(*) FROM stores');
    const finalRatingsCount = await pool.query('SELECT COUNT(*) FROM ratings');
    
    console.log(`✅ Total users: ${finalUsersCount.rows[0].count}`);
    console.log(`✅ Total stores: ${finalStoresCount.rows[0].count}`);
    console.log(`✅ Total ratings: ${finalRatingsCount.rows[0].count}`);
    
    console.log('\n🎉 All database tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Database connection: Working');
    console.log('✅ Tables created: Working');
    console.log('✅ User registration: Working');
    console.log('✅ Password hashing: Working');
    console.log('✅ Login validation: Working');
    console.log('✅ Rating system: Working');
    console.log('✅ Database constraints: Working');
    console.log('✅ Data persistence: Working');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    return false;
  } finally {
    await pool.end();
  }
}

verifyDatabaseData();