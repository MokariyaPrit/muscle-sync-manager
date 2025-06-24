import type React from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children?: React.ReactNode
}

// Public layout for landing, login, signup pages (no sidebar)
export function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">{children || <Outlet />}</main>
    </div>
  )
}

// Dashboard layout with sidebar for protected pages
export function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 space-y-6 max-w-full overflow-hidden">{children || <Outlet />}</main>
      </div>
    </div>
  )
}
  