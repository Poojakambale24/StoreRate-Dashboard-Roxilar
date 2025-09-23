import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/ratings - Get all ratings with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const storeId = searchParams.get('storeId')
    const storeOwnerId = searchParams.get('storeOwnerId') // For store owners to see their store ratings
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let query = `
      SELECT r.id, r.user_id, r.store_id, r.rating, r.review, r.created_at, r.updated_at,
             u.name as user_name, u.email as user_email,
             s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE 1=1
    `
    
    const queryParams: any[] = []
    let paramCount = 0

    // Add filters
    if (userId) {
      paramCount++
      query += ` AND r.user_id = $${paramCount}`
      queryParams.push(userId)
    }

    if (storeId) {
      paramCount++
      query += ` AND r.store_id = $${paramCount}`
      queryParams.push(storeId)
    }

    if (storeOwnerId) {
      paramCount++
      query += ` AND s.owner_id = $${paramCount}`
      queryParams.push(storeOwnerId)
    }

    // Add sorting
    const validSortFields = ['rating', 'created_at', 'updated_at']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
    query += ` ORDER BY r.${sortField} ${sortDirection}`

    const result = await pool.query(query, queryParams)

    const ratings = result.rows.map(rating => ({
      id: rating.id.toString(),
      userId: rating.user_id.toString(),
      userName: rating.user_name,
      userEmail: rating.user_email,
      storeId: rating.store_id.toString(),
      storeName: rating.store_name,
      storeAddress: rating.store_address,
      rating: rating.rating,
      review: rating.review,
      createdAt: rating.created_at.toISOString(),
      updatedAt: rating.updated_at.toISOString()
    }))

    return NextResponse.json({ ratings })

  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/ratings - Submit a new rating
export async function POST(request: NextRequest) {
  try {
    const { userId, storeId, rating, review } = await request.json()

    // Validate required fields
    if (!userId || !storeId || !rating) {
      return NextResponse.json(
        { error: 'User ID, store ID, and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify store exists
    const storeResult = await pool.query(
      'SELECT id, name FROM stores WHERE id = $1',
      [storeId]
    )

    if (storeResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Check if user has already rated this store
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    )

    if (existingRating.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already rated this store. Use PUT to update your rating.' },
        { status: 409 }
      )
    }

    // Insert new rating
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating, review) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_id, store_id, rating, review, created_at, updated_at`,
      [userId, storeId, rating, review || null]
    )

    const newRating = result.rows[0]

    // Get user and store names for response
    const userNameResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId])
    const storeName = storeResult.rows[0].name

    const ratingData = {
      id: newRating.id.toString(),
      userId: newRating.user_id.toString(),
      userName: userNameResult.rows[0]?.name || 'Unknown',
      storeId: newRating.store_id.toString(),
      storeName: storeName,
      rating: newRating.rating,
      review: newRating.review,
      createdAt: newRating.created_at.toISOString(),
      updatedAt: newRating.updated_at.toISOString()
    }

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: ratingData
    }, { status: 201 })

  } catch (error) {
    console.error('Submit rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/ratings - Update an existing rating
export async function PUT(request: NextRequest) {
  try {
    const { userId, storeId, rating, review } = await request.json()

    // Validate required fields
    if (!userId || !storeId || !rating) {
      return NextResponse.json(
        { error: 'User ID, store ID, and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if rating exists
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    )

    if (existingRating.rows.length === 0) {
      return NextResponse.json(
        { error: 'No existing rating found. Use POST to create a new rating.' },
        { status: 404 }
      )
    }

    // Update rating
    const result = await pool.query(
      `UPDATE ratings 
       SET rating = $3, review = $4, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND store_id = $2
       RETURNING id, user_id, store_id, rating, review, created_at, updated_at`,
      [userId, storeId, rating, review || null]
    )

    const updatedRating = result.rows[0]

    // Get user and store names for response
    const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId])
    const storeResult = await pool.query('SELECT name FROM stores WHERE id = $1', [storeId])

    const ratingData = {
      id: updatedRating.id.toString(),
      userId: updatedRating.user_id.toString(),
      userName: userResult.rows[0]?.name || 'Unknown',
      storeId: updatedRating.store_id.toString(),
      storeName: storeResult.rows[0]?.name || 'Unknown',
      rating: updatedRating.rating,
      review: updatedRating.review,
      createdAt: updatedRating.created_at.toISOString(),
      updatedAt: updatedRating.updated_at.toISOString()
    }

    return NextResponse.json({
      message: 'Rating updated successfully',
      rating: ratingData
    })

  } catch (error) {
    console.error('Update rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}