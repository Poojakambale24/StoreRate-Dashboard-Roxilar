import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test all API endpoints
    const tests = []
    
    // Test Users API
    const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users`)
    tests.push({
      endpoint: '/api/users',
      status: usersResponse.status,
      success: usersResponse.ok
    })

    // Test Stores API
    const storesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stores`)
    tests.push({
      endpoint: '/api/stores',
      status: storesResponse.status,
      success: storesResponse.ok
    })

    // Test Ratings API
    const ratingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ratings`)
    tests.push({
      endpoint: '/api/ratings',
      status: ratingsResponse.status,
      success: ratingsResponse.ok
    })

    // Test Dashboard Stats API
    const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dashboard/stats`)
    tests.push({
      endpoint: '/api/dashboard/stats',
      status: dashboardResponse.status,
      success: dashboardResponse.ok
    })

    const allSuccess = tests.every(test => test.success)

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 'All API endpoints are working!' : 'Some API endpoints failed',
      tests,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}