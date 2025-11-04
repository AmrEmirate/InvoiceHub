"use client"

import { useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  company: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
    setLoading(false)
  }, [])

  return { user, loading }
}
