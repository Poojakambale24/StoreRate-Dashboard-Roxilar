// Database Initialization Script
const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function initializeDatabase() {
    console.log('🔧 Initializing Database...\n')
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    
    try {
        console.log('Connecting to database...')
        const client = await pool.connect()
        
        // Check if users table exists
        console.log('Checking if users table exists...')
        const tableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `)
        
        if (!tableExists.rows[0].exists) {
            console.log('❌ Users table does not exist. Creating...')
            
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(60) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'store_owner', 'customer')),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `)
            
            // Create indexes
            await client.query('CREATE INDEX idx_users_email ON users(email);')
            await client.query('CREATE INDEX idx_users_role ON users(role);')
            
            console.log('✅ Users table created successfully!')
        } else {
            console.log('✅ Users table already exists')
        }
        
        // Check table structure
        const columns = await client.query(`
            SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        `)
        
        console.log('\n📊 Table Structure:')
        columns.rows.forEach(col => {
            const length = col.character_maximum_length ? `(${col.character_maximum_length})` : ''
            const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
            const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
            console.log(`  - ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`)
        })
        
        // Test connection
        const testQuery = await client.query('SELECT COUNT(*) FROM users')
        console.log(`\n✅ Database ready! Current user count: ${testQuery.rows[0].count}`)
        
        client.release()
        
    } catch (error) {
        console.log('❌ Database initialization failed:', error.message)
        if (error.code) {
            console.log('Error code:', error.code)
        }
        throw error
    } finally {
        await pool.end()
    }
}

initializeDatabase().catch(console.error)