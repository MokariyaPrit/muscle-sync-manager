"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const DashboardRedirect = () => {
  const { user } = useAuth()
  const router = useNavigate()

  useEffect(() => {
    if (!user) return

    const role = user.role

    if (role === "admin") {
      router("/admin")
    } else if (role === "manager") {
      router("/manager")
    } else if (role === "customer") {
      router("/customer")  
    } else {
      router("/unauthorized") // fallback or error page
    }
  }, [user, router])

  return <p>Redirecting to your dashboard...</p>
}

export default DashboardRedirect
  