import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

// Validation functions
function validateName(name: string): string | null {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters'
  }
  return null
}

function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

function validatePassword(password: string): string | null {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters'
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  
  return null
}

function validateAddress(address: string): string | null {
  if (address && address.length > 400) {
    return 'Address must not exceed 400 characters'
  }
  return null
}

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

    // Validate field formats
    const nameError = validateName(name)
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 })
    }

    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    const addressError = validateAddress(address)
    if (addressError) {
      return NextResponse.json({ error: addressError }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'store_owner', 'customer']
    const userRole = role || 'customer'
    if (!validRoles.includes(userRole)) {
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
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, passwordHash, address || null, userRole]
    )

    const newUser = result.rows[0]

    // Return user data (excluding password)
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
    console.error('Signup error:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('check constraint')) {
        return NextResponse.json(
          { error: 'Invalid data provided' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}