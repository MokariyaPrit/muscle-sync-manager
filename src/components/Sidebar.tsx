"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import {
  User,
  Calendar,
  Check,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  Users,
  BookCheckIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import UpgradePlanCard from "./UpgradePlanCard"

const menuItems = [
  { icon: BookCheckIcon, label: "BookClass", path: "/book-class", allowedRoles: ["admin", "manager", "customer"] },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", allowedRoles: ["admin", "manager", "customer"] },
  { icon: ArrowUp, label: "Payments", path: "/payments", allowedRoles: ["admin", "manager","customer"] },
  { icon: Users, label: "Members", path: "/members", allowedRoles: ["admin", "manager"] },
  { icon: Users, label: "BookingRequests", path: "/booking-requests", allowedRoles: ["admin", "manager"] },
  { icon: User, label: "Staff", path: "/staff", allowedRoles: ["admin"] },
  { icon: Calendar, label: "Attendance", path: "/attendance", allowedRoles: ["admin", "manager"] },
  { icon: Check, label: "Memberships", path: "/memberships", allowedRoles: ["admin", "manager"] }, 
  { icon: ArrowDown, label: "Reports", path: "/reports", allowedRoles: ["admin", "manager"] },
]

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  if (!user) return null

  return (
    <aside
      className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        "h-[calc(100vh-64px)]", // Adjust for header height
      )}
    >
      <nav className="p-4 space-y-2 h-full flex flex-col">
        {/* Header with collapse button */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Main Menu</h2>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 ml-auto">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {menuItems
            .filter((item) => item.allowedRoles.includes(user.role))
            .map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full transition-all duration-200",
                      collapsed ? "justify-center px-2" : "justify-start space-x-3",
                      "h-12",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:from-primary/90 hover:to-primary/70"
                        : "hover:bg-accent text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Button>
                </Link>
              )
            })}
        </div>

        {/* Upgrade Section */}
        {!collapsed && (
         <UpgradePlanCard />
        )}
      </nav>
    </aside>
  )
}
 