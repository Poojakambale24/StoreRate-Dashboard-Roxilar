"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Test User Registration Account Name',
    email: 'testuser@example.com',
    password: 'TestUser123!',
    address: '123 Test Street, Test City, TC 12345'
  })

  const initializeDB = async () => {
    setLoading(true)
    setStatus('Initializing database...')
    
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setStatus(JSON.stringify(data, null, 2))
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setStatus(JSON.stringify(data, null, 2))
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testRegistration = async () => {
    setLoading(true)
    setStatus('Testing registration...')
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'customer'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus(`✅ Registration successful!\n${JSON.stringify(data, null, 2)}`)
      } else {
        setStatus(`❌ Registration failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Registration error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setStatus('Testing login...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@storerate.com',
          password: 'Customer123!'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus(`✅ Login successful!\n${JSON.stringify(data, null, 2)}`)
      } else {
        setStatus(`❌ Login failed: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Login error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Testing</CardTitle>
          <CardDescription>Test database initialization and API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={initializeDB} disabled={loading}>
              {loading ? 'Loading...' : 'Initialize Database'}
            </Button>
            <Button onClick={testConnection} disabled={loading} variant="outline">
              {loading ? 'Loading...' : 'Test Users API'}
            </Button>
            <Button onClick={testLogin} disabled={loading} variant="outline">
              {loading ? 'Loading...' : 'Test Demo Login'}
            </Button>
          </div>
          
          {status && (
            <Alert>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{status}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Registration Test</CardTitle>
          <CardDescription>Test user registration functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name (20-60 chars)"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="8-16 chars, uppercase + special"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address (max 400 chars)"
              />
            </div>
          </div>
          
          <Button onClick={testRegistration} disabled={loading} className="w-full">
            {loading ? 'Creating Account...' : 'Test Account Creation'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}