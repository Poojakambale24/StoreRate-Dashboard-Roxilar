import { pool } from './db'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'lib', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    await pool.query(schema)
    console.log('Database schema created successfully')
    
    // Hash passwords for demo users
    const adminPassword = await bcrypt.hash('Admin123!', 10)
    const ownerPassword = await bcrypt.hash('Owner123!', 10)
    const customerPassword = await bcrypt.hash('Customer123!', 10)
    
    // Update demo users with properly hashed passwords
    await pool.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = 'admin@storerate.com'
    `, [adminPassword])
    
    await pool.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = 'owner@storerate.com'
    `, [ownerPassword])
    
    await pool.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = 'customer@storerate.com'
    `, [customerPassword])
    
    console.log('Demo users updated with proper password hashes')
    
    // Insert some demo stores
    await insertDemoStores()
    
    console.log('Database initialization completed successfully')
    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

async function insertDemoStores() {
  try {
    // Get store owner ID
    const ownerResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['owner@storerate.com']
    )
    
    if (ownerResult.rows.length === 0) {
      console.log('Store owner not found, skipping demo stores')
      return
    }
    
    const ownerId = ownerResult.rows[0].id
    
    const demoStores = [
      {
        name: 'Cozy Corner Cafe',
        description: 'A warm and welcoming cafe serving artisanal coffee and homemade pastries.',
        address: '123 Main Street, Downtown, City 12345',
        category: 'Restaurant'
      },
      {
        name: 'TechHub Electronics',
        description: 'Your one-stop shop for the latest electronics and gadgets.',
        address: '456 Tech Avenue, Innovation District, City 67890',
        category: 'Electronics'
      },
      {
        name: 'Fashion Forward Boutique',
        description: 'Trendy clothing and accessories for the modern fashionista.',
        address: '789 Style Street, Fashion Quarter, City 11111',
        category: 'Fashion'
      }
    ]
    
    for (const store of demoStores) {
      await pool.query(`
        INSERT INTO stores (name, description, address, category, owner_id, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        store.name,
        store.description,
        store.address,
        store.category,
        ownerId,
        '/placeholder.jpg'
      ])
    }
    
    console.log('Demo stores inserted successfully')
  } catch (error) {
    console.error('Failed to insert demo stores:', error)
  }
}