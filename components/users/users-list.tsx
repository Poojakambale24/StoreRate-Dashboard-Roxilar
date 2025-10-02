"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRatings } from "@/contexts/rating-context"
import { Users, Shield, Store, User } from "lucide-react"
import { UserFormDialog } from "./user-form-dialog"
import { useState } from "react"

export function UsersList() {
  const { user, users } = useAuth() // Get users from auth context instead of mock data
  const { getRatingsByUser } = useRatings()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  // Only admins can access this page
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "store_owner":
        return <Store className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const
      case "store_owner":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setShowAddDialog(true)
  }

  const handleEditUser = (userData: any) => {
    setEditingUser(userData)
    setShowAddDialog(true)
  }

  const handleDialogSuccess = () => {
    setShowAddDialog(false)
    setEditingUser(null)
    // In a real app, you would refresh the users list here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <Button onClick={handleAddUser}>Add User</Button>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p> {/* Use real users count */}
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Store Owners</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "store_owner").length}</p>{" "}
                {/* Use real users count */}
              </div>
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</p>{" "}
                {/* Use real users count */}
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userData) => {
              // Use real users instead of mockUsers
              const userReviews = getRatingsByUser(userData.id)
              return (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">{userData.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{userData.name}</p>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{userReviews.length} reviews</p>
                      <p className="text-xs text-muted-foreground">
                        Avg:{" "}
                        {userReviews.length > 0
                          ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
                          : "0.0"}
                      </p>
                    </div>
                    <Badge variant={getRoleBadgeVariant(userData.role)} className="flex items-center space-x-1">
                      {getRoleIcon(userData.role)}
                      <span className="capitalize">{userData.role.replace("_", " ")}</span>
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(userData)}>
                      Manage
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        user={editingUser}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
