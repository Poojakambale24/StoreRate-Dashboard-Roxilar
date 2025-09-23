import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/stores - Get all stores with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const address = searchParams.get('address')
    const category = searchParams.get('category')
    const userId = searchParams.get('userId') // To get user's rating for each store
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let query = `
      SELECT s.id, s.name, s.description, s.address, s.category, s.image_url,
             s.owner_id, u.name as owner_name, s.average_rating, s.total_ratings,
             s.created_at, s.updated_at
    `
    
    // Add user's rating if userId is provided
    if (userId) {
      query += `, r.rating as user_rating, r.review as user_review`
    }
    
    query += `
      FROM stores s
      JOIN users u ON s.owner_id = u.id
    `
    
    if (userId) {
      query += ` LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $1`
    }
    
    query += ` WHERE 1=1`
    
    const queryParams: any[] = []
    let paramCount = userId ? 1 : 0

    // Add filters
    if (name) {
      paramCount++
      query += ` AND s.name ILIKE $${paramCount}`
      queryParams.push(`%${name}%`)
    }

    if (address) {
      paramCount++
      query += ` AND s.address ILIKE $${paramCount}`
      queryParams.push(`%${address}%`)
    }

    if (category) {
      paramCount++
      query += ` AND s.category = $${paramCount}`
      queryParams.push(category)
    }

    // Add sorting
    const validSortFields = ['name', 'address', 'category', 'average_rating', 'total_ratings', 'created_at']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
    query += ` ORDER BY s.${sortField} ${sortDirection}`

    // Prepare query parameters
    const finalParams = userId ? [userId, ...queryParams] : queryParams

    const result = await pool.query(query, finalParams)

    const stores = result.rows.map(store => ({
      id: store.id.toString(),
      name: store.name,
      description: store.description,
      location: store.address,
      category: store.category,
      imageUrl: store.image_url,
      ownerId: store.owner_id.toString(),
      ownerName: store.owner_name,
      averageRating: parseFloat(store.average_rating) || 0,
      totalRatings: store.total_ratings,
      userRating: store.user_rating || null,
      userReview: store.user_review || null,
      createdAt: store.created_at.toISOString(),
      updatedAt: store.updated_at.toISOString()
    }))

    return NextResponse.json({ stores })

  } catch (error) {
    console.error('Get stores error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/stores - Create new store
export async function POST(request: NextRequest) {
  try {
    const { name, description, address, category, imageUrl, ownerId } = await request.json()

    // Validate required fields
    if (!name || !address || !category || !ownerId) {
      return NextResponse.json(
        { error: 'Name, address, category, and owner ID are required' },
        { status: 400 }
      )
    }

    // Validate address length
    if (address.length > 400) {
      return NextResponse.json(
        { error: 'Address must not exceed 400 characters' },
        { status: 400 }
      )
    }

    // Verify owner exists and has appropriate role
    const ownerResult = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [ownerId]
    )

    if (ownerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      )
    }

    const owner = ownerResult.rows[0]
    if (owner.role !== 'store_owner' && owner.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only store owners and admins can own stores' },
        { status: 403 }
      )
    }

    // Insert new store
    const result = await pool.query(
      `INSERT INTO stores (name, description, address, category, image_url, owner_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, description, address, category, image_url, owner_id, 
                 average_rating, total_ratings, created_at, updated_at`,
      [name, description || null, address, category, imageUrl || '/placeholder.jpg', ownerId]
    )

    const newStore = result.rows[0]

    // Get owner name
    const ownerNameResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [ownerId]
    )

    const storeData = {
      id: newStore.id.toString(),
      name: newStore.name,
      description: newStore.description,
      location: newStore.address,
      category: newStore.category,
      imageUrl: newStore.image_url,
      ownerId: newStore.owner_id.toString(),
      ownerName: ownerNameResult.rows[0]?.name || 'Unknown',
      averageRating: parseFloat(newStore.average_rating) || 0,
      totalRatings: newStore.total_ratings,
      createdAt: newStore.created_at.toISOString(),
      updatedAt: newStore.updated_at.toISOString()
    }

    return NextResponse.json({
      message: 'Store created successfully',
      store: storeData
    }, { status: 201 })

  } catch (error) {
    console.error('Create store error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}