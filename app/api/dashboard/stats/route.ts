import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userRole = searchParams.get('userRole')

    if (userRole === 'admin') {
      // Admin dashboard stats
      const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users')
      const totalStoresResult = await pool.query('SELECT COUNT(*) as count FROM stores')
      const totalRatingsResult = await pool.query('SELECT COUNT(*) as count FROM ratings')
      
      // Get user distribution by role
      const userRolesResult = await pool.query(`
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `)
      
      // Get recent activity
      const recentActivityResult = await pool.query(`
        SELECT 'rating' as type, u.name as user_name, s.name as store_name, 
               r.rating, r.created_at
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        JOIN stores s ON r.store_id = s.id
        ORDER BY r.created_at DESC
        LIMIT 10
      `)

      const userRoles = userRolesResult.rows.reduce((acc: any, row) => {
        acc[row.role] = parseInt(row.count)
        return acc
      }, {})

      return NextResponse.json({
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        totalStores: parseInt(totalStoresResult.rows[0].count),
        totalRatings: parseInt(totalRatingsResult.rows[0].count),
        userRoles,
        recentActivity: recentActivityResult.rows.map(activity => ({
          type: activity.type,
          userName: activity.user_name,
          storeName: activity.store_name,
          rating: activity.rating,
          createdAt: activity.created_at.toISOString()
        }))
      })

    } else if (userRole === 'store_owner' && userId) {
      // Store owner dashboard stats
      const storeResult = await pool.query(`
        SELECT s.id, s.name, s.average_rating, s.total_ratings
        FROM stores s
        WHERE s.owner_id = $1
      `, [userId])

      if (storeResult.rows.length === 0) {
        return NextResponse.json({
          error: 'No store found for this owner'
        }, { status: 404 })
      }

      const store = storeResult.rows[0]

      // Get ratings for the store
      const ratingsResult = await pool.query(`
        SELECT r.rating, r.review, r.created_at, u.name as user_name
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.created_at DESC
      `, [store.id])

      // Get rating distribution
      const ratingDistributionResult = await pool.query(`
        SELECT rating, COUNT(*) as count
        FROM ratings
        WHERE store_id = $1
        GROUP BY rating
        ORDER BY rating
      `, [store.id])

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ratingDistributionResult.rows.forEach(row => {
        ratingDistribution[row.rating as keyof typeof ratingDistribution] = parseInt(row.count)
      })

      return NextResponse.json({
        store: {
          id: store.id.toString(),
          name: store.name,
          averageRating: parseFloat(store.average_rating),
          totalRatings: store.total_ratings
        },
        ratings: ratingsResult.rows.map(rating => ({
          rating: rating.rating,
          review: rating.review,
          userName: rating.user_name,
          createdAt: rating.created_at.toISOString()
        })),
        ratingDistribution
      })

    } else if (userRole === 'customer' && userId) {
      // Customer dashboard stats
      const userRatingsResult = await pool.query(`
        SELECT r.rating, r.review, r.created_at, s.name as store_name
        FROM ratings r
        JOIN stores s ON r.store_id = s.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
      `, [userId])

      const totalRatingsSubmitted = userRatingsResult.rows.length
      const averageRatingGiven = userRatingsResult.rows.length > 0 
        ? userRatingsResult.rows.reduce((sum, r) => sum + r.rating, 0) / userRatingsResult.rows.length
        : 0

      return NextResponse.json({
        totalRatingsSubmitted,
        averageRatingGiven: parseFloat(averageRatingGiven.toFixed(2)),
        recentRatings: userRatingsResult.rows.slice(0, 5).map(rating => ({
          rating: rating.rating,
          review: rating.review,
          storeName: rating.store_name,
          createdAt: rating.created_at.toISOString()
        }))
      })
    }

    return NextResponse.json({
      error: 'Invalid request parameters'
    }, { status: 400 })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}