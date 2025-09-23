import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

// GET /api/users - Get all users with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const address = searchParams.get('address')
    const role = searchParams.get('role')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             COALESCE(s.average_rating, 0) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      WHERE 1=1
    `
    const queryParams: any[] = []
    let paramCount = 0

    // Add filters
    if (name) {
      paramCount++
      query += ` AND u.name ILIKE $${paramCount}`
      queryParams.push(`%${name}%`)
    }

    if (email) {
      paramCount++
      query += ` AND u.email ILIKE $${paramCount}`
      queryParams.push(`%${email}%`)
    }

    if (address) {
      paramCount++
      query += ` AND u.address ILIKE $${paramCount}`
      queryParams.push(`%${address}%`)
    }

    if (role) {
      paramCount++
      query += ` AND u.role = $${paramCount}`
      queryParams.push(role)
    }

    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'role', 'created_at', 'rating']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
    
    if (sortField === 'rating') {
      query += ` ORDER BY COALESCE(s.average_rating, 0) ${sortDirection}, u.name ASC`
    } else {
      query += ` ORDER BY u.${sortField} ${sortDirection}`
    }

    const result = await pool.query(query, queryParams)

    const users = result.rows.map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      rating: user.role === 'store_owner' ? parseFloat(user.rating) : undefined,
      createdAt: user.created_at.toISOString()
    }))

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, address, role } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return NextResponse.json(
        { error: 'Name must be between 20 and 60 characters' },
        { status: 400 }
      )
    }

    // Validate password requirements
    if (password.length < 8 || password.length > 16) {
      return NextResponse.json(
        { error: 'Password must be between 8 and 16 characters' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    // Validate address length
    if (address && address.length > 400) {
      return NextResponse.json(
        { error: 'Address must not exceed 400 characters' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'store_owner', 'customer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, passwordHash, address || null, role]
    )

    const newUser = result.rows[0]

    const userData = {
      id: newUser.id.toString(),
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      role: newUser.role,
      createdAt: newUser.created_at.toISOString()
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: userData
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}