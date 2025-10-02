export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "store_owner" | "customer"
  createdAt: string
}

export interface UserFormData {
  name: string
  email: string
  role: "admin" | "store_owner" | "customer"
  password: string
}

export const USER_ROLES = ["admin", "store_owner", "customer"] as const
