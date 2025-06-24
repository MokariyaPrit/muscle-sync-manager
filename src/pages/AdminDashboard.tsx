"use client"

import { useState } from "react"
import { UserManagement } from "@/components/UserManagement"
import BookingRequests from "@/components/BookingRequests"
import { ClassScheduler } from "@/components/ClassScheduler"
import { StatsCard } from "@/components/ui/stats-card"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Settings, BarChart3, Activity, UserCheck, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data for system health and analytics
const systemHealth = {
  serverStatus: "online",
  databaseStatus: "online",
  lastBackup: "2024-01-15 02:00 AM",
  activeUsers: 156,
  systemLoad: 65,
}

const recentActivities = [
  { id: 1, action: "New member registered", user: "John Doe", time: "2 minutes ago", type: "success" },
  { id: 2, action: "Class booking cancelled", user: "Jane Smith", time: "5 minutes ago", type: "warning" },
  { id: 3, action: "Payment processed", user: "Mike Johnson", time: "10 minutes ago", type: "success" },
  { id: 4, action: "Staff member added", user: "Admin", time: "15 minutes ago", type: "info" },
]

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview")

  const statsData = [
    {
      title: "Total Members",
      value: "1,245",
      icon: <Users className="h-4 w-4" />,
      trend: { value: "+12%", isPositive: true },
      subtitle: "from last month",
    },
    {
      title: "Active Classes",
      value: "45",
      icon: <Calendar className="h-4 w-4" />,
      subtitle: "Across all regions",
    },
    {
      title: "Staff Members",
      value: "28",
      icon: <Settings className="h-4 w-4" />,
      trend: { value: "+2", isPositive: true },
      subtitle: "this month",
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      icon: <BarChart3 className="h-4 w-4" />,
      trend: { value: "+8%", isPositive: true },
      subtitle: "from last month",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your gym operations with ease</p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-card/70 px-3 py-1 rounded-lg backdrop-blur-sm border">
          <Activity className="h-4 w-4 text-green-500" />
          Live Dashboard
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Server Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold capitalize">{systemHealth.serverStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold capitalize">{systemHealth.databaseStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-lg font-semibold">{systemHealth.activeUsers}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Load</p>
              <div className="mt-1">
                <p className="text-lg font-semibold">{systemHealth.systemLoad}%</p>
                <Progress value={systemHealth.systemLoad} className="mt-1" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
              <p className="text-sm font-semibold">{systemHealth.lastBackup}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different admin sections */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Add Member
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <UserCheck className="h-6 w-6" />
                  Add Staff
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Schedule Class
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <CollapsibleCard title="User Management" icon={<Users className="h-5 w-5 text-primary" />} defaultOpen={true}>
            <UserManagement />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <CollapsibleCard
            title="Booking Requests"
            icon={<Calendar className="h-5 w-5 text-primary/80" />}
            defaultOpen={true}
          >
            <BookingRequests />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <CollapsibleCard
            title="Class Scheduler"
            icon={<Settings className="h-5 w-5 text-primary/60" />}
            defaultOpen={true}
          >
            <ClassScheduler />
          </CollapsibleCard>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AdminDashboard
  